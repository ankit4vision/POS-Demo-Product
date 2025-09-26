<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'barcode',
        'image',
        'category_id',
        'sub_category_id',
        'brand_id',
        'unit_id',
        'purchase_price',
        'sales_price',
        'retailer_sales_price',
        'individual_sales_price',
        'last_purchase_price',
        'last_purchase_date',
        'vat_percent',
        'opening_stock',
        'low_stock_alert',
        'description',
        'status',
        'discount',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'sales_price' => 'decimal:2',
        'retailer_sales_price' => 'decimal:2',
        'individual_sales_price' => 'decimal:2',
        'last_purchase_price' => 'decimal:2',
        'last_purchase_date' => 'date:Y-m-d',
        'vat_percent' => 'decimal:2',
        'opening_stock' => 'integer', // Changed from decimal:2 to integer for stock quantities
        'low_stock_alert' => 'integer', // Changed from decimal:2 to integer for stock alerts
        'discount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = ['image_url', 'stock_status'];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    // Accessors
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            // Check if this is an S3 URL (starts with http/https)
            if (filter_var($this->image, FILTER_VALIDATE_URL)) {
                return $this->image;
            }
            
            // Check if this is an S3 path (doesn't contain storage/ prefix)
            if (!str_starts_with($this->image, 'storage/')) {
                // This might be an S3 path, try to get URL from S3 service
                try {
                    $s3Service = app(\App\Services\S3Service::class);
                    if ($s3Service->isEnabled()) {
                        $s3Url = $s3Service->getFileUrl($this->image);
                        if ($s3Url) {
                            return $s3Url;
                        }
                    }
                } catch (\Exception $e) {
                    // If S3 service fails, fallback to local storage
                }
            }
            
            // Default to local storage
            return asset('storage/' . $this->image);
        }
        return null;
    }

    public function getStockStatusAttribute()
    {
        if ((float)$this->opening_stock === 0.0) {
            return 'out_of_stock';
        } elseif ((float)$this->opening_stock < (float)$this->low_stock_alert) {
            return 'low_stock';
        } else {
            return 'in_stock';
        }
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }
} 