<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
// use App\Http\Controllers\CategoryController;
// use App\Http\Controllers\PurchasePaymentController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\SubCategoryController;
use App\Http\Controllers\API\BrandController;
use App\Http\Controllers\API\UnitController;
use App\Http\Controllers\API\ExpenseCategoryController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\WalletController;
use App\Http\Controllers\API\SaleController;
use App\Http\Controllers\API\SupplierController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseTransactionController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\EmployeeSalaryController;
use App\Http\Controllers\API\SettingController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\EmailController;
// use App\Http\Controllers\API\CategoryController as APICategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/test-email', [AuthController::class, 'testEmail']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::get('/auth/permissions', [AuthController::class, 'user']); // Alias for getting permissions

    // User Management Routes
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    // Role and Permission Routes
    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/roles/{role}', [RoleController::class, 'show']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions']);
    Route::put('/roles/{role}/restore', [RoleController::class, 'restore']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);

    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::get('/permissions/{permission}', [PermissionController::class, 'show']);
    Route::post('/permissions', [PermissionController::class, 'store']);
    Route::put('/permissions/{permission}', [PermissionController::class, 'update']);
    Route::put('/permissions/{permission}/restore', [PermissionController::class, 'restore']);
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy']);

    // Category Routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::get('/sub-categories', [SubCategoryController::class, 'index']);
    Route::get('/sub-categories/{subCategory}', [SubCategoryController::class, 'show']);
    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/brands/{brand}', [BrandController::class, 'show']);
    Route::get('/units', [UnitController::class, 'index']);
    Route::get('/units/{unit}', [UnitController::class, 'show']);
    Route::get('/expense-categories', [ExpenseCategoryController::class, 'index']);
    Route::get('/expense-categories/{expenseCategory}', [ExpenseCategoryController::class, 'show']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::post('/sub-categories', [SubCategoryController::class, 'store']);
    Route::post('/brands', [BrandController::class, 'store']);
    Route::post('/units', [UnitController::class, 'store']);
    Route::post('/expense-categories', [ExpenseCategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::put('/sub-categories/{subCategory}', [SubCategoryController::class, 'update']);
    Route::put('/brands/{brand}', [BrandController::class, 'update']);
    Route::put('/units/{unit}', [UnitController::class, 'update']);
    Route::put('/expense-categories/{expenseCategory}', [ExpenseCategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    Route::delete('/sub-categories/{subCategory}', [SubCategoryController::class, 'destroy']);
    Route::delete('/brands/{brand}', [BrandController::class, 'destroy']);
    Route::delete('/units/{unit}', [UnitController::class, 'destroy']);
    Route::delete('/expense-categories/{expenseCategory}', [ExpenseCategoryController::class, 'destroy']);

    // Product Routes
    Route::get('/products/export-pdf', [ProductController::class, 'exportPdf']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/products/barcode/{barcode}', [ProductController::class, 'barcode']);
    Route::get('/products/lookup/{code}', [ProductController::class, 'lookup']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/upload-image', [ProductController::class, 'uploadImage']);
    Route::post('/products/test-upload', [ProductController::class, 'testUpload']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::delete('/products/{id}/image', [ProductController::class, 'deleteImage']);

    // Product-wise Margin Report
    Route::get('/reports/product-margins', [ProductController::class, 'productMargins']);

    // Customer Routes
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/stats', [CustomerController::class, 'stats']);
    Route::get('/customers/{customer}', [CustomerController::class, 'show']);
    Route::get('/customers/{id}/print', [CustomerController::class, 'printCustomer']);
    Route::get('/customers/{id}/details', [CustomerController::class, 'details']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::put('/customers/{customer}', [CustomerController::class, 'update']);
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);
    Route::get('customers/{id}/export-pdf', [App\Http\Controllers\API\CustomerController::class, 'exportPdf']);

    // Wallet Routes
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    Route::get('/wallets/by-customer/{partyType}/{partyId}', [WalletController::class, 'byCustomer']);
    Route::get('/wallets/ledger/{walletId}', [WalletController::class, 'ledger']);
    Route::get('/wallets/transaction/{transactionId}', [WalletController::class, 'transaction']);
    Route::put('/wallets/transaction/{transactionId}', [WalletController::class, 'updateTransaction']);
    Route::delete('/wallets/transaction/{transactionId}', [WalletController::class, 'deleteTransaction']);
    Route::post('/wallets/transaction', [WalletController::class, 'addTransaction']);
    Route::get('/wallets/{walletId}/export-pdf', [WalletController::class, 'exportPdf']);

    // Sale Routes
    Route::get('/sales', [SaleController::class, 'index']);
    Route::get('/sales/{sale}', [SaleController::class, 'show']);
    Route::get('/sales/{id}/export-pdf', [SaleController::class, 'exportPdf']);
    Route::get('/sales/{id}/export-short-pdf', [SaleController::class, 'exportShortPdf']);
    Route::post('/sales', [SaleController::class, 'store']);
    Route::put('/sales/{sale}', [SaleController::class, 'update']);
    Route::post('/sales/{id}/adjust-amount', [SaleController::class, 'adjustAmount']); // New route for amount adjustment
    Route::delete('/sales/{sale}', [SaleController::class, 'destroy']);

    // Sales Summary Report
    Route::get('/reports/sales-summary', [SaleController::class, 'salesSummary']);

    // Company Profit & Loss (P&L) Report
    Route::get('/reports/profit-loss', [SaleController::class, 'profitLossReport']);

    // Purchase Order Routes
    Route::get('/purchase-orders', [PurchaseOrderController::class, 'index']);
    Route::get('/purchase-orders/completed', [PurchaseOrderController::class, 'getCompleted']);
    Route::get('/purchase-orders/suppliers/list', [PurchaseOrderController::class, 'getSuppliers']);
    Route::get('/purchase-orders/products/list', [PurchaseOrderController::class, 'getProducts']);
    Route::post('/purchase-orders', [PurchaseOrderController::class, 'store']);
    Route::get('/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'show']);
    Route::put('/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'update']);
    Route::get('/purchase-orders/{id}/export-pdf', [PurchaseOrderController::class, 'exportPdf']);
    Route::get('/purchase-orders/{id}/export-short-pdf', [PurchaseOrderController::class, 'exportShortPdf']);
    Route::post('/purchase-orders/{purchaseOrder}/convert-to-purchased', [PurchaseOrderController::class, 'convertToPurchased']);

    // Supplier Routes
    Route::get('/suppliers/active', [SupplierController::class, 'active']);
    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::get('/suppliers/{supplier}', [SupplierController::class, 'show']);
    Route::get('/suppliers/{supplier}/payments', [SupplierController::class, 'payments']);
    Route::get('/suppliers/{id}/export-pdf', [SupplierController::class, 'exportPdf']);
    Route::post('/suppliers', [SupplierController::class, 'store']);
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update']);
    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy']);

    // Purchase Transaction Routes
    Route::get('/purchase-transactions', [PurchaseTransactionController::class, 'index']);
    Route::get('/purchase-transactions/{purchaseTransaction}', [PurchaseTransactionController::class, 'show']);
    Route::get('/purchase-orders/{purchaseOrderId}/transactions', [PurchaseTransactionController::class, 'getByPurchaseOrder']);
    Route::get('/purchase-transactions/methods', [PurchaseTransactionController::class, 'getPaymentMethods']);
    Route::get('/purchase-transactions/statuses', [PurchaseTransactionController::class, 'getPaymentStatuses']);
    Route::post('/purchase-transactions', [PurchaseTransactionController::class, 'store']);
    Route::put('/purchase-transactions/{purchaseTransaction}', [PurchaseTransactionController::class, 'update']);
    Route::delete('/purchase-transactions/{purchaseTransaction}', [PurchaseTransactionController::class, 'destroy']);

    // Purchase Routes
    Route::get('/purchases', [PurchaseController::class, 'index']);
    Route::get('/purchases/{purchase}', [PurchaseController::class, 'show']);
    Route::get('/purchases/ready-orders', [PurchaseController::class, 'getReadyPurchaseOrders']);
    Route::post('/purchases', [PurchaseController::class, 'store']);
    Route::post('/purchases/convert/{purchaseOrder}', [PurchaseController::class, 'convertFromPurchaseOrder']);
    Route::put('/purchases/{purchase}', [PurchaseController::class, 'update']);
    Route::delete('/purchases/{purchase}', [PurchaseController::class, 'destroy']);

    // Employee Routes
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::get('/employees/{employee}', [EmployeeController::class, 'show']);
    Route::get('employees/{employee}/salaries', [EmployeeSalaryController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::post('employees/{employee}/salaries', [EmployeeSalaryController::class, 'store']);
    Route::put('/employees/{employee}', [EmployeeController::class, 'update']);
    Route::put('employee-salaries/{salary}', [EmployeeSalaryController::class, 'update']);
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy']);
    Route::delete('employee-salaries/{salary}', [EmployeeSalaryController::class, 'destroy']);

    // Expense Management
    Route::get('expenses', [App\Http\Controllers\API\ExpenseController::class, 'index']);
    Route::get('expenses/summary', [App\Http\Controllers\API\ExpenseController::class, 'summary']);
    Route::get('expenses/{expense}', [App\Http\Controllers\API\ExpenseController::class, 'show']);
    Route::post('expenses', [App\Http\Controllers\API\ExpenseController::class, 'store']);
    Route::put('expenses/{expense}', [App\Http\Controllers\API\ExpenseController::class, 'update']);
    Route::delete('expenses/{expense}', [App\Http\Controllers\API\ExpenseController::class, 'destroy']);

    // Settings Routes
    Route::get('settings', [SettingController::class, 'index']);
    Route::post('settings/billing', [SettingController::class, 'updateBilling']);
    Route::post('settings/site', [SettingController::class, 'updateSiteSettings']);
    Route::post('settings/email', [SettingController::class, 'updateEmail']);
    Route::post('settings/s3', [SettingController::class, 'updateS3']);
    Route::post('settings/test-s3', [SettingController::class, 'testS3Connection']);

    // Dashboard Routes
    Route::get('dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('dashboard/sales-trend', [DashboardController::class, 'salesTrend']);
    Route::get('dashboard/expense-breakdown', [DashboardController::class, 'expenseBreakdown']);
    Route::get('dashboard/monthly-sales-vs-purchases', [DashboardController::class, 'monthlySalesVsPurchases']);
    Route::get('/dashboard/business-summary', [\App\Http\Controllers\API\DashboardController::class, 'businessSummary']);
    Route::get('/dashboard/business-summary/export-pdf', [\App\Http\Controllers\API\DashboardController::class, 'exportBusinessSummaryPdf']);

    // Email Routes
    Route::get('/emails/history', [EmailController::class, 'getEmailHistory']);
    Route::post('/emails/send-wallet-ledger', [EmailController::class, 'sendWalletLedgerEmail']);
    Route::post('/emails/send-supplier', [EmailController::class, 'sendSupplierEmail']);
    Route::post('/emails/send-invoice', [EmailController::class, 'sendInvoiceEmail']);
    Route::post('/emails/send-customer', [EmailController::class, 'sendCustomerEmail']);
    Route::post('/emails/send-purchase-order', [EmailController::class, 'sendPurchaseOrderEmail']);
    Route::post('/emails/send-customer-details', [EmailController::class, 'sendCustomerDetailsEmail']);

    // Company Reports
    Route::get('/reports/product-margins', [ProductController::class, 'productMargins']);
    Route::get('/reports/sales-summary', [SaleController::class, 'salesSummary']);
    Route::get('/reports/profit-loss', [SaleController::class, 'profitLossReport']);
    Route::get('/reports/business-dashboard', [DashboardController::class, 'businessSummary']);
    Route::get('/reports/payment-transactions', [\App\Http\Controllers\API\PaymentTransactionsReportController::class, 'index']);
});
