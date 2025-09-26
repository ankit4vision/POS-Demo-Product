<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::query();
        if ($request->search) {
            $query->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
        }
        return response()->json($query->orderBy('id', 'desc')->paginate(20));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:employees,email',
            'phone' => 'nullable|string|max:20',
            'designation' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'date_of_joining' => 'nullable|date',
            'status' => 'required|in:active,inactive,terminated',
        ]);
        $employee = Employee::create($data);
        return response()->json($employee, 201);
    }

    public function show(Employee $employee)
    {
        $employee->load('salaries');
        return response()->json($employee);
    }

    public function update(Request $request, Employee $employee)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
            'phone' => 'nullable|string|max:20',
            'designation' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'date_of_joining' => 'nullable|date',
            'status' => 'required|in:active,inactive,terminated',
        ]);
        $employee->update($data);
        return response()->json($employee);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return response()->json(['message' => 'Employee deleted']);
    }
} 