<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'subtotal',
        'total_discount',
        'total_tax',
        'grand_total',
        'rounded_total',
        'round_off',
        'paid',
        'due',
        'mode',
        'invoice_ref',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function walletTransactions()
    {
        return $this->hasMany(WalletTransaction::class, 'invoice_id');
    }

    public function sales_transactions()
    {
        return $this->hasMany(\App\Models\SalesTransaction::class, 'sale_id');
    }
}
