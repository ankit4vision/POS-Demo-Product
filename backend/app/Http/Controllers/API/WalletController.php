<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\WalletAccount;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    /**
     * Get wallet ledger for a specific party.
     */
    public function ledger($walletId)
    {
        // Fetch transactions in ASC order for running balance calculation
        $wallet = WalletAccount::with(['transactions' => function($q) {
            $q->orderBy('created_at', 'asc')->orderBy('id', 'asc');
        }])->findOrFail($walletId);

        $transactions = $wallet->transactions;
        $runningBalance = 0;
        foreach ($transactions as $transaction) {
            $runningBalance += $transaction->type === 'credit'
                ? $transaction->amount
                : -$transaction->amount;
            $transaction->running_balance = $runningBalance;
        }

        // Now sort transactions DESC for listing
        $transactions = $transactions->sortByDesc('created_at')->sortByDesc('id')->values();

        return response()->json([
            'wallet' => $wallet,
            'transactions' => $transactions
        ]);
    }

    /**
     * Add a new wallet transaction.
     */
    public function addTransaction(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'party_type' => 'required|in:customer,retailer',
            'party_id' => 'required|exists:customers,id',
            'type' => 'required|in:credit,debit',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'payment_method' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:100',
            // 'invoice_id' => 'nullable|exists:invoices,id', // Invoice model not implemented yet
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify party type matches
        $party = Customer::find($request->party_id);
        if ($party->type !== $request->party_type) {
            return response()->json([
                'message' => 'Party type does not match the customer type'
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Get or create wallet account
            $walletAccount = WalletAccount::firstOrCreate(
                [
                    'party_type' => $request->party_type,
                    'party_id' => $request->party_id,
                ],
                [
                    'current_balance' => 0,
                ]
            );

            // Add transaction
            $transaction = $walletAccount->addTransaction(
                $request->type,
                $request->amount,
                $request->description,
                $request->payment_method,
                $request->reference
                // $request->invoice_id // Invoice model not implemented yet
            );

            // Recalculate wallet balance
            $walletAccount->recalculateCurrentBalance();

            DB::commit();

            // Load relationships
            $transaction->load(['walletAccount.party']);

            return response()->json([
                'message' => 'Transaction added successfully',
                'data' => [
                    'transaction' => $transaction,
                    'new_balance' => $walletAccount->current_balance,
                    'balance_text' => $walletAccount->balance_text,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error adding transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get wallet statistics.
     */
    public function stats()
    {
        $stats = [
            'total_wallet_accounts' => WalletAccount::count(),
            'total_credit_balance' => WalletAccount::where('current_balance', '>', 0)->sum('current_balance'),
            'total_debit_balance' => abs(WalletAccount::where('current_balance', '<', 0)->sum('current_balance')),
            'total_transactions' => WalletTransaction::count(),
            'total_credit_transactions' => WalletTransaction::credits()->sum('amount'),
            'total_debit_transactions' => WalletTransaction::debits()->sum('amount'),
            'customer_accounts' => WalletAccount::byPartyType('customer')->count(),
            'retailer_accounts' => WalletAccount::byPartyType('retailer')->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Get recent transactions.
     */
    public function recentTransactions(Request $request)
    {
        $query = WalletTransaction::with('walletAccount')->orderBy('created_at', 'desc');

        // Filter by party type
        if ($request->has('party_type') && in_array($request->party_type, ['customer', 'retailer'])) {
            $query->whereHas('walletAccount', function ($q) use ($request) {
                $q->where('party_type', $request->party_type);
            });
        }

        // Filter by transaction type
        if ($request->has('type') && in_array($request->type, ['credit', 'debit'])) {
            $query->where('type', $request->type);
        }

        $limit = $request->get('limit', 10);
        $transactions = $query->limit($limit)->get();

        return response()->json($transactions);
    }

    /**
     * Get customers/retailers with outstanding balances.
     */
    public function outstandingBalances(Request $request)
    {
        $partyType = $request->get('party_type', 'customer');
        
        if (!in_array($partyType, ['customer', 'retailer'])) {
            return response()->json([
                'message' => 'Invalid party type'
            ], 422);
        }

        $accounts = WalletAccount::with('party')
                                ->byPartyType($partyType)
                                ->where('current_balance', '!=', 0)
                                ->orderBy('current_balance', 'desc')
                                ->get();

        $accounts->transform(function ($account) {
            $account->party->append(['current_balance', 'balance_status', 'balance_text']);
            return $account;
        });

        return response()->json($accounts);
    }

    /**
     * Update a wallet transaction.
     */
    public function updateTransaction(Request $request, $transactionId)
    {
        $transaction = WalletTransaction::with('walletAccount')->find($transactionId);

        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction not found'
            ], 404);
        }

        if (!$transaction->canEdit()) {
            return response()->json([
                'message' => 'This transaction cannot be edited'
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|required|in:credit,debit',
            'amount' => 'sometimes|required|numeric|min:0.01',
            'description' => 'nullable|string',
            'payment_method' => 'nullable|string|max:50',
            'reference' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $transaction->update($validator->validated());

            // Recalculate wallet balance
            $wallet = $transaction->walletAccount;
            $wallet->recalculateCurrentBalance();

            DB::commit();

            // Reload walletAccount relationship
            $transaction->load('walletAccount');

            return response()->json([
                'message' => 'Transaction updated successfully',
                'data' => [
                    'transaction' => $transaction,
                    'new_balance' => $transaction->walletAccount->current_balance,
                    'balance_text' => $transaction->walletAccount->balance_text,
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error updating transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a wallet transaction.
     */
    public function deleteTransaction($transactionId)
    {
        $transaction = WalletTransaction::with('walletAccount')->find($transactionId);

        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction not found'
            ], 404);
        }

        if (!$transaction->canDelete()) {
            return response()->json([
                'message' => 'This transaction cannot be deleted'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $wallet = $transaction->walletAccount;
            $transaction->delete();
            $wallet->recalculateCurrentBalance();

            DB::commit();

            return response()->json([
                'message' => 'Transaction deleted successfully',
                'data' => [
                    'new_balance' => $wallet->current_balance,
                    'balance_text' => $wallet->balance_text,
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error deleting transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // List all wallet accounts
    public function index()
    {
        return WalletAccount::with('transactions')->get();
    }

    // Show a single wallet account with transactions
    public function show($id)
    {
        return WalletAccount::with('transactions')->findOrFail($id);
    }

    // Get wallet account by customer/party ID
    public function byCustomer($partyType, $partyId)
    {
        $wallet = WalletAccount::where('party_type', $partyType)
            ->where('party_id', $partyId)
            ->firstOrFail();
        return response()->json($wallet);
    }

    /**
     * Export wallet ledger as PDF.
     *
     * @param  int  $walletId
     * @return \Illuminate\Http\Response
     */
    public function exportPdf($walletId)
    {
        // Fetch wallet with transactions
        $wallet = WalletAccount::with(['transactions' => function($q) {
            $q->orderBy('created_at', 'asc')->orderBy('id', 'asc');
        }])->findOrFail($walletId);

        // Calculate running balance for each transaction
        $transactions = $wallet->transactions;
        $runningBalance = 0;
        foreach ($transactions as $transaction) {
            $runningBalance += $transaction->type === 'credit'
                ? $transaction->amount
                : -$transaction->amount;
            $transaction->running_balance = $runningBalance;
        }

        // Sort transactions DESC for listing
        $transactions = $transactions->sortByDesc('created_at')->sortByDesc('id')->values();

        // Fetch customer information
        $customer = Customer::find($wallet->party_id);
        
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

        // Calculate summary statistics
        $totalCredit = $transactions->where('type', 'credit')->sum('amount');
        $totalDebit = $transactions->where('type', 'debit')->sum('amount');
        $currentBalance = $wallet->current_balance;

        return app(\App\Services\PdfExportService::class)
            ->export('pdf.wallet-ledger', [
                'wallet' => $wallet,
                'customer' => $customer,
                'transactions' => $transactions,
                'company' => $company,
                'siteSettings' => $siteSettings,
                'summary' => [
                    'total_credit' => $totalCredit,
                    'total_debit' => $totalDebit,
                    'current_balance' => $currentBalance,
                    'total_transactions' => $transactions->count()
                ]
            ], 'WalletLedger-' . ($customer->name ?? $wallet->id) . '.pdf');
    }

    /**
     * Get a wallet transaction by its ID.
     */
    public function transaction($transactionId)
    {
        $transaction = WalletTransaction::with('walletAccount')->find($transactionId);
        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction not found'
            ], 404);
        }
        return response()->json($transaction);
    }
} 