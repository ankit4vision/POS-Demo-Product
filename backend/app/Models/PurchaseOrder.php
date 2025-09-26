<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'po_number',
        'supplier_id',
        'order_date',
        'expected_delivery_date',
        'purchase_date',
        'status',
        'notes',
        'reference',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'paid_amount',
        'paid_status',
        'created_by',
    ];

    protected $casts = [
        'order_date' => 'date:Y-m-d',
        'expected_delivery_date' => 'date:Y-m-d',
        'purchase_date' => 'date:Y-m-d',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the supplier for this purchase order.
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the items for this purchase order.
     */
    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    /**
     * Get the purchase transactions for this purchase order.
     */
    public function transactions()
    {
        return $this->hasMany(PurchaseTransaction::class);
    }

    /**
     * Get the purchase record if this PO was converted to purchase.
     */
    public function purchase()
    {
        return $this->hasOne(Purchase::class);
    }

    /**
     * Get the user who created this purchase order.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to only include draft purchase orders.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope a query to only include sent purchase orders.
     */
    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    /**
     * Scope a query to only include received purchase orders.
     */
    public function scopeReceived($query)
    {
        return $query->where('status', 'received');
    }

    /**
     * Scope a query to only include completed purchase orders.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Calculate totals based on items.
     */
    public function calculateTotals()
    {
        $subtotal = $this->items->sum(function ($item) {
            return $item->quantity * $item->unit_price;
        });

        // Round total amount to nearest integer
        $totalAmount = round($subtotal);

        $this->update([
            'subtotal' => $subtotal,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total_amount' => $totalAmount,
        ]);

        return $this;
    }

    /**
     * Generate PO number.
     */
    public static function generatePONumber()
    {
        $lastPO = self::orderBy('id', 'desc')->first();
        $lastNumber = $lastPO ? intval(substr($lastPO->po_number, 3)) : 0;
        return 'PO-' . str_pad($lastNumber + 1, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Update paid status based on paid amount.
     */
    public function updatePaidStatus()
    {
        $this->paid_status = $this->paid_amount >= $this->total_amount ? 'paid' : 'remaining';
        $this->save();
        return $this;
    }

    /**
     * Get remaining amount to be paid.
     */
    public function getRemainingAmountAttribute()
    {
        return max(0, $this->total_amount - $this->paid_amount);
    }

    /**
     * Check if purchase order is fully paid.
     */
    public function isFullyPaid()
    {
        return $this->paid_amount >= $this->total_amount;
    }
} 