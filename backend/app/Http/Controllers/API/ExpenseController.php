<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ExpenseController extends Controller
{
    // List expenses with filters and summary
    public function index(Request $request)
    {
        $query = Expense::with('category', 'creator');
        if ($request->filled('category_id')) {
            $query->where('expense_category_id', $request->category_id);
        }
        if ($request->filled('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }
        $expenses = $query->orderBy('date', 'desc')->paginate(20);
        return response()->json($expenses);
    }

    // Store new expense
    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'expense_category_id' => 'required|exists:expense_categories,id',
        ]);
        $data['created_by'] = Auth::id() ?? 1;
        $expense = Expense::create($data);
        return response()->json($expense, 201);
    }

    // Show single expense
    public function show($id)
    {
        $expense = Expense::with('category', 'creator')->findOrFail($id);
        return response()->json($expense);
    }

    // Update expense
    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);
        $data = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'expense_category_id' => 'required|exists:expense_categories,id',
        ]);
        $expense->update($data);
        return response()->json($expense);
    }

    // Delete expense
    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // Summary endpoints
    public function summary(Request $request)
    {
        $now = Carbon::now();
        $weekly = Expense::whereBetween('date', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()])->sum('amount');
        $monthly = Expense::whereMonth('date', $now->month)->whereYear('date', $now->year)->sum('amount');
        $yearly = Expense::whereYear('date', $now->year)->sum('amount');
        return response()->json([
            'weekly' => $weekly,
            'monthly' => $monthly,
            'yearly' => $yearly,
        ]);
    }
} 