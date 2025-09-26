<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentTransactionsReportController extends Controller
{
    /**
     * Display a unified list of all payment transactions (sales, purchase, wallet, etc.)
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 20);
        $page = $request->get('page', 1);
        $dateFrom = $request->get('start_date');
        $dateTo = $request->get('end_date');
        $type = $request->get('type'); // sale, purchase, wallet, or null
        $method = $request->get('method');
        $reference = $request->get('reference');

        $results = [];

        // Sales Transactions
        if (!$type || $type === 'sale') {
            $salesQuery = DB::table('sales_transactions')
                ->join('sales', 'sales_transactions.sale_id', '=', 'sales.id')
                ->leftJoin('customers', 'sales.customer_id', '=', 'customers.id')
                ->select([
                    'sales_transactions.id',
                    DB::raw("'sale' as type"),
                    'sales_transactions.created_at as date',
                    'sales.invoice_ref as reference',
                    'customers.name as party_name',
                    'customers.phone as party_phone',
                    'sales_transactions.amount',
                    'sales_transactions.payment_type as method',
                    DB::raw('NULL as status'),
                    'sales_transactions.description',
                ]);
            if ($dateFrom) $salesQuery->whereDate('sales_transactions.created_at', '>=', $dateFrom);
            if ($dateTo) $salesQuery->whereDate('sales_transactions.created_at', '<=', $dateTo);
            if ($method) $salesQuery->where('sales_transactions.payment_type', $method);
            if ($reference) $salesQuery->where('sales.invoice_ref', 'like', "%$reference%");
            $results = array_merge($results, $salesQuery->get()->toArray());
        }

        // Purchase Transactions
        if (!$type || $type === 'purchase') {
            $purchaseQuery = DB::table('purchase_transactions')
                ->join('purchase_orders', 'purchase_transactions.purchase_order_id', '=', 'purchase_orders.id')
                ->leftJoin('suppliers', 'purchase_orders.supplier_id', '=', 'suppliers.id')
                ->select([
                    'purchase_transactions.id',
                    DB::raw("'purchase' as type"),
                    'purchase_transactions.payment_date as date',
                    'purchase_orders.po_number as reference',
                    'suppliers.name as party_name',
                    'suppliers.phone as party_phone',
                    'purchase_transactions.amount',
                    'purchase_transactions.payment_method as method',
                    'purchase_transactions.status',
                    'purchase_transactions.notes as description',
                ]);
            if ($dateFrom) $purchaseQuery->whereDate('purchase_transactions.payment_date', '>=', $dateFrom);
            if ($dateTo) $purchaseQuery->whereDate('purchase_transactions.payment_date', '<=', $dateTo);
            if ($method) $purchaseQuery->where('purchase_transactions.payment_method', $method);
            if ($reference) $purchaseQuery->where('purchase_orders.po_number', 'like', "%$reference%");
            $results = array_merge($results, $purchaseQuery->get()->toArray());
        }

        // Wallet Transactions
        if (!$type || $type === 'wallet') {
            $walletQuery = DB::table('wallet_transactions')
                ->join('wallet_accounts', 'wallet_transactions.wallet_id', '=', 'wallet_accounts.id')
                ->leftJoin('customers', function($join) {
                    $join->on('wallet_accounts.party_id', '=', 'customers.id')
                         ->on('wallet_accounts.party_type', '=', 'customers.type');
                })
                ->select([
                    'wallet_transactions.id',
                    DB::raw("'wallet' as type"),
                    'wallet_transactions.created_at as date',
                    'wallet_transactions.reference',
                    'customers.name as party_name',
                    'customers.phone as party_phone',
                    'wallet_transactions.amount',
                    'wallet_transactions.payment_method as method',
                    DB::raw('NULL as status'),
                    'wallet_transactions.description',
                ]);
            if ($dateFrom) $walletQuery->whereDate('wallet_transactions.created_at', '>=', $dateFrom);
            if ($dateTo) $walletQuery->whereDate('wallet_transactions.created_at', '<=', $dateTo);
            if ($method) $walletQuery->where('wallet_transactions.payment_method', $method);
            if ($reference) $walletQuery->where('wallet_transactions.reference', 'like', "%$reference%");
            $results = array_merge($results, $walletQuery->get()->toArray());
        }

        // Sort all results by date desc
        usort($results, function($a, $b) {
            return strtotime($b->date) <=> strtotime($a->date);
        });

        // Pagination
        $total = count($results);
        $lastPage = (int) ceil($total / $perPage);
        $offset = ($page - 1) * $perPage;
        $paginated = array_slice($results, $offset, $perPage);

        return response()->json([
            'data' => $paginated,
            'pagination' => [
                'total' => $total,
                'per_page' => (int) $perPage,
                'current_page' => (int) $page,
                'last_page' => $lastPage,
            ],
        ]);
    }
} 