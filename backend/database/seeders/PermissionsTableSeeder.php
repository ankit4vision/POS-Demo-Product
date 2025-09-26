<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $usedPermissions = [
            // Dashboard
            'view_dashboard',

            // Product
            'create_product', 'edit_product', 'delete_product', 'view_product',

            // Customer
            'create_customer', 'edit_customer', 'delete_customer', 'view_customer',
            'export_customer', 'print_customer', 'email_customer',

            // Supplier
            'create_supplier', 'edit_supplier', 'delete_supplier', 'view_supplier',

            // Master Data
            'create_master', 'edit_master', 'delete_master', 'view_master',

            // User Management
            'create_user', 'edit_user', 'delete_user', 'view_user',
            'view_role', 'edit_role',

            // POS & Sales
            'create_pos', 'view_pos',
            'view_sale', 'edit_sale', 'delete_sale',

            // Purchase Orders
            'view_purchaseorder', 'create_purchase_order', 'edit_purchase_order', 'delete_purchase_order',
            'view_purchasedorder', 'edit_purchase',

            // Email & Settings
            'create_email', 'view_email', 'view_setting',

            // Expense
            'view_expense', 'create_expense', 'edit_expense', 'delete_expense',

            // Employee
            'view_employee', 'create_employee', 'edit_employee', 'delete_employee',

            // Wallet, Payment, Ledger
            'view_wallet', 'view_payment', 'view_ledger',
        ];

        foreach ($usedPermissions as $perm) {
            Permission::updateOrCreate(
                ['name' => $perm],
                [
                    'description' => ucfirst(str_replace('_', ' ', $perm)),
                    'is_active' => true,
                    'is_deleted' => false,
                ]
            );
        }
    }
}
