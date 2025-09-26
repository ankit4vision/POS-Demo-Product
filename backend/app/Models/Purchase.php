<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_order_id',
        'supplier_id',
        'purchase_number',
        'purchase_date',
        'received_date',
        'status',
        'notes',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'created_by',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'received_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the purchase order for this purchase.
     */
    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    /**
     * Get the supplier for this purchase.
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the items for this purchase.
     */
    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    /**
     * Get the user who created this purchase.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to only include active purchases.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include cancelled purchases.
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    /**
     * Generate purchase number.
     */
    public static function generatePurchaseNumber()
    {
        $lastPurchase = self::orderBy('id', 'desc')->first();
        $lastNumber = $lastPurchase ? intval(substr($lastPurchase->purchase_number, 3)) : 0;
        return 'PUR-' . str_pad($lastNumber + 1, 6, '0', STR_PAD_LEFT);
    }
} 