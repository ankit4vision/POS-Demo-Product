<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use Illuminate\Http\Request;

class EmployeeSalaryController extends Controller
{
    public function index(Employee $employee)
    {
        return response()->json($employee->salaries()->orderBy('month', 'desc')->get());
    }

    public function store(Request $request, Employee $employee)
    {
        $data = $request->validate([
            'month' => 'required|date_format:Y-m',
            'base_salary' => 'required|numeric|min:0',
            'allowances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);
        $data['allowances'] = $data['allowances'] ?? 0;
        $data['deductions'] = $data['deductions'] ?? 0;
        $data['net_salary'] = $data['base_salary'] + $data['allowances'] - $data['deductions'];
        $salary = $employee->salaries()->create($data);
        return response()->json($salary, 201);
    }

    public function update(Request $request, EmployeeSalary $salary)
    {
        $data = $request->validate([
            'month' => 'required|date_format:Y-m',
            'base_salary' => 'required|numeric|min:0',
            'allowances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);
        $data['allowances'] = $data['allowances'] ?? 0;
        $data['deductions'] = $data['deductions'] ?? 0;
        $data['net_salary'] = $data['base_salary'] + $data['allowances'] - $data['deductions'];
        $salary->update($data);
        return response()->json($salary);
    }

    public function destroy(EmployeeSalary $salary)
    {
        $salary->delete();
        return response()->json(['message' => 'Salary record deleted']);
    }
} 