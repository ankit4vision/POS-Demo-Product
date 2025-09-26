<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'designation',
        'department', 'address', 'date_of_joining', 'status'
    ];

    public function salaries()
    {
        return $this->hasMany(EmployeeSalary::class);
    }
} 