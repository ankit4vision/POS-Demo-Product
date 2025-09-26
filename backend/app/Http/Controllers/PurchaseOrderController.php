<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $purchaseOrders = PurchaseOrder::with(['supplier', 'items.product', 'creator'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $purchaseOrders
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
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'expected_delivery_date' => 'required|date|after:order_date',
            'notes' => 'nullable|string',
            'reference' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $purchaseOrder = PurchaseOrder::create([
                'po_number' => PurchaseOrder::generatePONumber(),
                'supplier_id' => $request->supplier_id,
                'order_date' => $request->order_date,
                'expected_delivery_date' => $request->expected_delivery_date,
                'status' => 'draft',
                'notes' => $request->notes,
                'reference' => $request->reference,
                'created_by' => Auth::id(),
            ]);

            foreach ($request->items as $item) {
                $totalAmount = $item['quantity'] * $item['unit_price'];
                PurchaseOrderItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_amount' => $totalAmount,
                ]);
            }

            $purchaseOrder->load(['supplier', 'items.product', 'creator']);
            $purchaseOrder->calculateTotals();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Purchase order created successfully',
                'data' => $purchaseOrder
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseOrder $purchaseOrder): JsonResponse
    {
        $purchaseOrder->load(['supplier', 'items.product', 'creator']);

        return response()->json([
            'success' => true,
            'data' => $purchaseOrder
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
    public function update(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        // Check if purchase order can be edited
        if ($purchaseOrder->status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Completed purchase orders cannot be edited'
            ], 400);
        }

        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'expected_delivery_date' => 'required|date|after:order_date',
            'status' => 'required|in:draft,sent,received,completed,cancelled',
            'notes' => 'nullable|string',
            'reference' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $purchaseOrder->update([
                'supplier_id' => $request->supplier_id,
                'order_date' => $request->order_date,
                'expected_delivery_date' => $request->expected_delivery_date,
                'status' => $request->status,
                'notes' => $request->notes,
                'reference' => $request->reference,
            ]);

            // Delete existing items and create new ones
            $purchaseOrder->items()->delete();

            foreach ($request->items as $item) {
                $totalAmount = $item['quantity'] * $item['unit_price'];
                PurchaseOrderItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_amount' => $totalAmount,
                ]);
            }

            $purchaseOrder->load(['supplier', 'items.product', 'creator']);
            $purchaseOrder->calculateTotals();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Purchase order updated successfully',
                'data' => $purchaseOrder
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseOrder $purchaseOrder): JsonResponse
    {
        try {
            if ($purchaseOrder->status !== 'draft') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only draft purchase orders can be deleted'
                ], 400);
            }

            $purchaseOrder->delete();

            return response()->json([
                'success' => true,
                'message' => 'Purchase order deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the status of a purchase order.
     */
    public function updateStatus(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:draft,sent,received,completed,cancelled'
        ]);

        try {
            $purchaseOrder->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'message' => 'Purchase order status updated successfully',
                'data' => $purchaseOrder->load(['supplier', 'items.product', 'creator'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchase order status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get suppliers for dropdown.
     */
    public function getSuppliers(): JsonResponse
    {
        $suppliers = Supplier::where('status', 'active')->get();

        return response()->json([
            'success' => true,
            'data' => $suppliers
        ]);
    }

    /**
     * Get products for dropdown.
     */
    public function getProducts(): JsonResponse
    {
        $products = Product::with(['category', 'unit'])->where('status', 'active')->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Get completed purchase orders for purchased list.
     */
    public function getCompleted(): JsonResponse
    {
        $purchaseOrders = PurchaseOrder::with(['supplier', 'creator'])
            ->where('status', 'completed')
            ->orderBy('purchase_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $purchaseOrders
        ]);
    }

    /**
     * Convert purchase order to purchased (update status and stock).
     */
    public function convertToPurchased(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        // Check if PO can be converted
        if (!in_array($purchaseOrder->status, ['sent', 'received'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only sent or received purchase orders can be converted to purchased'
            ], 400);
        }

        try {
            DB::beginTransaction();

            \Log::info('=== CONVERT TO PURCHASED START ===');
            \Log::info('Purchase Order ID: ' . $purchaseOrder->id);
            \Log::info('PO Number: ' . $purchaseOrder->po_number);
            \Log::info('Items Count: ' . $purchaseOrder->items->count());

            // Update PO status and purchase date
            $purchaseOrder->update([
                'status' => 'completed',
                'purchase_date' => now()->toDateString(),
            ]);

            \Log::info('PO Status updated to: completed');

            // Update items received status and product stock
            foreach ($purchaseOrder->items as $item) {
                \Log::info('Processing item - Product ID: ' . $item->product_id . ', Quantity: ' . $item->quantity);
                
                // Update item received status
                $item->update(['received_status' => 'received']);
                \Log::info('Item received_status updated to: received');
                
                // Find and update product stock
                $product = Product::find($item->product_id);
                
                if (!$product) {
                    \Log::error('Product not found for ID: ' . $item->product_id);
                    throw new \Exception('Product not found for ID: ' . $item->product_id);
                }
                
                \Log::info('Product found: ' . $product->name . ' (ID: ' . $product->id . ')');
                \Log::info('Current stock: ' . ($product->opening_stock ?? 'null'));
                
                // Convert quantity to numeric and validate
                $quantity = floatval($item->quantity);
                if ($quantity <= 0) {
                    \Log::error('Invalid quantity: ' . $quantity);
                    throw new \Exception('Invalid quantity: ' . $quantity);
                }
                
                // Update product stock
                $oldStock = $product->opening_stock ?? 0;
                $newStock = $oldStock + $quantity;
                
                // Calculate average purchase price
                $oldPurchasePrice = $product->purchase_price ?? 0;
                $oldTotalValue = $oldStock * $oldPurchasePrice;
                $newItemValue = $quantity * $item->unit_price;
                $newTotalValue = $oldTotalValue + $newItemValue;
                $averagePurchasePrice = $newStock > 0 ? $newTotalValue / $newStock : $item->unit_price;
                
                $product->update([
                    'opening_stock' => $newStock,
                    'purchase_price' => round($averagePurchasePrice, 2), // Average purchase price
                    'last_purchase_price' => $item->unit_price, // Latest unit price
                    'last_purchase_date' => now(),
                ]);
                
                \Log::info('Stock updated - Old: ' . $oldStock . ', Added: ' . $quantity . ', New: ' . $newStock);
                \Log::info('Purchase price updated - Old: ' . $oldPurchasePrice . ', New Average: ' . round($averagePurchasePrice, 2) . ', Latest: ' . $item->unit_price);
            }

            DB::commit();
            \Log::info('=== CONVERT TO PURCHASED COMPLETED SUCCESSFULLY ===');

            return response()->json([
                'success' => true,
                'message' => 'Purchase order converted to purchased successfully',
                'data' => $purchaseOrder->load(['supplier', 'items.product', 'creator'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('=== CONVERT TO PURCHASED FAILED ===');
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to convert purchase order to purchased: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export the specified purchase order as a PDF.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function exportPdf($id)
    {
        $purchaseOrder = PurchaseOrder::with(['supplier', 'items.product', 'creator', 'transactions'])->findOrFail($id);
        
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
            ->export('pdf.purchase-order', [
                'purchaseOrder' => $purchaseOrder,
                'company' => $company,
                'siteSettings' => $siteSettings
            ], 'PurchaseOrder-' . $purchaseOrder->po_number . '.pdf');
    }

    /**
     * Export the specified purchase order as a short PDF (driver receipt).
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function exportShortPdf($id)
    {
        $purchaseOrder = PurchaseOrder::with(['supplier', 'items.product'])->findOrFail($id);
        
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
            ->export('pdf.purchase-order-short', [
                'purchaseOrder' => $purchaseOrder,
                'company' => $company,
                'siteSettings' => $siteSettings
            ], 'DriverReceipt-' . $purchaseOrder->po_number . '.pdf');
    }
}
