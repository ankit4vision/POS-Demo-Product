<?php

namespace App\Http\Controllers\API;

use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Brand;
use App\Models\Unit;
use App\Services\S3Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class ProductController extends Controller
{
    protected $s3Service;

    public function __construct(S3Service $s3Service)
    {
        $this->s3Service = $s3Service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'subCategory', 'brand', 'unit']);
        
        // Filter by status
        if ($request->has('status') && in_array($request->status, ['active', 'inactive'])) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by stock status
        if ($request->has('stock_status') && $request->stock_status) {
            switch ($request->stock_status) {
                case 'in_stock':
                    // Products with stock > low_stock_alert (or stock > 0 if low_stock_alert is null)
                    $query->where(function($q) {
                        $q->where(function($subQ) {
                            $subQ->whereNotNull('opening_stock')
                                 ->where('opening_stock', '>', 0)
                                 ->where(function($innerQ) {
                                     $innerQ->whereNull('low_stock_alert')
                                           ->orWhereRaw('opening_stock > low_stock_alert');
                                 });
                        });
                    });
                    break;
                    
                case 'low_stock':
                    // Products with stock > 0 AND stock <= low_stock_alert (if low_stock_alert is not null)
                    $query->where(function($q) {
                        $q->whereNotNull('opening_stock')
                          ->where('opening_stock', '>', 0)
                          ->whereNotNull('low_stock_alert')
                          ->whereRaw('opening_stock <= low_stock_alert');
                    });
                    break;
                    
                case 'out_of_stock':
                    // Products with stock = 0 or null
                    $query->where(function($q) {
                        $q->whereNull('opening_stock')
                          ->orWhere('opening_stock', 0);
                    });
                    break;
            }
        }

        // Search by name, sku, or barcode
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('sku', 'like', '%' . $search . '%')
                  ->orWhere('barcode', 'like', '%' . $search . '%');
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if (!in_array($sortBy, ['id', 'name', 'sku', 'created_at'])) {
            $sortBy = 'id';
        }
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }
        
        $query->orderBy($sortBy, $sortOrder);
        $perPage = $request->get('per_page', 10);
        
        $result = $query->paginate($perPage);
        
        // Calculate stats for ALL products (not just current page)
        $statsQuery = Product::query();
        
        // Apply same filters as main query for accurate stats
        if ($request->has('status') && in_array($request->status, ['active', 'inactive'])) {
            $statsQuery->where('status', $request->status);
        }
        if ($request->has('category_id') && $request->category_id) {
            $statsQuery->where('category_id', $request->category_id);
        }
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $statsQuery->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('sku', 'like', '%' . $search . '%')
                  ->orWhere('barcode', 'like', '%' . $search . '%');
            });
        }
        
        $allProducts = $statsQuery->get();
        $total = $allProducts->count();
        $inStock = 0;
        $lowStock = 0;
        $outOfStock = 0;
        
        foreach ($allProducts as $product) {
            $stock = $product->opening_stock ?? 0;
            $lowStockAlert = $product->low_stock_alert ?? 0;
            
            if ($stock === 0) {
                $outOfStock++;
            } elseif ($lowStockAlert > 0 && $stock <= $lowStockAlert) {
                $lowStock++;
            } else {
                $inStock++;
            }
        }
        
        $stats = [
            'total' => $total,
            'inStock' => $inStock,
            'lowStock' => $lowStock,
            'outOfStock' => $outOfStock
        ];
        
        // Debug: Log the first product to see if image_url is included
        if ($result->count() > 0) {
            $firstProduct = $result->first();
            \Log::info('First product in response:', [
                'id' => $firstProduct->id,
                'name' => $firstProduct->name,
                'image' => $firstProduct->image,
                'image_url' => $firstProduct->image_url,
                'has_image_url' => isset($firstProduct->image_url),
                'app_url' => config('app.url'),
                'asset_url' => asset('storage/' . $firstProduct->image)
            ]);
        }
        
        return response()->json([
            'data' => $result->items(),
            'current_page' => $result->currentPage(),
            'last_page' => $result->lastPage(),
            'per_page' => $result->perPage(),
            'total' => $result->total(),
            'stats' => $stats
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255|unique:products,sku',
            'barcode' => 'nullable|string|max:255|unique:products,barcode',
            'image' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'unit_id' => 'nullable|exists:units,id',
            'purchase_price' => 'required|numeric|min:0',
            'sales_price' => 'required|numeric|min:0',
            'retailer_sales_price' => 'required|numeric|min:0',
            'individual_sales_price' => 'required|numeric|min:0',
            'last_purchase_price' => 'nullable|numeric|min:0',
            'vat_percent' => 'nullable|numeric|min:0|max:100',
            'opening_stock' => 'nullable|numeric|min:0',
            'low_stock_alert' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'discount' => 'nullable|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Convert string values to proper numeric types for decimal fields
        $numericFields = [
            'purchase_price', 'sales_price', 'retailer_sales_price', 'individual_sales_price',
            'last_purchase_price', 'vat_percent', 'opening_stock', 'low_stock_alert', 'discount'
        ];
        
        foreach ($numericFields as $field) {
            if (isset($data[$field]) && $data[$field] !== '') {
                $data[$field] = (float) $data[$field];
            } else {
                unset($data[$field]); // Remove empty fields to avoid casting issues
            }
        }

        // Image path is already in the validated data
        \Log::info('Final data to create:', $data);
        
        $product = Product::create($data);

        return response()->json($product->load(['category', 'subCategory', 'brand', 'unit']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'subCategory', 'brand', 'unit']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Debug logging
        \Log::info('Product Update Request Data:', $request->all());
        \Log::info('Product Update Request Files:', $request->allFiles());
        \Log::info('Product Update Request Headers:', $request->headers->all());
        \Log::info('Product Update Request Method:', ['method' => $request->method()]);
        \Log::info('Product Update Request Content Type:', ['content_type' => $request->header('Content-Type')]);
        
        // Debug file upload
        \Log::info('Has file image:', ['has_file' => $request->hasFile('image')]);
        \Log::info('All files:', $request->allFiles());
        \Log::info('File image:', ['file' => $request->file('image')]);
        
        \Log::info('Request Input:', $request->input());
        \Log::info('Request Post:', $request->post());
        \Log::info('Request Query:', $request->query());
        \Log::info('Name field:', ['name' => $request->input('name')]);
        \Log::info('Purchase price field:', ['purchase_price' => $request->input('purchase_price')]);
        \Log::info('Status field:', ['status' => $request->input('status')]);

        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100|unique:products,sku,' . $id,
            'barcode' => 'nullable|string|max:100|unique:products,barcode,' . $id,
            'category_id' => 'nullable|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'unit_id' => 'nullable|exists:units,id',
            'purchase_price' => 'required|numeric|min:0',
            'sales_price' => 'required|numeric|min:0',
            'retailer_sales_price' => 'required|numeric|min:0',
            'individual_sales_price' => 'required|numeric|min:0',
            'last_purchase_price' => 'nullable|numeric|min:0',
            'vat_percent' => 'nullable|numeric|min:0|max:100',
            'opening_stock' => 'nullable|numeric|min:0',
            'low_stock_alert' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            \Log::error('Product Update Validation Failed:', $validator->errors()->toArray());
            \Log::error('Product Update Validation Data:', $request->all());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['image']);

        // Convert string values to proper numeric types for decimal fields
        $numericFields = [
            'purchase_price', 'sales_price', 'retailer_sales_price', 'individual_sales_price',
            'last_purchase_price', 'vat_percent', 'opening_stock', 'low_stock_alert', 'discount'
        ];
        
        foreach ($numericFields as $field) {
            if (isset($data[$field]) && $data[$field] !== '') {
                $data[$field] = (float) $data[$field];
            } else {
                unset($data[$field]); // Remove empty fields to avoid casting issues
            }
        }

        // Handle image upload
        if ($request->has('image') && $request->image) {
            \Log::info('Processing image path update...');
            
            // Delete old image if exists and different from new image
            if ($product->image && $product->image !== $request->image) {
                Storage::disk('public')->delete($product->image);
            }
            
            $data['image'] = $request->image;
            \Log::info('Image path updated:', ['path' => $request->image]);
        } else {
            \Log::info('No image path provided in request');
        }

        \Log::info('Final data to update:', $data);
        
        $product->update($data);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product->load(['category', 'subCategory', 'brand', 'unit'])
        ]);
    }

    /**
     * Test upload method for debugging
     */
    public function testUpload(Request $request)
    {
        \Log::info('Test Upload Request:', [
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'has_file' => $request->hasFile('image'),
            'all_files' => $request->allFiles(),
            'all_input' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        return response()->json([
            'message' => 'Test upload endpoint reached',
            'data' => [
                'has_file' => $request->hasFile('image'),
                'content_type' => $request->header('Content-Type'),
                'file_count' => count($request->allFiles()),
                'input_count' => count($request->all())
            ]
        ]);
    }

    /**
     * Upload product image
     */
    public function uploadImage(Request $request)
    {
        // Debug logging
        \Log::info('Image Upload Request:', [
            'has_file' => $request->hasFile('image'),
            'all_files' => $request->allFiles(),
            'content_type' => $request->header('Content-Type'),
            'all_input' => $request->all()
        ]);

        // Check if file exists in request
        if (!$request->hasFile('image')) {
            \Log::error('Image Upload: No file found in request');
            return response()->json([
                'message' => 'No image file found',
                'errors' => ['image' => ['Please select an image file to upload.']]
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            \Log::error('Image Upload Validation Failed:', $validator->errors()->toArray());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $image = $request->file('image');
            
            // Additional validation
            if (!$image->isValid()) {
                \Log::error('Image Upload: Invalid file upload', ['error' => $image->getError()]);
                return response()->json([
                    'message' => 'File upload failed',
                    'errors' => ['image' => ['The uploaded file is invalid or corrupted.']]
                ], 422);
            }

            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $imagePath = null;
            $imageUrl = null;
            $storageType = 'local';

            // Check if S3 is enabled and try to upload to S3
            if ($this->s3Service->isEnabled()) {
                try {
                    \Log::info('Attempting S3 upload...');
                    $s3Result = $this->s3Service->uploadFile($image, null);
                    $imagePath = $s3Result['path'];
                    $imageUrl = $s3Result['url'];
                    $storageType = 's3';
                    
                    \Log::info('S3 Upload Success:', [
                        'path' => $imagePath,
                        'url' => $imageUrl,
                        'bucket' => $s3Result['bucket']
                    ]);
                } catch (\Exception $e) {
                    \Log::error('S3 upload failed: ' . $e->getMessage());
                    return response()->json([
                        'message' => 'S3 upload failed. Please validate your S3 settings in the admin panel.',
                        'error' => 'S3 configuration error',
                        'details' => $e->getMessage(),
                        'suggestion' => 'Go to Settings → S3 Storage and test the connection or check your AWS credentials.'
                    ], 500);
                }
            } else {
                return response()->json([
                    'message' => 'S3 storage is not enabled. Please enable S3 storage in Settings → S3 Storage.',
                    'error' => 'S3 not enabled',
                    'suggestion' => 'Go to Settings → S3 Storage and enable S3 storage.'
                ], 400);
            }
            
            \Log::info('Image Upload Success:', [
                'original_name' => $image->getClientOriginalName(),
                'mime_type' => $image->getMimeType(),
                'size' => $image->getSize(),
                'stored_path' => $imagePath,
                'storage_type' => $storageType
            ]);
            
            return response()->json([
                'message' => 'Image uploaded successfully',
                'data' => [
                    'image_path' => $imagePath,
                    'image_url' => $imageUrl,
                    'filename' => $imageName,
                    'storage_type' => $storageType
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Image Upload Exception:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'message' => 'Failed to upload image',
                'errors' => ['image' => ['An error occurred while uploading the image. Please try again.']]
            ], 500);
        }
    }

    /**
     * Delete product image
     */
    public function deleteImage($id)
    {
        $product = Product::findOrFail($id);
        
        if ($product->image) {
            // Check if S3 is enabled and try to delete from S3
            if ($this->s3Service->isEnabled()) {
                try {
                    $this->s3Service->deleteFile($product->image);
                    \Log::info('S3 file deleted successfully: ' . $product->image);
                } catch (\Exception $e) {
                    \Log::warning('S3 delete failed, trying local storage: ' . $e->getMessage());
                    // Fallback to local storage deletion
                    Storage::disk('public')->delete($product->image);
                }
            } else {
                // Delete the image file from local storage
                Storage::disk('public')->delete($product->image);
            }
            
            // Remove image path from database
            $product->update(['image' => null]);
            
            return response()->json([
                'message' => 'Product image deleted successfully',
                'data' => $product->load(['category', 'subCategory', 'brand', 'unit'])
            ]);
        }
        
        return response()->json([
            'message' => 'No image found for this product'
        ], 404);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Delete image if exists
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
        return response()->json(null, 204);
    }

    /**
     * Find a product by barcode.
     */
    public function barcode($barcode)
    {
        $product = Product::with(['category', 'subCategory', 'brand', 'unit'])
            ->where('barcode', $barcode)
            ->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }
        return response()->json($product);
    }

    /**
     * Universal product lookup by barcode or SKU.
     */
    public function lookup($code)
    {
        $product = Product::with(['category', 'subCategory', 'brand', 'unit'])
            ->where('barcode', $code)
            ->orWhere('sku', $code)
            ->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }
        return response()->json([
            'product' => $product,
            'stock' => $product->opening_stock ?? null,
            'status' => $product->status,
        ]);
    }

    /**
     * Product-wise Margin Report (with filters, pagination, sorting, totals)
     */
    public function productMargins(Request $request)
    {
        $query = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->select(
                'products.id as product_id',
                'products.name as product_name',
                'products.category_id',
                'products.brand_id',
                DB::raw('SUM(sale_items.qty) as total_qty'),
                DB::raw('SUM((sale_items.price * sale_items.qty) - sale_items.discount) as net_sales'),
                DB::raw('SUM(sale_items.purchase_price * sale_items.qty) as total_cost'),
                DB::raw('SUM(((sale_items.price * sale_items.qty) - sale_items.discount) - (sale_items.purchase_price * sale_items.qty)) as gross_profit'),
                DB::raw('CASE WHEN SUM((sale_items.price * sale_items.qty) - sale_items.discount) > 0 THEN ROUND(SUM(((sale_items.price * sale_items.qty) - sale_items.discount) - (sale_items.purchase_price * sale_items.qty)) / SUM((sale_items.price * sale_items.qty) - sale_items.discount) * 100, 2) ELSE 0 END as margin_percent'),
                DB::raw('SUM(sale_items.tax) as vat')
            );

        // Date range filter
        if ($request->date_from) {
            $query->whereDate('sale_items.created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('sale_items.created_at', '<=', $request->date_to);
        }
        // Category filter
        if ($request->category_id) {
            $query->where('products.category_id', $request->category_id);
        }
        // Brand filter
        if ($request->brand_id) {
            $query->where('products.brand_id', $request->brand_id);
        }
        // Search filter
        if ($request->search) {
            $query->where('products.name', 'like', '%' . $request->search . '%');
        }

        $query->groupBy(
            'sale_items.product_id',
            'products.id',
            'products.name',
            'products.category_id',
            'products.brand_id'
        );

        // Sorting
        $sortBy = $request->get('sort_by', 'gross_profit');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['product_name', 'total_qty', 'net_sales', 'total_cost', 'gross_profit', 'margin_percent'];
        if (!in_array($sortBy, $allowedSorts)) $sortBy = 'gross_profit';
        if (!in_array($sortOrder, ['asc', 'desc'])) $sortOrder = 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 20);
        $page = $request->get('page', 1);
        $results = $query->paginate($perPage, ['*'], 'page', $page);

        // Totals
        $totals = [
            'total_qty' => $results->sum('total_qty'),
            'net_sales' => $results->sum('net_sales'),
            'total_cost' => $results->sum('total_cost'),
            'gross_profit' => $results->sum('gross_profit'),
            'margin_percent' => $results->sum('net_sales') > 0 ? round($results->sum('gross_profit') / $results->sum('net_sales') * 100, 2) : 0,
            'vat' => $results->sum('vat'),
        ];

        return response()->json([
            'data' => $results->items(),
            'pagination' => [
                'total' => $results->total(),
                'per_page' => $results->perPage(),
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
            ],
            'totals' => $totals,
        ]);
    }

    /**
     * Export all products as a PDF table.
     */
    public function exportPdf(Request $request)
    {
        $priceType = strtolower($request->query('price', 'base'));
        if (!in_array($priceType, ['base', 'retailer', 'customer'])) {
            $priceType = 'base';
        }
        
        $withPrice = $request->query('with_price', '0') === '1';
        $stockFilter = $request->query('stock_filter', 'all');
        
        $query = Product::with(['brand', 'category', 'unit']);
        
        // Apply stock filter
        if ($stockFilter === 'available') {
            $query->where('opening_stock', '>', 0);
        }
        
        $products = $query->orderBy('name')->get();

        $data = $products->map(function($product, $idx) use ($priceType, $withPrice) {
            $title = $product->name;
            $unit = $product->unit && $product->unit->name ? $product->unit->name : '';
            $desc = $product->description ? $product->description : '';
            $brand = $product->brand && $product->brand->name ? $product->brand->name : '';
            $category = $product->category && $product->category->name ? $product->category->name : '';
            $info = $title;
            if ($unit) $info .= " | $unit";
            $lines = [];
            if ($desc) $lines[] = $desc;
            $brandCat = ($brand ? $brand : '') . ($brand && $category ? ' | ' : '') . ($category ? $category : '');
            if ($brandCat) $lines[] = $brandCat;
            if (!empty($lines)) $info .= "\n" . implode("\n", $lines);
            $stock = $product->stock_status ?? 'unknown';
            if ($stock === 'in_stock') $stock = 'In Stock';
            else if ($stock === 'low_stock') $stock = 'Low Stock';
            else if ($stock === 'out_of_stock') $stock = 'Out of Stock';
            
            $price = '';
            if ($withPrice) {
                if ($priceType === 'base') $price = '£' . number_format($product->sales_price, 2);
                if ($priceType === 'retailer') $price = '£' . number_format($product->retailer_sales_price, 2);
                if ($priceType === 'customer') $price = '£' . number_format($product->individual_sales_price, 2);
            }
            
            $row = [
                '#' => $idx + 1,
                'Product Info' => $info,
                'Stock' => $stock,
            ];
            
            if ($withPrice) {
                $row['Price'] = $price;
            }
            
            return $row;
        });

        $columns = ['#', 'Product Info', 'Stock'];
        if ($withPrice) {
            $columns[] = 'Price';
        }

        // Get company info from settings table (group = 'billing')
        $company = \DB::table('settings')
            ->where('group', 'billing')
            ->pluck('value', 'key')
            ->toArray();
        // Fetch site settings
        $siteSettings = \DB::table('settings')
            ->where('group', 'siteSettings')
            ->pluck('value', 'key')
            ->toArray();

        $pdf = Pdf::loadView('exports.products', [
            'rows' => $data,
            'columns' => $columns,
            'company' => $company,
            'siteSettings' => $siteSettings,
            'priceType' => ucfirst($priceType),
            'withPrice' => $withPrice,
            'stockFilter' => $stockFilter
        ]);
        return $pdf->download('products.pdf');
    }
} 