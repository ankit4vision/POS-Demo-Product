<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\PurchaseOrder;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $purchases = Purchase::with(['supplier', 'purchaseOrder', 'creator'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $purchases
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'purchase_date' => 'required|date',
            'received_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax_percent' => 'nullable|numeric|min:0|max:100',
            'items.*.discount_percent' => 'nullable|numeric|min:0|max:100',
        ]);

        try {
            DB::beginTransaction();

            $purchaseOrder = PurchaseOrder::findOrFail($request->purchase_order_id);

            $purchase = Purchase::create([
                'purchase_order_id' => $purchaseOrder->id,
                'supplier_id' => $purchaseOrder->supplier_id,
                'purchase_number' => Purchase::generatePurchaseNumber(),
                'purchase_date' => $request->purchase_date,
                'received_date' => $request->received_date,
                'status' => 'active',
                'notes' => $request->notes,
                'created_by' => Auth::id(),
            ]);

            foreach ($request->items as $item) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax_percent' => $item['tax_percent'] ?? 0,
                    'discount_percent' => $item['discount_percent'] ?? 0,
                ]);

                // Update product stock
                $product = Product::find($item['product_id']);
                $product->increment('stock', $item['quantity']);
            }

            $purchase->load(['supplier', 'purchaseOrder', 'items.product', 'creator']);

            // Update purchase order status to completed
            $purchaseOrder->update(['status' => 'completed']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Purchase created successfully',
                'data' => $purchase
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create purchase',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase): JsonResponse
    {
        $purchase->load(['supplier', 'purchaseOrder', 'items.product', 'creator']);

        return response()->json([
            'success' => true,
            'data' => $purchase
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchase $purchase): JsonResponse
    {
        $request->validate([
            'purchase_date' => 'required|date',
            'received_date' => 'required|date',
            'status' => 'required|in:active,cancelled',
            'notes' => 'nullable|string',
        ]);

        try {
            $purchase->update([
                'purchase_date' => $request->purchase_date,
                'received_date' => $request->received_date,
                'status' => $request->status,
                'notes' => $request->notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Purchase updated successfully',
                'data' => $purchase->load(['supplier', 'purchaseOrder', 'items.product', 'creator'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchase',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase): JsonResponse
    {
        try {
            if ($purchase->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only active purchases can be deleted'
                ], 400);
            }

            // Reverse stock updates
            foreach ($purchase->items as $item) {
                $product = Product::find($item->product_id);
                $product->decrement('stock', $item->quantity);
            }

            $purchase->delete();

            return response()->json([
                'success' => true,
                'message' => 'Purchase deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete purchase',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Convert a purchase order to purchase.
     */
    public function convertFromPurchaseOrder(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        $request->validate([
            'purchase_date' => 'required|date',
            'received_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $purchase = Purchase::create([
                'purchase_order_id' => $purchaseOrder->id,
                'supplier_id' => $purchaseOrder->supplier_id,
                'purchase_number' => Purchase::generatePurchaseNumber(),
                'purchase_date' => $request->purchase_date,
                'received_date' => $request->received_date,
                'status' => 'active',
                'notes' => $request->notes,
                'created_by' => Auth::id(),
            ]);

            // Copy items from purchase order
            foreach ($purchaseOrder->items as $poItem) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $poItem->product_id,
                    'quantity' => $poItem->quantity,
                    'unit_price' => $poItem->unit_price,
                    'tax_percent' => $poItem->tax_percent,
                    'discount_percent' => $poItem->discount_percent,
                ]);

                // Update product stock
                $product = Product::find($poItem->product_id);
                $product->increment('stock', $poItem->quantity);
            }

            $purchase->load(['supplier', 'purchaseOrder', 'items.product', 'creator']);

            // Update purchase order status to completed
            $purchaseOrder->update(['status' => 'completed']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Purchase order converted to purchase successfully',
                'data' => $purchase
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to convert purchase order to purchase',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get purchase orders ready for conversion.
     */
    public function getReadyPurchaseOrders(): JsonResponse
    {
        $purchaseOrders = PurchaseOrder::with(['supplier', 'items.product'])
            ->whereIn('status', ['sent', 'received'])
            ->whereDoesntHave('purchase')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $purchaseOrders
        ]);
    }
}
