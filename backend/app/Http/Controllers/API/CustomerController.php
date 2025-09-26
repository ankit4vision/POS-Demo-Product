<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\WalletAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index(Request $request)
    {
        $query = Customer::with(['walletAccount.transactions']);

        // Search
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Filter by type
        if ($request->has('type') && in_array($request->type, ['customer', 'retailer'])) {
            $query->byType($request->type);
        }

        // Filter by status
        if ($request->has('status') && in_array($request->status, ['active', 'inactive'])) {
            $query->where('status', $request->status);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $customers = $query->paginate($perPage);

        // Add balance information to each customer
        $customers->getCollection()->transform(function ($customer) {
            $customer->append(['current_balance', 'balance_status', 'balance_text']);
            return $customer;
        });

        return response()->json($customers);
    }

    /**
     * Store a newly created customer.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:customer,retailer',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'gst_number' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create customer
            $customer = Customer::create($validator->validated());

            // Create wallet account
            WalletAccount::create([
                'party_type' => $customer->type,
                'party_id' => $customer->id,
                'current_balance' => 0,
            ]);

            DB::commit();

            $customer->load('walletAccount');
            $customer->append(['current_balance', 'balance_status', 'balance_text']);

            return response()->json([
                'message' => 'Customer created successfully',
                'data' => $customer
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error creating customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified customer.
     */
    public function show($id)
    {
        $customer = Customer::with('walletAccount')->find($id);

        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        }

        $customer->append(['current_balance', 'balance_status', 'balance_text']);

        return response()->json($customer);
    }

    /**
     * Update the specified customer.
     */
    public function update(Request $request, $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|required|in:customer,retailer',
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'gst_number' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'sometimes|required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Store original type before update
            $originalType = $customer->type;

            // Update customer
            $customer->update($validator->validated());

            // Update wallet account party_type if type changed
            if ($request->has('type') && $request->type !== $originalType) {
                // Find and update wallet account
                $walletAccount = WalletAccount::where('party_id', $customer->id)
                    ->where('party_type', $originalType)
                    ->first();
                
                if ($walletAccount) {
                    $walletAccount->update([
                        'party_type' => $request->type
                    ]);
                    
                    // Log the update for debugging
                    \Log::info("Wallet account updated for customer {$customer->id}: {$originalType} -> {$request->type}");
                } else {
                    // Log if wallet account not found
                    \Log::warning("Wallet account not found for customer {$customer->id} with type {$originalType}");
                }
            }

            DB::commit();

            $customer->load('walletAccount');
            $customer->append(['current_balance', 'balance_status', 'balance_text']);

            return response()->json([
                'message' => 'Customer updated successfully',
                'data' => $customer
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error updating customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified customer.
     */
    public function destroy($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        }

        try {
            // Check if customer has any transactions
            $hasTransactions = $customer->walletAccount?->transactions()->exists();

            if ($hasTransactions) {
                return response()->json([
                    'message' => 'Cannot delete customer with existing wallet transactions'
                ], 422);
            }

            $customer->delete();

            return response()->json([
                'message' => 'Customer deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get customer statistics.
     */
    public function stats()
    {
        $stats = [
            'total_customers' => Customer::customers()->count(),
            'total_retailers' => Customer::retailers()->count(),
            'active_customers' => Customer::customers()->active()->count(),
            'active_retailers' => Customer::retailers()->active()->count(),
            'total_credit' => WalletAccount::where('current_balance', '>', 0)->sum('current_balance'),
            'total_debit' => abs(WalletAccount::where('current_balance', '<', 0)->sum('current_balance')),
        ];

        return response()->json($stats);
    }

    /**
     * Print customer details as PDF
     */
    public function printCustomer($id)
    {
        $customer = Customer::with(['walletAccount'])->findOrFail($id);
        
        // Get company info from settings
        $company = \DB::table('settings')
            ->where('group', 'billing')
            ->pluck('value', 'key')
            ->toArray();

        return app(\App\Services\PdfExportService::class)
            ->export('pdf.customer-detail', [
                'customer' => $customer,
                'company' => $company
            ], 'Customer-' . $customer->id . '.pdf');
    }

    /**
     * Export the specified customer as a PDF report.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function exportPdf($id)
    {
        $customer = \App\Models\Customer::with('walletAccount')->findOrFail($id);
        $customer->append(['current_balance', 'balance_status', 'balance_text']);
        $wallet = $customer->walletAccount;
        $walletId = $wallet ? $wallet->id : null;
        $walletTransactions = [];
        if ($walletId) {
            $walletTransactions = $wallet->transactions()->orderBy('created_at', 'desc')->get();
        }
        $sales = \App\Models\Sale::with('sales_transactions')
            ->where('customer_id', $customer->id)
            ->orderBy('created_at', 'desc')
            ->get();
        $stats = [
            'total_sales' => \App\Models\Sale::where('customer_id', $customer->id)->sum('grand_total'),
            'total_paid' => \App\Models\Sale::where('customer_id', $customer->id)->sum('paid'),
            'total_due' => \App\Models\Sale::where('customer_id', $customer->id)->sum('due'),
            'num_sales' => \App\Models\Sale::where('customer_id', $customer->id)->count(),
            'num_wallet_transactions' => $walletId ? $wallet->transactions()->count() : 0,
        ];
        // Wallet summary cards
        $wallet_summary = [
            'num_wallet_transactions' => $walletId ? $wallet->transactions()->count() : 0,
            'total_debit' => $walletId ? $wallet->transactions()->where('type', 'debit')->sum('amount') : 0,
            'total_credit' => $walletId ? $wallet->transactions()->where('type', 'credit')->sum('amount') : 0,
            'current_balance' => $customer->current_balance,
        ];
        // Sales summary cards
        $sales_summary = [
            'num_sales' => $stats['num_sales'],
            'total_sales' => $stats['total_sales'],
            'total_paid' => $stats['total_paid'],
            'total_due' => $stats['total_due'],
        ];
        // Amount to collect
        $amount_to_collect = $customer->current_balance + ($stats['total_due'] * -1);
        // Fetch company info from settings
        $company = \DB::table('settings')
            ->where('group', 'billing')
            ->pluck('value', 'key')
            ->toArray();
        // Fetch site settings
        $siteSettings = \DB::table('settings')
            ->where('group', 'siteSettings')
            ->pluck('value', 'key')
            ->toArray();
        return app(\App\Services\PdfExportService::class)
            ->export('pdf.customer-detail', [
                'customer' => $customer,
                'wallet' => $wallet,
                'wallet_transactions' => $walletTransactions,
                'sales' => $sales,
                'stats' => $stats,
                'wallet_summary' => $wallet_summary,
                'sales_summary' => $sales_summary,
                'amount_to_collect' => $amount_to_collect,
                'company' => $company,
                'siteSettings' => $siteSettings
            ], 'CustomerReport-' . $customer->id . '.pdf');
    }

    /**
     * Customer full details for view page
     */
    public function details($id)
    {
        $customer = Customer::with('walletAccount')->find($id);
        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }
        $customer->append(['current_balance', 'balance_status', 'balance_text']);
        $wallet = $customer->walletAccount;
        $walletId = $wallet ? $wallet->id : null;
        $walletTransactions = [];
        if ($walletId) {
            $walletTransactions = $wallet->transactions()->orderBy('created_at', 'desc')->limit(10)->get();
        }
        $sales = \App\Models\Sale::with('sales_transactions')
            ->where('customer_id', $customer->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        $stats = [
            'total_sales' => \App\Models\Sale::where('customer_id', $customer->id)->sum('grand_total'),
            'total_paid' => \App\Models\Sale::where('customer_id', $customer->id)->sum('paid'),
            'total_due' => \App\Models\Sale::where('customer_id', $customer->id)->sum('due'),
            'num_sales' => \App\Models\Sale::where('customer_id', $customer->id)->count(),
            'num_wallet_transactions' => $walletId ? $wallet->transactions()->count() : 0,
        ];
        return response()->json([
            'customer' => $customer,
            'wallet' => $wallet,
            'wallet_transactions' => $walletTransactions,
            'sales' => $sales,
            'stats' => $stats,
        ]);
    }
} 