<?php

namespace App\Http\Controllers;

use App\Models\PurchaseTransaction;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PurchaseTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $transactions = PurchaseTransaction::with(['purchaseOrder', 'supplier', 'creator'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:cash,bank_transfer,cheque,credit_card,upi,other',
            'status' => 'required|in:pending,completed,failed,cancelled',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
            'payment_date' => 'required|date',
        ]);

        try {
            DB::beginTransaction();

            // Create the transaction
            $transaction = PurchaseTransaction::create([
                'purchase_order_id' => $request->purchase_order_id,
                'supplier_id' => $request->supplier_id,
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'status' => $request->status,
                'reference_number' => $request->reference_number,
                'notes' => $request->notes,
                'payment_date' => $request->payment_date,
                'created_by' => Auth::id(),
            ]);

            // Update purchase order paid amount and status
            $purchaseOrder = PurchaseOrder::find($request->purchase_order_id);
            $purchaseOrder->paid_amount += $request->amount;
            $purchaseOrder->updatePaidStatus();

            $transaction->load(['purchaseOrder', 'supplier', 'creator']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment transaction created successfully',
                'data' => $transaction
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseTransaction $transaction): JsonResponse
    {
        $transaction->load(['purchaseOrder', 'supplier', 'creator']);

        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        // Find the transaction explicitly instead of relying on route model binding
        $transaction = PurchaseTransaction::find($id);
        
        // Debug: Check if transaction is properly loaded
        if (!$transaction || !$transaction->exists) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
                'debug' => [
                    'transaction_object' => $transaction ? 'exists' : 'null',
                    'transaction_exists' => $transaction ? $transaction->exists : false,
                    'transaction_id' => $transaction ? $transaction->id : 'null',
                    'requested_id' => $id,
                    'all_transaction_ids' => \App\Models\PurchaseTransaction::pluck('id')->toArray(),
                    'database_connection' => config('database.default'),
                ]
            ], 404);
        }

        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:cash,bank_transfer,cheque,credit_card,upi,other',
            'status' => 'required|in:pending,completed,failed,cancelled',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
            'payment_date' => 'required|date',
        ]);

        try {
            DB::beginTransaction();

            // Debug: Check transaction object after it's loaded
            \Log::info('Transaction object:', [
                'transaction_id' => $transaction->id,
                'purchase_order_id' => $transaction->purchase_order_id,
                'transaction_exists' => $transaction->exists,
            ]);

            // Calculate the difference in amount
            $oldAmount = $transaction->amount;
            $newAmount = $request->amount;
            $difference = $newAmount - $oldAmount;

            // Update the transaction
            $transaction->update([
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'status' => $request->status,
                'reference_number' => $request->reference_number,
                'notes' => $request->notes,
                'payment_date' => $request->payment_date,
            ]);

            // Update purchase order paid amount
            $transaction->load('purchaseOrder');
            $purchaseOrder = $transaction->purchaseOrder;
            
            // Fallback: try to load purchase order directly if relationship fails
            if (!$purchaseOrder && $transaction->purchase_order_id) {
                $purchaseOrder = PurchaseOrder::find($transaction->purchase_order_id);
            }
            
            if (!$purchaseOrder) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Related purchase order not found',
                    'debug' => [
                        'transaction_id' => $transaction->id,
                        'purchase_order_id' => $transaction->purchase_order_id,
                        'transaction_exists' => $transaction->exists,
                        'relationship_loaded' => $transaction->relationLoaded('purchaseOrder'),
                        'purchase_order_exists' => $transaction->purchase_order_id ? PurchaseOrder::find($transaction->purchase_order_id) ? true : false : false,
                    ]
                ], 404);
            }
            $purchaseOrder->paid_amount += $difference;
            $purchaseOrder->updatePaidStatus();

            $transaction->load(['purchaseOrder', 'supplier', 'creator']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment transaction updated successfully',
                'data' => $transaction
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        // Find the transaction explicitly instead of relying on route model binding
        $transaction = PurchaseTransaction::find($id);
        
        if (!$transaction || !$transaction->exists) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
                'debug' => [
                    'transaction_object' => $transaction ? 'exists' : 'null',
                    'transaction_exists' => $transaction ? $transaction->exists : false,
                    'transaction_id' => $transaction ? $transaction->id : 'null',
                    'requested_id' => $id,
                    'all_transaction_ids' => \App\Models\PurchaseTransaction::pluck('id')->toArray(),
                ]
            ], 404);
        }

        try {
            DB::beginTransaction();

            // Update purchase order paid amount
            $transaction->load('purchaseOrder');
            $purchaseOrder = $transaction->purchaseOrder;
            
            // Fallback: try to load purchase order directly if relationship fails
            if (!$purchaseOrder && $transaction->purchase_order_id) {
                $purchaseOrder = PurchaseOrder::find($transaction->purchase_order_id);
            }
            
            if (!$purchaseOrder) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Related purchase order not found',
                    'debug' => [
                        'transaction_id' => $transaction->id,
                        'purchase_order_id' => $transaction->purchase_order_id,
                        'transaction_exists' => $transaction->exists,
                        'relationship_loaded' => $transaction->relationLoaded('purchaseOrder'),
                        'purchase_order_exists' => $transaction->purchase_order_id ? PurchaseOrder::find($transaction->purchase_order_id) ? true : false : false,
                    ]
                ], 404);
            }
            $purchaseOrder->paid_amount -= $transaction->amount;
            $purchaseOrder->updatePaidStatus();

            // Delete the transaction
            $transaction->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment transaction deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete payment transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get transactions for a specific purchase order.
     */
    public function getByPurchaseOrder($purchaseOrderId): JsonResponse
    {
        $transactions = PurchaseTransaction::with(['supplier', 'creator'])
            ->where('purchase_order_id', $purchaseOrderId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Get payment methods.
     */
    public function getPaymentMethods(): JsonResponse
    {
        $methods = [
            ['value' => 'cash', 'label' => 'Cash'],
            ['value' => 'bank_transfer', 'label' => 'Bank Transfer'],
            ['value' => 'cheque', 'label' => 'Cheque'],
            ['value' => 'credit_card', 'label' => 'Credit Card'],
            ['value' => 'upi', 'label' => 'UPI'],
            ['value' => 'other', 'label' => 'Other'],
        ];

        return response()->json([
            'success' => true,
            'data' => $methods
        ]);
    }

    /**
     * Get payment statuses.
     */
    public function getPaymentStatuses(): JsonResponse
    {
        $statuses = [
            ['value' => 'pending', 'label' => 'Pending'],
            ['value' => 'completed', 'label' => 'Completed'],
            ['value' => 'failed', 'label' => 'Failed'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
        ];

        return response()->json([
            'success' => true,
            'data' => $statuses
        ]);
    }
}
