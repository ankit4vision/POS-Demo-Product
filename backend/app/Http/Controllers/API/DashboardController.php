<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Expense;
use App\Models\Customer;
use App\Models\Product;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\DB as FacadesDB;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        // Date range filter
        $start = $request->input('start_date');
        $end = $request->input('end_date');
        if (!$start || !$end) {
            $now = Carbon::now();
            $start = $now->copy()->startOfMonth()->toDateString();
            $end = $now->copy()->endOfMonth()->toDateString();
        }

        // Total Sales
        $totalSales = Sale::whereBetween('created_at', [$start, $end])->sum('rounded_total');
        // Total Purchases
        $totalPurchases = \App\Models\PurchaseOrder::where('status', '!=', 'draft')
            ->whereBetween('created_at', [$start, $end])
            ->sum('total_amount');
        // Total Expenses
        $totalExpenses = Expense::whereBetween('date', [$start, $end])->sum('amount');
        // Profit
        $profit = $totalSales - $totalPurchases - $totalExpenses;
        // Total Customers
        $totalCustomers = Customer::count();
        // Total Products
        $totalProducts = Product::count();
        // Low Stock
        $lowStock = Product::whereColumn('opening_stock', '<=', 'low_stock_alert')->count();
        // Top Selling Products (Top 5)
        $topProducts = \DB::table('sale_items')
            ->select('product_id', \DB::raw('SUM(qty) as total_qty'))
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();
        $topProductsWithNames = $topProducts->map(function($item) {
            $product = Product::find($item->product_id);
            return [
                'name' => $product ? $product->name : 'Unknown Product',
                'quantity' => $item->total_qty
            ];
        });
        // Pending Purchase Orders (List)
        $pendingPOs = \App\Models\PurchaseOrder::where('status', '!=', 'completed')
            ->select('id', 'po_number', 'total_amount', 'status', 'created_at')
            ->orderBy('status', 'desc')
            ->get()
            ->map(function($po) {
                return [
                    'id' => $po->id,
                    'po_number' => $po->po_number,
                    'total_amount' => $po->total_amount,
                    'status' => $po->status,
                    'created_at' => $po->created_at ? $po->created_at->format('Y-m-d H:i:s') : null,
                ];
            });
        // Best Customers (Top 5)
        $bestCustomers = Sale::select('customer_id', \DB::raw('SUM(rounded_total) as total'))
            ->whereBetween('created_at', [$start, $end])
            ->whereNotNull('customer_id')
            ->groupBy('customer_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get();
        $bestCustomersWithNames = $bestCustomers->map(function($item) {
            $customer = Customer::find($item->customer_id);
            return [
                'name' => $customer ? $customer->name : 'Unknown Customer',
                'total' => $item->total
            ];
        });
        // Best Suppliers (Top 5)
        $bestSuppliers = \App\Models\PurchaseOrder::select('supplier_id', \DB::raw('SUM(total_amount) as total'))
            ->whereNotNull('purchase_date')
            ->whereBetween('purchase_date', [$start, $end])
            ->whereNotNull('supplier_id')
            ->groupBy('supplier_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get();
        $bestSuppliersWithNames = $bestSuppliers->map(function($item) {
            $supplier = \App\Models\Supplier::find($item->supplier_id);
            return [
                'name' => $supplier ? $supplier->name : 'Unknown Supplier',
                'total' => $item->total
            ];
        });
        return response()->json([
            'total_sales' => $totalSales,
            'total_purchases' => $totalPurchases,
            'total_expenses' => $totalExpenses,
            'profit' => $profit,
            'total_customers' => $totalCustomers,
            'total_products' => $totalProducts,
            'low_stock' => $lowStock,
            'top_selling_products' => $topProductsWithNames,
            'pending_purchase_orders' => $pendingPOs,
            'best_customers' => $bestCustomersWithNames,
            'best_suppliers' => $bestSuppliersWithNames,
        ]);
    }

    public function salesTrend()
    {
        $start = Carbon::now()->subDays(29)->startOfDay();
        $sales = Sale::select(DB::raw('DATE(created_at) as day'), DB::raw('SUM(rounded_total) as total'))
            ->where('created_at', '>=', $start)
            ->groupBy('day')
            ->orderBy('day')
            ->get();
        return response()->json($sales);
    }

    public function expenseBreakdown()
    {
        $month = Carbon::now()->month;
        $year = Carbon::now()->year;
        $breakdown = Expense::select('expense_category_id', DB::raw('SUM(amount) as total'))
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->groupBy('expense_category_id')
            ->with('category')
            ->get();
        return response()->json($breakdown);
    }

    public function monthlySalesVsPurchases(Request $request)
    {
        $start = $request->input('start_date');
        $end = $request->input('end_date');
        $groupBy = $request->input('group_by', 'daily');
        if (!$start || !$end) {
            $now = Carbon::now();
            $start = $now->copy()->startOfYear()->toDateString();
            $end = $now->copy()->endOfYear()->toDateString();
        }

        if ($groupBy === 'yearly') {
            $sales = Sale::selectRaw('YEAR(created_at) as label, SUM(rounded_total) as total_sales')
                ->whereBetween('created_at', [$start, $end])
                ->groupBy('label')
                ->orderBy('label')
                ->get();
            $purchases = \App\Models\PurchaseOrder::selectRaw('YEAR(purchase_date) as label, SUM(total_amount) as total_purchases')
                ->whereNotNull('purchase_date')
                ->whereBetween('purchase_date', [$start, $end])
                ->groupBy('label')
                ->orderBy('label')
                ->get();
        } elseif ($groupBy === 'monthly') {
            $sales = Sale::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as label, SUM(rounded_total) as total_sales')
                ->whereBetween('created_at', [$start, $end])
                ->groupBy('label')
                ->orderBy('label')
                ->get();
            $purchases = \App\Models\PurchaseOrder::selectRaw('DATE_FORMAT(purchase_date, "%Y-%m") as label, SUM(total_amount) as total_purchases')
                ->whereNotNull('purchase_date')
                ->whereBetween('purchase_date', [$start, $end])
                ->groupBy('label')
                ->orderBy('label')
                ->get();
        } else { // daily (default)
            $sales = Sale::selectRaw('DATE(created_at) as label, SUM(rounded_total) as total_sales')
                ->whereBetween('created_at', [$start, $end])
                ->groupBy('label')
                ->orderBy('label')
                ->get();
            $purchases = \App\Models\PurchaseOrder::selectRaw('DATE(purchase_date) as label, SUM(total_amount) as total_purchases')
                ->whereNotNull('purchase_date')
                ->whereBetween('purchase_date', [$start, $end])
                ->groupBy('label')
                ->orderBy('label')
                ->get();
        }
        return response()->json([
            'sales' => $sales,
            'purchases' => $purchases,
        ]);
    }

    /**
     * Business Financial Dashboard Summary
     */
    public function businessSummary(Request $request)
    {
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        // Sales summary
        $salesQuery = FacadesDB::table('sales')
            ->select([
                FacadesDB::raw('SUM(grand_total) as total_sales'),
                FacadesDB::raw('SUM(paid) as total_paid'),
                FacadesDB::raw('SUM(due) as total_outstanding'),
            ]);
        if ($dateFrom) $salesQuery->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $salesQuery->whereDate('created_at', '<=', $dateTo);
        $sales = (array) $salesQuery->first();

        // Sales by payment method
        $paymentBreakdown = FacadesDB::table('sales_transactions')
            ->join('sales', 'sales_transactions.sale_id', '=', 'sales.id')
            ->select('payment_type', FacadesDB::raw('SUM(amount) as total'))
            ->when($dateFrom, fn($q) => $q->whereDate('sales.created_at', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('sales.created_at', '<=', $dateTo))
            ->groupBy('payment_type')
            ->get();

        // Wallet ledger summary (customer and retailer outstanding with name and contact)
        $walletSummary = FacadesDB::table('wallet_accounts')
            ->join('customers', function($join) {
                $join->on('wallet_accounts.party_id', '=', 'customers.id')
                     ->on('wallet_accounts.party_type', '=', 'customers.type');
            })
            ->select(
                'wallet_accounts.party_type',
                'wallet_accounts.party_id',
                'wallet_accounts.current_balance',
                'customers.name',
                'customers.phone'
            )
            ->where('wallet_accounts.current_balance', '!=', 0)
            ->get();

        // Purchases summary
        $purchaseQuery = FacadesDB::table('purchase_orders')
            ->where('status', '!=', 'draft')
            ->select([
                FacadesDB::raw('SUM(total_amount) as total_purchases'),
            ]);
        if ($dateFrom) $purchaseQuery->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $purchaseQuery->whereDate('created_at', '<=', $dateTo);
        $purchases = (array) $purchaseQuery->first();

        // Total paid for purchases in the period
        $purchaseIds = FacadesDB::table('purchase_orders')
            ->where('status', '!=', 'draft')
            ->when($dateFrom, fn($q) => $q->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('created_at', '<=', $dateTo))
            ->pluck('id');
        $totalPaid = 0;
        if ($purchaseIds->count() > 0) {
            $totalPaid = FacadesDB::table('purchase_transactions')
                ->whereIn('purchase_order_id', $purchaseIds)
                ->sum('amount');
        }
        $purchases['total_paid'] = $totalPaid;
        $purchases['total_outstanding'] = ($purchases['total_purchases'] ?? 0) - $totalPaid;

        // Supplier outstanding info
        $supplierOrders = FacadesDB::table('purchase_orders')
            ->where('purchase_orders.status', '!=', 'draft')
            ->join('suppliers', 'purchase_orders.supplier_id', '=', 'suppliers.id')
            ->select('suppliers.name as supplier', 'purchase_orders.id', 'purchase_orders.total_amount')
            ->when($dateFrom, fn($q) => $q->whereDate('purchase_orders.created_at', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('purchase_orders.created_at', '<=', $dateTo))
            ->get()
            ->groupBy('supplier');
        $supplierOutstanding = [];
        foreach ($supplierOrders as $supplier => $orders) {
            $orderIds = $orders->pluck('id');
            $totalAmount = $orders->sum('total_amount');
            $totalPaid = 0;
            if ($orderIds->count() > 0) {
                $totalPaid = FacadesDB::table('purchase_transactions')
                    ->whereIn('purchase_order_id', $orderIds)
                    ->sum('amount');
            }
            $supplierOutstanding[] = [
                'supplier' => $supplier,
                'outstanding' => $totalAmount - $totalPaid,
            ];
        }

        // Expenses summary
        $expenseQuery = FacadesDB::table('expenses')
            ->select(FacadesDB::raw('SUM(amount) as total_expenses'));
        if ($dateFrom) $expenseQuery->whereDate('date', '>=', $dateFrom);
        if ($dateTo) $expenseQuery->whereDate('date', '<=', $dateTo);
        $expenses = (array) $expenseQuery->first();

        // Expense breakdown by category
        $expenseBreakdown = FacadesDB::table('expenses')
            ->join('expense_categories', 'expenses.expense_category_id', '=', 'expense_categories.id')
            ->select('expense_categories.name as category', FacadesDB::raw('SUM(expenses.amount) as total'))
            ->when($dateFrom, fn($q) => $q->whereDate('expenses.date', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('expenses.date', '<=', $dateTo))
            ->groupBy('expense_categories.name')
            ->orderByDesc('total')
            ->get();

        // All expenses for the selected date range (removed limit to show all)
        $recentExpenses = FacadesDB::table('expenses')
            ->join('expense_categories', 'expenses.expense_category_id', '=', 'expense_categories.id')
            ->select('expenses.date', 'expenses.amount', 'expense_categories.name as category', 'expenses.description')
            ->when($dateFrom, fn($q) => $q->whereDate('expenses.date', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('expenses.date', '<=', $dateTo))
            ->orderByDesc('expenses.date')
            ->get(); // Removed limit(10) - now shows all expenses

        // Cash flow summary
        $cashIn = ($sales['total_paid'] ?? 0);
        $cashOut = ($purchases['total_paid'] ?? 0) + ($expenses['total_expenses'] ?? 0);
        $netCash = $cashIn - $cashOut;

        // Receivables (customer outstanding)
        $receivables = ($sales['total_outstanding'] ?? 0);
        // Payables (supplier outstanding)
        $payables = ($purchases['total_outstanding'] ?? 0);

        return response()->json([
            'sales' => $sales,
            'sales_payment_breakdown' => $paymentBreakdown,
            'wallet_ledger' => $walletSummary,
            'purchases' => $purchases,
            'supplier_outstanding' => $supplierOutstanding,
            'expenses' => $expenses,
            'expense_breakdown' => $expenseBreakdown,
            'recent_expenses' => $recentExpenses,
            'cash_flow' => [
                'inflow' => $cashIn,
                'outflow' => $cashOut,
                'net_cash' => $netCash,
            ],
            'receivables' => $receivables,
            'payables' => $payables,
        ]);
    }

    /**
     * Export Business Financial Dashboard as PDF
     */
    public function exportBusinessSummaryPdf(Request $request)
    {
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        // Get all the data needed for PDF
        $data = $this->getBusinessSummaryData($dateFrom, $dateTo);

        // Generate PDF using Laravel PDF library
        $pdf = \PDF::loadView('pdf.business-dashboard', [
            'data' => $data,
            'dateFrom' => $dateFrom,
            'dateTo' => $dateTo,
            'generatedAt' => now()->format('Y-m-d H:i:s')
        ]);

        // Set PDF options
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOption('margin-top', 15);
        $pdf->setOption('margin-bottom', 15);
        $pdf->setOption('margin-left', 15);
        $pdf->setOption('margin-right', 15);

        // Generate filename
        $filename = 'business_dashboard_' . ($dateFrom ?? 'all') . '_to_' . ($dateTo ?? 'all') . '.pdf';

        // Return PDF as blob response
        return $pdf->stream($filename);
    }

    /**
     * Helper method to get business summary data
     */
    private function getBusinessSummaryData($dateFrom, $dateTo)
    {
        // Sales summary
        $salesQuery = FacadesDB::table('sales')
            ->select([
                FacadesDB::raw('SUM(grand_total) as total_sales'),
                FacadesDB::raw('SUM(paid) as total_paid'),
                FacadesDB::raw('SUM(due) as total_outstanding'),
            ]);
        if ($dateFrom) $salesQuery->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $salesQuery->whereDate('created_at', '<=', $dateTo);
        $sales = (array) $salesQuery->first();

        // Sales by payment method
        $paymentBreakdown = FacadesDB::table('sales_transactions')
            ->join('sales', 'sales_transactions.sale_id', '=', 'sales.id')
            ->select('payment_type', FacadesDB::raw('SUM(amount) as total'))
            ->when($dateFrom, fn($q) => $q->whereDate('sales.created_at', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('sales.created_at', '<=', $dateTo))
            ->groupBy('payment_type')
            ->get();

        // Wallet ledger summary
        $walletSummary = FacadesDB::table('wallet_accounts')
            ->join('customers', function($join) {
                $join->on('wallet_accounts.party_id', '=', 'customers.id')
                     ->on('wallet_accounts.party_type', '=', 'customers.type');
            })
            ->select(
                'wallet_accounts.party_type',
                'wallet_accounts.party_id',
                'wallet_accounts.current_balance',
                'customers.name',
                'customers.phone'
            )
            ->where('wallet_accounts.current_balance', '!=', 0)
            ->get();

        // Purchases summary
        $purchaseQuery = FacadesDB::table('purchase_orders')
            ->where('status', '!=', 'draft')
            ->select([
                FacadesDB::raw('SUM(total_amount) as total_purchases'),
            ]);
        if ($dateFrom) $purchaseQuery->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $purchaseQuery->whereDate('created_at', '<=', $dateTo);
        $purchases = (array) $purchaseQuery->first();

        // Total paid for purchases in the period
        $purchaseIds = FacadesDB::table('purchase_orders')
            ->where('status', '!=', 'draft')
            ->when($dateFrom, fn($q) => $q->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('created_at', '<=', $dateTo))
            ->pluck('id');
        $totalPaid = 0;
        if ($purchaseIds->count() > 0) {
            $totalPaid = FacadesDB::table('purchase_transactions')
                ->whereIn('purchase_order_id', $purchaseIds)
                ->sum('amount');
        }
        $purchases['total_paid'] = $totalPaid;
        $purchases['total_outstanding'] = ($purchases['total_purchases'] ?? 0) - $totalPaid;

        // Supplier outstanding info
        $supplierOrders = FacadesDB::table('purchase_orders')
            ->join('suppliers', 'purchase_orders.supplier_id', '=', 'suppliers.id')
            ->where('purchase_orders.status', '!=', 'draft')
            ->when($dateFrom, fn($q) => $q->whereDate('purchase_orders.created_at', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('purchase_orders.created_at', '<=', $dateTo))
            ->select('suppliers.name as supplier', FacadesDB::raw('SUM(purchase_orders.total_amount) as total'))
            ->groupBy('suppliers.name')
            ->orderByDesc('total')
            ->get();

        $supplierOutstanding = $supplierOrders->map(function($order) {
            $paid = FacadesDB::table('purchase_transactions')
                ->join('purchase_orders', 'purchase_transactions.purchase_order_id', '=', 'purchase_orders.id')
                ->where('purchase_orders.supplier_id', function($query) use ($order) {
                    $query->select('id')->from('suppliers')->where('name', $order->supplier);
                })
                ->sum('purchase_transactions.amount');
            return [
                'supplier' => $order->supplier,
                'outstanding' => $order->total - $paid
            ];
        })->filter(function($item) {
            return $item['outstanding'] > 0;
        })->values();

        // Expenses summary
        $expenseQuery = FacadesDB::table('expenses')
            ->select(FacadesDB::raw('SUM(amount) as total_expenses'));
        if ($dateFrom) $expenseQuery->whereDate('date', '>=', $dateFrom);
        if ($dateTo) $expenseQuery->whereDate('date', '<=', $dateTo);
        $expenses = (array) $expenseQuery->first();

        // Expense breakdown by category
        $expenseBreakdown = FacadesDB::table('expenses')
            ->join('expense_categories', 'expenses.expense_category_id', '=', 'expense_categories.id')
            ->select('expense_categories.name as category', FacadesDB::raw('SUM(expenses.amount) as total'))
            ->when($dateFrom, fn($q) => $q->whereDate('expenses.date', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('expenses.date', '<=', $dateTo))
            ->groupBy('expense_categories.name')
            ->orderByDesc('total')
            ->get();

        // All expenses for the selected date range
        $allExpenses = FacadesDB::table('expenses')
            ->join('expense_categories', 'expenses.expense_category_id', '=', 'expense_categories.id')
            ->select('expenses.date', 'expenses.amount', 'expense_categories.name as category', 'expenses.description')
            ->when($dateFrom, fn($q) => $q->whereDate('expenses.date', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->whereDate('expenses.date', '<=', $dateTo))
            ->orderByDesc('expenses.date')
            ->get();

        // Cash flow summary
        $cashIn = ($sales['total_paid'] ?? 0);
        $cashOut = ($purchases['total_paid'] ?? 0) + ($expenses['total_expenses'] ?? 0);
        $netCash = $cashIn - $cashOut;

        // Receivables and payables
        $receivables = ($sales['total_outstanding'] ?? 0);
        $payables = ($purchases['total_outstanding'] ?? 0);

        return [
            'sales' => $sales,
            'sales_payment_breakdown' => $paymentBreakdown,
            'wallet_ledger' => $walletSummary,
            'purchases' => $purchases,
            'supplier_outstanding' => $supplierOutstanding,
            'expenses' => $expenses,
            'expense_breakdown' => $expenseBreakdown,
            'all_expenses' => $allExpenses,
            'cash_flow' => [
                'inflow' => $cashIn,
                'outflow' => $cashOut,
                'net_cash' => $netCash,
            ],
            'receivables' => $receivables,
            'payables' => $payables,
        ];
    }
} 