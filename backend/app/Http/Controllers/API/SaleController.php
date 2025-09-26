<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\WalletAccount;
use App\Models\WalletTransaction;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Sale::with(['customer', 'items.product', 'walletTransactions', 'sales_transactions']);
        // Filters: customer, date range, mode
        if ($request->customer_id) {
            $query->where('customer_id', $request->customer_id);
        }
        if ($request->mode) {
            $query->where('mode', $request->mode);
        }
        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        $sales = $query->orderBy('id', 'desc')->paginate($request->get('per_page', 20));
        return response()->json($sales);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|numeric|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric',
            'items.*.tax' => 'nullable|numeric',
            'subtotal' => 'required|numeric|min:0',
            'total_discount' => 'required|numeric|min:0',
            'total_tax' => 'required|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
            'rounded_total' => 'required|numeric|min:0',
            'round_off' => 'required|numeric',
            'paid' => 'required|numeric|min:0',
            'due' => 'required|numeric|min:0',
            'mode' => 'required|string',
            'cash' => 'nullable|numeric|min:0',
            'card' => 'nullable|numeric|min:0',
            'upi' => 'nullable|numeric|min:0',
            'wallet' => 'nullable|numeric|min:0',
        ]);

        // Calculate total paid and due for validation
        $totalPaid = ($validated['cash'] ?? 0) + ($validated['card'] ?? 0) + ($validated['upi'] ?? 0) + ($validated['wallet'] ?? 0);
        $due = $validated['rounded_total'] - $totalPaid;
        if ($due < 0) {
            return response()->json(['message' => 'Overpayment is not allowed.'], 422);
        }

        return DB::transaction(function () use ($validated, $totalPaid, $due) {
            // Create sale
            $sale = Sale::create([
                'customer_id' => $validated['customer_id'] ?? null,
                'subtotal' => $validated['subtotal'],
                'total_discount' => $validated['total_discount'],
                'total_tax' => $validated['total_tax'],
                'grand_total' => $validated['grand_total'],
                'rounded_total' => $validated['rounded_total'],
                'round_off' => $validated['round_off'],
                'paid' => $totalPaid,
                'due' => $due,
                'mode' => $validated['mode'],
                'invoice_ref' => null, // Set after creation
            ]);

            // Update invoice_ref to use the sale ID, zero-padded to at least 4 digits
            $sale->invoice_ref = 'INV-' . str_pad($sale->id, 4, '0', STR_PAD_LEFT);
            $sale->save();

            // Create sale items and reduce stock
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                // Reduce stock
                $product->opening_stock = max(0, $product->opening_stock - $item['qty']);
                $product->save();
                // Create sale item
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'discount' => $item['discount'] ?? 0,
                    'tax' => $item['tax'] ?? 0,
                    'subtotal' => $item['subtotal'] ?? ($item['qty'] * $item['price']),
                    'purchase_price' => $product->purchase_price,
                    'last_purchase_price' => $product->last_purchase_price,
                ]);
            }

            // Save payment breakdown in sales_transactions
            $paymentTypes = ['cash', 'card', 'upi', 'wallet'];
            foreach ($paymentTypes as $type) {
                $amount = $validated[$type] ?? 0;
                if ($amount > 0) {
                    \DB::table('sales_transactions')->insert([
                        'sale_id' => $sale->id,
                        'payment_type' => $type,
                        'amount' => $amount,
                        'description' => ucfirst($type) . ' payment',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // Handle wallet payment (deduct from wallet and create wallet transaction)
            if (($validated['wallet'] ?? 0) > 0 && $sale->customer_id) {
                $customer = $sale->customer;
                $partyType = ($customer && $customer->type === 'retailer') ? 'retailer' : 'customer';
                $walletAccount = WalletAccount::firstOrCreate(
                    [
                        'party_type' => $partyType,
                        'party_id' => $sale->customer_id,
                    ],
                    [
                        'current_balance' => 0,
                    ]
                );
                // Check available balance
                if ($walletAccount->current_balance < $validated['wallet']) {
                    throw new \Exception('Insufficient wallet balance.');
                }
                // Add wallet transaction (debit)
                $walletAccount->addTransaction(
                    'debit',
                    $validated['wallet'],
                    'POS payment for invoice ' . $sale->invoice_ref,
                    'wallet',
                    $sale->id,  // reference should be sale ID (149), not invoice_ref (INV-0149)
                    $sale->id  // invoice_id
                );
                // Recalculate wallet balance
                $walletAccount->recalculateCurrentBalance();
            }

            // Wallet as credit ledger: If there is a due, immediately add a negative wallet transaction, mark sale as paid, and add sales_transactions entry for wallet
            if ($due > 0 && $sale->customer_id) {
                $customer = $sale->customer;
                $partyType = ($customer && $customer->type === 'retailer') ? 'retailer' : 'customer';
                $walletAccount = WalletAccount::firstOrCreate(
                    [
                        'party_type' => $partyType,
                        'party_id' => $sale->customer_id,
                    ],
                    [
                        'current_balance' => 0,
                    ]
                );
                // Add negative wallet transaction (debit)
                $walletAccount->addTransaction(
                    'debit',
                    $due,
                    'Credit sale (due) for invoice ' . $sale->invoice_ref,
                    'wallet',
                    $sale->id,  // reference should be sale ID (149), not invoice_ref (INV-0149)
                    $sale->id  // invoice_id
                );
                $walletAccount->recalculateCurrentBalance();
                // Mark sale as paid by wallet, due = 0
                $sale->paid += $due;
                $sale->due = 0;
                $sale->save();
                // Add sales_transactions entry for wallet
                \DB::table('sales_transactions')->insert([
                    'sale_id' => $sale->id,
                    'payment_type' => 'wallet',
                    'amount' => $due,
                    'description' => 'Wallet credit (due) payment',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return response()->json([
                'message' => 'Sale completed and invoice created!',
                'invoice_ref' => $sale->invoice_ref,
                'sale' => $sale->load(['customer', 'items.product', 'walletTransactions'])
            ], 201);
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $sale = Sale::with(['customer', 'items.product', 'walletTransactions'])->findOrFail($id);
        // Fetch payment transactions
        $sale->sales_transactions = \DB::table('sales_transactions')->where('sale_id', $sale->id)->get();
        return response()->json($sale);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            // Debug: Check if models are accessible
            \Log::info('Starting sale update for ID: ' . $id);
            \Log::info('Customer model class: ' . get_class(new Customer()));
            \Log::info('WalletAccount model class: ' . get_class(new WalletAccount()));
            \Log::info('WalletTransaction model class: ' . get_class(new WalletTransaction()));
            
            // Debug: Check database connection
            try {
                \DB::connection()->getPdo();
                \Log::info('Database connection successful');
                \Log::info('Database name: ' . \DB::connection()->getDatabaseName());
                
                // Test model access
                $customerCount = Customer::count();
                $walletAccountCount = WalletAccount::count();
                \Log::info('Model access test - Customer count: ' . $customerCount . ', WalletAccount count: ' . $walletAccountCount);
                
                // Check if wallet_accounts table exists
                try {
                    $tableExists = \DB::select("SHOW TABLES LIKE 'wallet_accounts'");
                    if (empty($tableExists)) {
                        \Log::error('wallet_accounts table does not exist!');
                        throw new \Exception('wallet_accounts table does not exist. Please run migrations.');
                    } else {
                        \Log::info('wallet_accounts table exists');
                        
                        // Check table structure
                        $columns = \DB::select('DESCRIBE wallet_accounts');
                        $columnInfo = array_map(function($col) {
                            return $col->Field . ' (' . $col->Type . ')';
                        }, $columns);
                        \Log::info('Wallet accounts table columns: ' . implode(', ', $columnInfo));
                        
                        // Test wallet account creation
                        if ($customerCount > 0) {
                            $testCustomer = Customer::first();
                            \Log::info('Test customer found: ' . $testCustomer->name . ' with type: ' . $testCustomer->type);
                            
                            try {
                                $testWalletAccount = WalletAccount::where('party_type', $testCustomer->type)
                                    ->where('party_id', $testCustomer->id)
                                    ->first();
                                
                                if (!$testWalletAccount) {
                                    \Log::info('Test: Creating test wallet account');
                                    $testWalletAccount = WalletAccount::create([
                                        'party_type' => $testCustomer->type,
                                        'party_id' => $testCustomer->id,
                                        'current_balance' => 0
                                    ]);
                                    \Log::info('Test: Wallet account created successfully with ID: ' . $testWalletAccount->id);
                                } else {
                                    \Log::info('Test: Wallet account already exists with ID: ' . $testWalletAccount->id);
                                }
                            } catch (\Exception $e) {
                                \Log::error('Test: Failed to create wallet account: ' . $e->getMessage());
                                \Log::error('Test: Stack trace: ' . $e->getTraceAsString());
                            }
                        }
                    }
                } catch (\Exception $e) {
                    \Log::error('Failed to check table existence: ' . $e->getMessage());
                }
                
            } catch (\Exception $e) {
                \Log::error('Database connection failed: ' . $e->getMessage());
                throw new \Exception('Database connection failed: ' . $e->getMessage());
            }
            
            $validated = $request->validate([
                'customer_id' => 'nullable|exists:customers,id',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.qty' => 'required|numeric|min:1',
                'items.*.price' => 'required|numeric|min:0',
                'items.*.discount' => 'nullable|numeric',
                'items.*.tax' => 'nullable|numeric',
                'items.*.subtotal' => 'required|numeric|min:0',
                'subtotal' => 'required|numeric|min:0',
                'total_discount' => 'required|numeric|min:0',
                'total_tax' => 'required|numeric|min:0',
                'grand_total' => 'required|numeric|min:0',
                'rounded_total' => 'required|numeric|min:0',
                'round_off' => 'required|numeric',
                'paid' => 'required|numeric|min:0',
                'due' => 'required|numeric|min:0',
                'mode' => 'required|string',
                'cash' => 'nullable|numeric|min:0',
                'card' => 'nullable|numeric|min:0',
                'upi' => 'nullable|numeric|min:0',
                'wallet' => 'nullable|numeric|min:0',
            ]);

            // Calculate total paid and due for validation
            $totalPaid = ($validated['cash'] ?? 0) + ($validated['card'] ?? 0) + ($validated['upi'] ?? 0) + ($validated['wallet'] ?? 0);
            $due = $validated['rounded_total'] - $totalPaid;
            
            // In edit mode, we need to handle payment validation differently
            // The payment amounts represent the original payments, not new ones
            // If due < 0, it means customer gets credit (e.g., quantity reduced from 2 to 1)
            if ($due < 0) {
                // For edit mode, this might be a legitimate case where customer gets credit
                // We'll allow negative due (customer credit) but log it
                \Log::info("Edit mode: Customer gets credit of £" . abs($due) . " for sale " . $id);
            }

            return DB::transaction(function () use ($validated, $totalPaid, $due, $id) {
                // Find existing sale
                $sale = Sale::findOrFail($id);
                
                // Store original values for comparison
                $originalTotal = $sale->rounded_total;
                $originalItems = $sale->items->keyBy('product_id');
                
                // Update sale
                $sale->update([
                    'customer_id' => $validated['customer_id'] ?? null,
                    'subtotal' => $validated['subtotal'],
                    'total_discount' => $validated['total_discount'],
                    'total_tax' => $validated['total_tax'],
                    'grand_total' => $validated['grand_total'],
                    'rounded_total' => $validated['rounded_total'],
                    'round_off' => $validated['round_off'],
                    'paid' => $totalPaid,
                    'due' => 0, // In edit mode, due is always 0 since customer gets credit
                    'mode' => $validated['mode'],
                ]);

                // Handle stock adjustments
                foreach ($originalItems as $productId => $originalItem) {
                    $product = Product::find($productId);
                    if ($product) {
                        // Add back the original quantity to stock
                        $product->opening_stock += $originalItem->qty;
                        $product->save();
                    }
                }

                // Delete existing sale items
                $sale->items()->delete();

                // Create new sale items and adjust stock
                foreach ($validated['items'] as $item) {
                    $product = Product::find($item['product_id']);
                    if ($product) {
                        // Reduce stock for new quantity
                        $product->opening_stock = max(0, $product->opening_stock - $item['qty']);
                        $product->save();
                    }
                    
                    $sale->items()->create([
                        'product_id' => $item['product_id'],
                        'qty' => $item['qty'],
                        'price' => $item['price'],
                        'discount' => $item['discount'] ?? 0,
                        'tax' => $item['tax'] ?? 0,
                        'subtotal' => $item['subtotal'] ?? 0,
                        'purchase_price' => $product ? $product->purchase_price : 0,
                        'last_purchase_price' => $product ? $product->last_purchase_price : 0,
                    ]);
                }

                // Handle wallet balance adjustments if total changed
                // REMOVED: No more transaction changes during edit mode
                // Transactions will be handled separately via "Adjust Amount" button
                
                // Just log the difference for reference
                if ($sale->customer_id && abs($validated['rounded_total'] - $originalTotal) > 0.01) {
                    \Log::info('=== EDIT MODE - NO TRANSACTION CHANGES ===');
                    \Log::info('Sale ID: ' . $sale->id);
                    \Log::info('Original Total: ' . $originalTotal);
                    \Log::info('New Total: ' . $validated['rounded_total']);
                    \Log::info('Total Difference: ' . ($validated['rounded_total'] - $originalTotal));
                    \Log::info('Customer ID: ' . $sale->customer_id);
                    \Log::info('NOTE: Transactions unchanged - use "Adjust Amount" button to adjust payments');
                }

                // Load updated sale with relationships
                $updatedSale = Sale::with(['customer', 'items.product', 'walletTransactions'])->find($sale->id);
                $updatedSale->sales_transactions = \DB::table('sales_transactions')
                    ->where('sale_id', $sale->id)
                    ->get();

                return response()->json([
                    'success' => true,
                    'message' => 'Sale updated successfully',
                    'sale' => $updatedSale,
                    'changes' => [
                        'total_difference' => $validated['rounded_total'] - $originalTotal,
                        'stock_adjusted' => true,
                        'wallet_adjusted' => $sale->customer_id && abs($validated['rounded_total'] - $originalTotal) > 0.01
                    ]
                ]);
            });
        } catch (\Exception $e) {
            \Log::error('Sale update failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update sale: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Export the specified sale as a PDF invoice.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function exportPdf($id)
    {
        $invoice = Sale::with(['customer', 'items.product', 'walletTransactions'])->findOrFail($id);
        // Fetch payment transactions
        $invoice->sales_transactions = \DB::table('sales_transactions')
            ->where('sale_id', $invoice->id)
            ->get();
        // Fetch company info from settings (group = 'billing')
        $company = \DB::table('settings')
            ->where('group', 'billing')
            ->pluck('value', 'key')
            ->toArray();
        // Fetch site settings
        $siteSettings = \DB::table('settings')
            ->where('group', 'siteSettings')
            ->pluck('value', 'key')
            ->toArray();
        return app(\App\Services\PdfExportService::class)
            ->export('pdf.invoice', [
                'invoice' => $invoice,
                'company' => $company,
                'siteSettings' => $siteSettings
            ], 'Invoice-' . $invoice->id . '.pdf');
    }

    /**
     * Export the specified sale as a short PDF (delivery note).
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function exportShortPdf($id)
    {
        $invoice = Sale::with(['customer', 'items.product'])->findOrFail($id);
        // Fetch company info from settings (group = 'billing')
        $company = \DB::table('settings')
            ->where('group', 'billing')
            ->pluck('value', 'key')
            ->toArray();
        // Fetch site settings
        $siteSettings = \DB::table('settings')
            ->where('group', 'siteSettings')
            ->pluck('value', 'key')
            ->toArray();
        return app(\App\Services\PdfExportService::class)
            ->export('pdf.invoice-short', [
                'invoice' => $invoice,
                'company' => $company,
                'siteSettings' => $siteSettings
            ], 'DeliveryNote-' . $invoice->id . '.pdf');
    }

    /**
     * Sales Summary Report
     */
    public function salesSummary(Request $request)
    {
        $groupBy = $request->get('group_by', 'day');
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        // Determine group by expression
        switch ($groupBy) {
            case 'month':
                $groupExpr = DB::raw("DATE_FORMAT(sale_items.created_at, '%Y-%m')");
                $labelExpr = DB::raw("DATE_FORMAT(sale_items.created_at, '%b %Y')");
                break;
            case 'year':
                $groupExpr = DB::raw("YEAR(sale_items.created_at)");
                $labelExpr = DB::raw("YEAR(sale_items.created_at)");
                break;
            case 'week':
                $groupExpr = DB::raw("YEARWEEK(sale_items.created_at, 1)");
                $labelExpr = DB::raw("CONCAT('Week ', WEEK(sale_items.created_at, 1), ' ', YEAR(sale_items.created_at))");
                break;
            case 'day':
            default:
                $groupExpr = DB::raw("DATE(sale_items.created_at)");
                $labelExpr = DB::raw("DATE(sale_items.created_at)");
                break;
        }

        // Adjust select and groupBy for MySQL strict mode
        $select = [
            DB::raw($groupExpr . ' as group_key'),
            DB::raw('SUM((price * qty) - discount) as net_sales'),
            DB::raw('SUM(purchase_price * qty) as total_cost'),
            DB::raw('SUM(((price * qty) - discount) - (purchase_price * qty)) as gross_profit'),
            DB::raw('CASE WHEN SUM((price * qty) - discount) > 0 THEN ROUND(SUM(((price * qty) - discount) - (purchase_price * qty)) / SUM((price * qty) - discount) * 100, 2) ELSE 0 END as margin_percent'),
            DB::raw('SUM(tax) as vat'),
        ];
        if ($groupBy === 'week' || $groupBy === 'month') {
            $select[] = DB::raw($labelExpr . ' as label');
        }
        $query = DB::table('sale_items')->select($select);

        if ($dateFrom) {
            $query->whereDate('sale_items.created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('sale_items.created_at', '<=', $dateTo);
        }

        // Group by only groupExpr (and labelExpr for week/month)
        if ($groupBy === 'week' || $groupBy === 'month') {
            $query->groupBy(DB::raw($groupExpr), DB::raw($labelExpr));
        } else {
            $query->groupBy(DB::raw($groupExpr));
        }
        $query->orderBy('group_key');

        $rows = $query->get()->map(function($row) use ($groupBy) {
            if ($groupBy === 'day' || $groupBy === 'year') {
                $row->label = $row->group_key;
            }
            return $row;
        });

        // Grand totals
        $totals = [
            'net_sales' => $rows->sum('net_sales'),
            'total_cost' => $rows->sum('total_cost'),
            'gross_profit' => $rows->sum('gross_profit'),
            'margin_percent' => $rows->sum('net_sales') > 0 ? round($rows->sum('gross_profit') / $rows->sum('net_sales') * 100, 2) : 0,
            'vat' => $rows->sum('vat'),
        ];

        return response()->json([
            'data' => $rows,
            'totals' => $totals,
        ]);
    }

    /**
     * Company Profit & Loss (P&L) Report
     */
    public function profitLossReport(Request $request)
    {
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        // Calculate previous period
        $from = $dateFrom ? new \DateTime($dateFrom) : null;
        $to = $dateTo ? new \DateTime($dateTo) : null;
        $interval = $from && $to ? $from->diff($to)->days + 1 : 0;
        $prevFrom = $from ? (clone $from)->modify("-{$interval} days")->format('Y-m-d') : null;
        $prevTo = $from ? (clone $from)->modify('-1 day')->format('Y-m-d') : null;

        // Sales summary (current)
        $salesQuery = DB::table('sale_items')
            ->select([
                DB::raw('SUM((price * qty) - discount) as net_sales'),
                DB::raw('SUM(purchase_price * qty) as total_cost'),
                DB::raw('SUM(((price * qty) - discount) - (purchase_price * qty)) as gross_profit'),
                DB::raw('SUM(tax) as vat'),
            ]);
        if ($dateFrom) $salesQuery->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $salesQuery->whereDate('created_at', '<=', $dateTo);
        $sales = (array) $salesQuery->first();

        // Sales summary (previous period)
        $prevSales = [ 'net_sales' => 0, 'total_cost' => 0, 'gross_profit' => 0, 'vat' => 0 ];
        if ($prevFrom && $prevTo) {
            $prevSalesQuery = DB::table('sale_items')
                ->select([
                    DB::raw('SUM((price * qty) - discount) as net_sales'),
                    DB::raw('SUM(purchase_price * qty) as total_cost'),
                    DB::raw('SUM(((price * qty) - discount) - (purchase_price * qty)) as gross_profit'),
                    DB::raw('SUM(tax) as vat'),
                ])
                ->whereDate('created_at', '>=', $prevFrom)
                ->whereDate('created_at', '<=', $prevTo);
            $prevSales = (array) $prevSalesQuery->first();
        }

        // Expenses summary (current)
        $expenseQuery = DB::table('expenses')
            ->select(DB::raw('SUM(amount) as total_expenses'));
        if ($dateFrom) $expenseQuery->whereDate('date', '>=', $dateFrom);
        if ($dateTo) $expenseQuery->whereDate('date', '<=', $dateTo);
        $expenses = (array) $expenseQuery->first();

        // Expenses summary (previous period)
        $prevExpenses = [ 'total_expenses' => 0 ];
        if ($prevFrom && $prevTo) {
            $prevExpenseQuery = DB::table('expenses')
                ->select(DB::raw('SUM(amount) as total_expenses'))
                ->whereDate('date', '>=', $prevFrom)
                ->whereDate('date', '<=', $prevTo);
            $prevExpenses = (array) $prevExpenseQuery->first();
        }

        // Net profit
        $netProfit = ($sales['gross_profit'] ?? 0) - ($expenses['total_expenses'] ?? 0);
        $marginPercent = ($sales['net_sales'] ?? 0) > 0 ? round($netProfit / $sales['net_sales'] * 100, 2) : 0;
        $prevNetProfit = ($prevSales['gross_profit'] ?? 0) - ($prevExpenses['total_expenses'] ?? 0);
        $prevMarginPercent = ($prevSales['net_sales'] ?? 0) > 0 ? round($prevNetProfit / $prevSales['net_sales'] * 100, 2) : 0;

        // Daily breakdown for charts
        $breakdown = DB::table('sale_items')
            ->select([
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM((price * qty) - discount) as net_sales'),
                DB::raw('SUM(purchase_price * qty) as total_cost'),
                DB::raw('SUM(((price * qty) - discount) - (purchase_price * qty)) as gross_profit'),
                DB::raw('SUM(tax) as vat'),
            ])
            ->when($dateFrom, fn($q) => $q->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('created_at', '<=', $dateTo))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        // Expense breakdown by category
        $expenseBreakdown = DB::table('expenses')
            ->join('expense_categories', 'expenses.expense_category_id', '=', 'expense_categories.id')
            ->select([
                'expense_categories.name as category',
                DB::raw('SUM(expenses.amount) as total')
            ])
            ->when($dateFrom, fn($q) => $q->whereDate('expenses.date', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('expenses.date', '<=', $dateTo))
            ->groupBy('expense_categories.name')
            ->orderByDesc('total')
            ->get();

        // Best/worst day for net profit
        $bestDay = null; $worstDay = null; $avgDailySales = 0; $avgDailyProfit = 0;
        if ($breakdown->count() > 0) {
            $bestDay = $breakdown->sortByDesc('gross_profit')->first();
            $worstDay = $breakdown->sortBy('gross_profit')->first();
            $avgDailySales = round($breakdown->avg('net_sales'), 2);
            $avgDailyProfit = round($breakdown->avg('gross_profit'), 2);
        }

        // % change helpers
        $percentChange = function($current, $prev) {
            if ($prev == 0) return $current == 0 ? 0 : 100;
            return round((($current - $prev) / abs($prev)) * 100, 2);
        };

        return response()->json([
            'net_sales' => $sales['net_sales'] ?? 0,
            'total_cost' => $sales['total_cost'] ?? 0,
            'gross_profit' => $sales['gross_profit'] ?? 0,
            'total_expenses' => $expenses['total_expenses'] ?? 0,
            'net_profit' => $netProfit,
            'margin_percent' => $marginPercent,
            'vat' => $sales['vat'] ?? 0,
            'previous' => [
                'net_sales' => $prevSales['net_sales'] ?? 0,
                'total_cost' => $prevSales['total_cost'] ?? 0,
                'gross_profit' => $prevSales['gross_profit'] ?? 0,
                'total_expenses' => $prevExpenses['total_expenses'] ?? 0,
                'net_profit' => $prevNetProfit,
                'margin_percent' => $prevMarginPercent,
                'vat' => $prevSales['vat'] ?? 0,
            ],
            'percent_change' => [
                'net_sales' => $percentChange($sales['net_sales'] ?? 0, $prevSales['net_sales'] ?? 0),
                'total_cost' => $percentChange($sales['total_cost'] ?? 0, $prevSales['total_cost'] ?? 0),
                'gross_profit' => $percentChange($sales['gross_profit'] ?? 0, $prevSales['gross_profit'] ?? 0),
                'total_expenses' => $percentChange($expenses['total_expenses'] ?? 0, $prevExpenses['total_expenses'] ?? 0),
                'net_profit' => $percentChange($netProfit, $prevNetProfit),
                'margin_percent' => $percentChange($marginPercent, $prevMarginPercent),
                'vat' => $percentChange($sales['vat'] ?? 0, $prevSales['vat'] ?? 0),
            ],
            'breakdown' => $breakdown,
            'expense_breakdown' => $expenseBreakdown,
            'best_day' => $bestDay,
            'worst_day' => $worstDay,
            'avg_daily_sales' => $avgDailySales,
            'avg_daily_profit' => $avgDailyProfit,
        ]);
    }

    /**
     * Adjust amount for a sale (separate from edit mode)
     * This handles payment adjustments when paid amount differs from total
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function adjustAmount(Request $request, $id)
    {
        try {
            \Log::info('=== ADJUST AMOUNT START ===');
            \Log::info('Sale ID: ' . $id);
            
            // Find the sale
            $sale = Sale::with(['customer', 'items.product', 'sales_transactions'])->findOrFail($id);
            
            if (!$sale->customer_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot adjust amount for walk-in customers'
                ], 422);
            }
            
            // Calculate current totals
            $currentTotal = $sale->rounded_total;
            $currentPaid = $sale->paid;
            $currentDue = $sale->due;
            
            \Log::info('Current Total: ' . $currentTotal);
            \Log::info('Current Paid: ' . $currentPaid);
            \Log::info('Current Due: ' . $currentDue);
            
            // Get customer and wallet account
            $customer = Customer::find($sale->customer_id);
            $partyType = $customer->type === 'retailer' ? 'retailer' : 'customer';
            
            $walletAccount = WalletAccount::where('party_type', $partyType)
                ->where('party_id', $sale->customer_id)
                ->first();
                
            if (!$walletAccount) {
                $walletAccount = WalletAccount::create([
                    'party_type' => $partyType,
                    'party_id' => $sale->customer_id,
                    'current_balance' => 0
                ]);
            }
            
            \Log::info('Wallet Account ID: ' . $walletAccount->id . ', Current Balance: ' . $walletAccount->current_balance);
            
            // Calculate adjustment needed
            $adjustmentNeeded = $currentTotal - $currentPaid;
            
            \Log::info('Adjustment Needed: ' . $adjustmentNeeded);
            
            if (abs($adjustmentNeeded) < 0.01) {
                return response()->json([
                    'success' => false,
                    'message' => 'No adjustment needed - amounts are already balanced'
                ], 422);
            }
            
            return DB::transaction(function () use ($sale, $walletAccount, $adjustmentNeeded, $currentTotal, $currentPaid) {
                
                if ($adjustmentNeeded > 0) {
                    // Customer owes more - need to debit wallet
                    \Log::info('Customer owes more - processing DEBIT adjustment');
                    
                    // Find or create wallet transaction
                    $existingWalletTransaction = WalletTransaction::where('wallet_id', $walletAccount->id)
                        ->where('reference', $sale->id)
                        ->first();
                    
                    if ($existingWalletTransaction) {
                        // Update existing transaction
                        $existingWalletTransaction->update([
                            'type' => 'debit',
                            'amount' => $existingWalletTransaction->amount + $adjustmentNeeded,
                            'description' => 'Amount adjustment for invoice #' . $sale->invoice_ref . ' - Customer owes £' . $adjustmentNeeded . ' more',
                            'updated_at' => now(),
                        ]);
                    } else {
                        // Create new transaction
                        $walletAccount->addTransaction(
                            'debit',
                            $adjustmentNeeded,
                            'Amount adjustment for invoice #' . $sale->invoice_ref . ' - Customer owes £' . $adjustmentNeeded . ' more',
                            'wallet',
                            $sale->id,
                            $sale->id
                        );
                    }
                    
                    // Update sales_transactions
                    $existingSalesTransaction = \DB::table('sales_transactions')
                        ->where('sale_id', $sale->id)
                        ->where('payment_type', 'wallet')
                        ->first();
                    
                    if ($existingSalesTransaction) {
                        // Update existing wallet record
                        \DB::table('sales_transactions')
                            ->where('id', $existingSalesTransaction->id)
                            ->update([
                                'amount' => $existingSalesTransaction->amount + $adjustmentNeeded,
                                'description' => 'Wallet payment: £' . $existingSalesTransaction->amount . ' + Additional: £' . $adjustmentNeeded . ' = £' . ($existingSalesTransaction->amount + $adjustmentNeeded),
                                'updated_at' => now(),
                            ]);
                    } else {
                        // Create new wallet record
                        \DB::table('sales_transactions')->insert([
                            'sale_id' => $sale->id,
                            'payment_type' => 'wallet',
                            'amount' => $adjustmentNeeded,
                            'description' => 'Additional payment needed: £' . $adjustmentNeeded,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                    
                    // Update sale
                    $sale->update([
                        'paid' => $currentPaid + $adjustmentNeeded,
                        'due' => 0
                    ]);
                    
                } else {
                    // Customer gets credit - need to credit wallet
                    \Log::info('Customer gets credit - processing CREDIT adjustment');
                    
                    $creditAmount = abs($adjustmentNeeded);
                    
                    // Find or create wallet transaction
                    $existingWalletTransaction = WalletTransaction::where('wallet_id', $walletAccount->id)
                        ->where('reference', $sale->id)
                        ->first();
                    
                    if ($existingWalletTransaction) {
                        // Update existing transaction
                        // IMPORTANT: Keep original type, just adjust amount
                        $existingWalletTransaction->update([
                            'type' => $existingWalletTransaction->type, // Keep original type (debit/credit)
                            'amount' => $existingWalletTransaction->amount - $creditAmount, // REDUCE the amount
                            'description' => 'Amount adjustment for invoice #' . $sale->invoice_ref . ' - Customer overpaid by £' . $creditAmount . ', amount reduced',
                            'updated_at' => now(),
                        ]);
                    } else {
                        // Create new transaction
                        $walletAccount->addTransaction(
                            'credit', // New transaction for overpayment
                            $creditAmount,
                            'Amount adjustment for invoice #' . $sale->invoice_ref . ' - Customer overpaid by £' . $creditAmount,
                            'wallet',
                            $sale->id,
                            $sale->id
                        );
                    }
                    
                    // Update sales_transactions
                    $existingSalesTransaction = \DB::table('sales_transactions')
                        ->where('sale_id', $sale->id)
                        ->where('payment_type', 'wallet')
                        ->first();
                    
                    if ($existingSalesTransaction) {
                        // Update existing wallet record
                        // IMPORTANT: When customer gets credit, amount should DECREASE
                        \DB::table('sales_transactions')
                            ->where('id', $existingSalesTransaction->id)
                            ->update([
                                'amount' => $existingSalesTransaction->amount - $creditAmount, // SUBTRACT credit amount
                                'description' => 'Wallet payment: £' . $existingSalesTransaction->amount . ' - Credit: £' . $creditAmount . ' = £' . ($existingSalesTransaction->amount - $creditAmount),
                                'updated_at' => now(),
                            ]);
                    } else {
                        // Create new wallet record
                        \DB::table('sales_transactions')->insert([
                            'sale_id' => $sale->id,
                            'payment_type' => 'wallet',
                            'amount' => $creditAmount,
                            'description' => 'Credit adjustment: £' . $creditAmount . ' added to wallet',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                    
                    // Update sale
                    $sale->update([
                        'paid' => $currentPaid - $creditAmount, // FIXED: Subtract credit amount, not add!
                        'due' => 0
                    ]);
                }
                
                // Recalculate wallet balance
                $walletAccount->recalculateCurrentBalance();
                
                // Load updated sale
                $updatedSale = Sale::with(['customer', 'items.product', 'walletTransactions'])->find($sale->id);
                $updatedSale->sales_transactions = \DB::table('sales_transactions')
                    ->where('sale_id', $sale->id)
                    ->get();
                
                \Log::info('=== ADJUST AMOUNT COMPLETED ===');
                
                return response()->json([
                    'success' => true,
                    'message' => 'Amount adjusted successfully',
                    'sale' => $updatedSale,
                    'adjustment' => [
                        'amount' => $adjustmentNeeded,
                        'type' => $adjustmentNeeded > 0 ? 'debit' : 'credit',
                        'wallet_balance_updated' => true
                    ]
                ]);
                
            });
            
        } catch (\Exception $e) {
            \Log::error('Amount adjustment failed for sale ' . $id . ': ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to adjust amount: ' . $e->getMessage()
            ], 500);
        }
    }
}
