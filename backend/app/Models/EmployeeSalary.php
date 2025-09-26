<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeSalary extends Model
{
    protected $fillable = [
        'employee_id', 'month', 'base_salary', 'allowances', 'deductions', 'net_salary', 'notes'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
} 