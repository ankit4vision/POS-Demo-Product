<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseTransaction extends Model
{
    use HasFactory;

    protected $table = 'purchase_transactions';

    protected $fillable = [
        'purchase_order_id',
        'supplier_id',
        'amount',
        'payment_method',
        'status',
        'reference_number',
        'notes',
        'payment_date',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date:Y-m-d',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the purchase order for this transaction.
     */
    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    /**
     * Get the supplier for this transaction.
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the user who created this transaction.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to only include completed transactions.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include pending transactions.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Get payment method display name.
     */
    public function getPaymentMethodDisplayAttribute()
    {
        $methods = [
            'cash' => 'Cash',
            'bank_transfer' => 'Bank Transfer',
            'cheque' => 'Cheque',
            'credit_card' => 'Credit Card',
            'upi' => 'UPI',
            'other' => 'Other',
        ];

        return $methods[$this->payment_method] ?? $this->payment_method;
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute()
    {
        $statuses = [
            'pending' => 'Pending',
            'completed' => 'Completed',
            'failed' => 'Failed',
            'cancelled' => 'Cancelled',
        ];

        return $statuses[$this->status] ?? $this->status;
    }
}
