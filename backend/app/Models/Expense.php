<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;
    protected $fillable = [
        'date', 'amount', 'description', 'expense_category_id', 'created_by'
    ];

    public function category() {
        return $this->belongsTo(ExpenseCategory::class, 'expense_category_id');
    }
    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }
} 