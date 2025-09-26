<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesTransaction extends Model
{
    use HasFactory;

    protected $table = 'sales_transactions';
    protected $fillable = [
        'sale_id',
        'payment_type',
        'amount',
        'description',
        'created_at',
        'updated_at',
    ];
} 