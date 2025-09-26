<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_id',
        'product_id',
        'quantity',
        'unit_price',
        'tax_percent',
        'discount_percent',
        'total_amount',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'tax_percent' => 'decimal:2',
        'discount_percent' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get the purchase for this item.
     */
    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    /**
     * Get the product for this item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Calculate the total amount for this item.
     */
    public function calculateTotal()
    {
        $subtotal = $this->quantity * $this->unit_price;
        $taxAmount = $subtotal * ($this->tax_percent / 100);
        $discountAmount = $subtotal * ($this->discount_percent / 100);
        $total = $subtotal + $taxAmount - $discountAmount;

        $this->update(['total_amount' => $total]);
        return $this;
    }
} 