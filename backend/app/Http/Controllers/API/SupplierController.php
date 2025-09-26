<?php

namespace App\Http\Controllers\API;

use App\Models\Supplier;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Supplier::with([
            'purchaseOrders' => function($q) {
                $q->select('id', 'supplier_id', 'po_number', 'total_amount', 'paid_amount', 'status', 'order_date');
            },
            'purchaseOrders.transactions' => function($q) {
                $q->select('id', 'purchase_order_id', 'amount', 'payment_date', 'status');
            }
        ]);
        
        // Filter by status
        if ($request->has('status') && in_array($request->status, ['active', 'inactive'])) {
            $query->where('status', $request->status);
        }

        // Search by name, email, phone, or contact person
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%')
                  ->orWhere('contact_person', 'like', '%' . $search . '%');
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        
        if (!in_array($sortBy, ['name', 'email', 'phone', 'contact_person', 'status', 'created_at'])) {
            $sortBy = 'name';
        }
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'asc';
        }
        
        $query->orderBy($sortBy, $sortOrder);
        $perPage = $request->get('per_page', 10);
        
        $result = $query->paginate($perPage);
        
        // Add calculated fields for each supplier
        $result->getCollection()->transform(function ($supplier) {
            $supplier->total_purchase_orders = $supplier->purchaseOrders->count();
            $supplier->total_purchase_amount = $supplier->purchaseOrders->sum('total_amount');
            $supplier->total_paid_amount = $supplier->purchaseOrders->sum('paid_amount');
            $supplier->outstanding_amount = $supplier->total_purchase_amount - $supplier->total_paid_amount;
            $supplier->total_transactions = $supplier->purchaseOrders->sum(function($po) {
                return $po->transactions->count();
            });
            $supplier->last_purchase_date = $supplier->purchaseOrders->max('order_date');
            return $supplier;
        });
        
        return response()->json($result);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $supplier = Supplier::create($validator->validated());

        return response()->json($supplier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        // Simple approach: Load purchase orders separately
        $purchaseOrders = $supplier->purchaseOrders()
            ->with([
                'items.product',
                'transactions' => function($tq) {
                    $tq->orderBy('payment_date', 'desc');
                },
                'creator'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Debug: Check if purchase orders are loaded
        \Log::info('Supplier ID: ' . $supplier->id);
        \Log::info('Purchase Orders Count: ' . $purchaseOrders->count());
        \Log::info('Purchase Orders: ' . $purchaseOrders->toJson());

        // Get all transactions from all purchase orders for the payments directory
        $allTransactions = collect();
        foreach ($purchaseOrders as $po) {
            if ($po->transactions) {
                foreach ($po->transactions as $transaction) {
                    $allTransactions->push([
                        'id' => $transaction->id,
                        'purchase_order_id' => $po->id,
                        'po_number' => $po->po_number,
                        'amount' => $transaction->amount,
                        'payment_date' => $transaction->payment_date,
                        'payment_method' => $transaction->payment_method,
                        'status' => $transaction->status,
                        'reference_number' => $transaction->reference_number,
                        'notes' => $transaction->notes,
                        'created_at' => $transaction->created_at,
                        'updated_at' => $transaction->updated_at,
                    ]);
                }
            }
        }

        // Sort transactions by payment date (newest first)
        $allTransactions = $allTransactions->sortByDesc('payment_date');

        // Calculate summary statistics
        $summary = [
            'total_purchase_orders' => $purchaseOrders->count(),
            'total_purchase_amount' => $purchaseOrders->sum('total_amount'),
            'total_paid_amount' => $purchaseOrders->sum('paid_amount'),
            'outstanding_amount' => $purchaseOrders->sum('total_amount') - $purchaseOrders->sum('paid_amount'),
            'total_transactions' => $allTransactions->count(),
            'last_purchase_date' => $purchaseOrders->max('order_date'),
            'active_orders' => $purchaseOrders->whereIn('status', ['draft', 'sent', 'received'])->count(),
            'completed_orders' => $purchaseOrders->where('status', 'completed')->count(),
        ];

        // Add payments directory
        $paymentsDirectory = [
            'total_transactions' => $allTransactions->count(),
            'total_paid_amount' => $allTransactions->sum('amount'),
            'transactions' => $allTransactions->values()->all(),
            'payment_methods_summary' => $allTransactions->groupBy('payment_method')->map(function($group) {
                return [
                    'count' => $group->count(),
                    'total_amount' => $group->sum('amount')
                ];
            }),
            'status_summary' => $allTransactions->groupBy('status')->map(function($group) {
                return [
                    'count' => $group->count(),
                    'total_amount' => $group->sum('amount')
                ];
            }),
        ];

        // Add purchase orders summary
        $purchaseOrdersSummary = [
            'total_orders' => $purchaseOrders->count(),
            'orders_by_status' => $purchaseOrders->groupBy('status')->map(function($group) {
                return [
                    'count' => $group->count(),
                    'total_amount' => $group->sum('total_amount'),
                    'paid_amount' => $group->sum('paid_amount')
                ];
            }),
            'recent_orders' => $purchaseOrders->take(5)->map(function($po) {
                return [
                    'id' => $po->id,
                    'po_number' => $po->po_number,
                    'order_date' => $po->order_date,
                    'total_amount' => $po->total_amount,
                    'paid_amount' => $po->paid_amount,
                    'status' => $po->status,
                    'paid_status' => $po->paid_status,
                    'creator_name' => $po->creator->name ?? null,
                ];
            }),
        ];

        // Build response
        $response = [
            'id' => $supplier->id,
            'name' => $supplier->name,
            'email' => $supplier->email,
            'phone' => $supplier->phone,
            'address' => $supplier->address,
            'contact_person' => $supplier->contact_person,
            'status' => $supplier->status,
            'created_at' => $supplier->created_at,
            'updated_at' => $supplier->updated_at,
            'summary' => $summary,
            'payments_directory' => $paymentsDirectory,
            'purchase_orders_summary' => $purchaseOrdersSummary,
            'purchaseOrders' => $purchaseOrders->toArray(),
        ];

        return response()->json($response);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $supplier->update($validator->validated());

        return response()->json([
            'message' => 'Supplier updated successfully',
            'data' => $supplier
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        // Check if supplier has any purchase orders
        if ($supplier->purchaseOrders()->exists()) {
            return response()->json([
                'message' => 'Cannot delete supplier with existing purchase orders'
            ], 422);
        }

        // Check if supplier has any payments
        if ($supplier->purchasePayments()->exists()) {
            return response()->json([
                'message' => 'Cannot delete supplier with existing payments'
            ], 422);
        }

        $supplier->delete();
        
        return response()->json([
            'message' => 'Supplier deleted successfully'
        ], 200);
    }

    /**
     * Get all active suppliers for dropdowns.
     */
    public function active()
    {
        $suppliers = Supplier::active()->orderBy('name')->get();
        return response()->json($suppliers);
    }

    /**
     * Get supplier payments directory.
     */
    public function payments(Supplier $supplier)
    {
        // Load purchase orders with transactions
        $supplier->load([
            'purchaseOrders' => function($q) {
                $q->with(['transactions' => function($tq) {
                    $tq->orderBy('payment_date', 'desc');
                }]);
            }
        ]);

        // Get all transactions from all purchase orders
        $allTransactions = collect();
        foreach ($supplier->purchaseOrders as $po) {
            if ($po->transactions) {
                foreach ($po->transactions as $transaction) {
                    $allTransactions->push([
                        'id' => $transaction->id,
                        'purchase_order_id' => $po->id,
                        'po_number' => $po->po_number,
                        'amount' => $transaction->amount,
                        'payment_date' => $transaction->payment_date,
                        'payment_method' => $transaction->payment_method,
                        'status' => $transaction->status,
                        'reference_number' => $transaction->reference_number,
                        'notes' => $transaction->notes,
                        'created_at' => $transaction->created_at,
                        'updated_at' => $transaction->updated_at,
                    ]);
                }
            }
        }

        // Sort transactions by payment date (newest first)
        $allTransactions = $allTransactions->sortByDesc('payment_date');

        $paymentsDirectory = [
            'supplier_id' => $supplier->id,
            'supplier_name' => $supplier->name,
            'total_transactions' => $allTransactions->count(),
            'total_paid_amount' => $allTransactions->sum('amount'),
            'transactions' => $allTransactions->values()->all(),
            'payment_methods_summary' => $allTransactions->groupBy('payment_method')->map(function($group) {
                return [
                    'count' => $group->count(),
                    'total_amount' => $group->sum('amount')
                ];
            }),
            'status_summary' => $allTransactions->groupBy('status')->map(function($group) {
                return [
                    'count' => $group->count(),
                    'total_amount' => $group->sum('amount')
                ];
            }),
        ];

        return response()->json($paymentsDirectory);
    }

    /**
     * Export the specified supplier as a PDF report.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function exportPdf($id)
    {
        $supplier = Supplier::findOrFail($id);
        
        // Load purchase orders with transactions
        $purchaseOrders = $supplier->purchaseOrders()
            ->with([
                'items.product',
                'transactions' => function($tq) {
                    $tq->orderBy('payment_date', 'desc');
                },
                'creator'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get all transactions from all purchase orders for the payments directory
        $allTransactions = collect();
        foreach ($purchaseOrders as $po) {
            if ($po->transactions) {
                foreach ($po->transactions as $transaction) {
                    $allTransactions->push([
                        'id' => $transaction->id,
                        'purchase_order_id' => $po->id,
                        'po_number' => $po->po_number,
                        'amount' => $transaction->amount,
                        'payment_date' => $transaction->payment_date,
                        'payment_method' => $transaction->payment_method,
                        'status' => $transaction->status,
                        'reference_number' => $transaction->reference_number,
                        'notes' => $transaction->notes,
                        'created_at' => $transaction->created_at,
                        'updated_at' => $transaction->updated_at,
                    ]);
                }
            }
        }

        // Sort transactions by payment date (newest first)
        $allTransactions = $allTransactions->sortByDesc('payment_date');

        // Calculate summary statistics
        $summary = [
            'total_purchase_orders' => $purchaseOrders->count(),
            'total_purchase_amount' => $purchaseOrders->sum('total_amount'),
            'total_paid_amount' => $purchaseOrders->sum('paid_amount'),
            'outstanding_amount' => $purchaseOrders->sum('total_amount') - $purchaseOrders->sum('paid_amount'),
            'total_transactions' => $allTransactions->count(),
            'last_purchase_date' => $purchaseOrders->max('order_date'),
            'active_orders' => $purchaseOrders->whereIn('status', ['draft', 'sent', 'received'])->count(),
            'completed_orders' => $purchaseOrders->where('status', 'completed')->count(),
        ];

        // Add payments directory
        $paymentsDirectory = [
            'total_transactions' => $allTransactions->count(),
            'total_paid_amount' => $allTransactions->sum('amount'),
            'transactions' => $allTransactions->values()->all(),
            'payment_methods_summary' => $allTransactions->groupBy('payment_method')->map(function($group) {
                return [
                    'count' => $group->count(),
                    'total_amount' => $group->sum('amount')
                ];
            }),
            'status_summary' => $allTransactions->groupBy('status')->map(function($group) {
                return [
                    'count' => $group->count(),
                    'total_amount' => $group->sum('amount')
                ];
            }),
        ];

        // Add purchase orders summary
        $purchaseOrdersSummary = [
            'total_orders' => $purchaseOrders->count(),
            'orders_by_status' => $purchaseOrders->groupBy('status')->map(function($group) {
                return [
                    'count' => $group->count(),
                    'total_amount' => $group->sum('total_amount'),
                    'paid_amount' => $group->sum('paid_amount')
                ];
            }),
            'recent_orders' => $purchaseOrders->take(5)->map(function($po) {
                return [
                    'id' => $po->id,
                    'po_number' => $po->po_number,
                    'order_date' => $po->order_date,
                    'total_amount' => $po->total_amount,
                    'paid_amount' => $po->paid_amount,
                    'status' => $po->status,
                    'paid_status' => $po->paid_status,
                    'creator_name' => $po->creator->name ?? null,
                ];
            }),
        ];

        // Build supplier data for PDF
        $supplierData = [
            'id' => $supplier->id,
            'name' => $supplier->name,
            'email' => $supplier->email,
            'phone' => $supplier->phone,
            'address' => $supplier->address,
            'contact_person' => $supplier->contact_person,
            'status' => $supplier->status,
            'created_at' => $supplier->created_at,
            'updated_at' => $supplier->updated_at,
            'summary' => $summary,
            'payments_directory' => $paymentsDirectory,
            'purchase_orders_summary' => $purchaseOrdersSummary,
        ];

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
            ->export('pdf.supplier-detail', [
                'supplier' => (object)$supplierData,
                'company' => $company,
                'siteSettings' => $siteSettings
            ], 'SupplierReport-' . $supplier->id . '.pdf');
    }
}
