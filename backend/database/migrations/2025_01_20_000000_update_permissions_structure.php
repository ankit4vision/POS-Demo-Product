<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Add soft delete columns to permissions table
        Schema::table('permissions', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('type');
            $table->boolean('is_deleted')->default(false)->after('is_active');
        });

        // Add soft delete columns to roles table
        Schema::table('roles', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('description');
            $table->boolean('is_deleted')->default(false)->after('is_active');
        });

        // First, clear existing role_permission relationships
        DB::table('role_permission')->truncate();
        
        // Then delete existing permissions
        DB::table('permissions')->delete();
        
        // Reset auto increment
        DB::statement('ALTER TABLE permissions AUTO_INCREMENT = 1');
        
        // Define the new modules and their permissions
        $modules = [
            ['module' => 'Dashboard', 'submodule' => 'Dashboard'],
            ['module' => 'User', 'submodule' => 'User'],
            ['module' => 'Product', 'submodule' => 'Product'],
            ['module' => 'Customer', 'submodule' => 'Customer'],
            ['module' => 'Supplier', 'submodule' => 'Supplier'],
            ['module' => 'Purchase Order', 'submodule' => 'PurchaseOrder'],
            ['module' => 'Purchased Order', 'submodule' => 'PurchasedOrder'],
            ['module' => 'POS', 'submodule' => 'POS'],
            ['module' => 'Sale', 'submodule' => 'Sale'],
            ['module' => 'Master', 'submodule' => 'Master'],
            ['module' => 'Employee', 'submodule' => 'Employee'],
            ['module' => 'Expense', 'submodule' => 'Expense'],
            ['module' => 'Setting', 'submodule' => 'Setting'],
            ['module' => 'Email', 'submodule' => 'Email'],
            ['module' => 'Payment', 'submodule' => 'Payment'],
        ];
        
        $types = ['create', 'edit', 'delete', 'view'];
        
        $permissions = [];
        $id = 1;
        
        foreach ($modules as $mod) {
            foreach ($types as $type) {
                $permissions[] = [
                    'id' => $id,
                    'name' => $type . '_' . strtolower($mod['submodule']),
                    'description' => ucfirst($type) . ' permission for ' . $mod['submodule'],
                    'module' => $mod['module'],
                    'submodule' => $mod['submodule'],
                    'type' => $type,
                    'is_active' => true,
                    'is_deleted' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $id++;
            }
        }
        
        // Insert new permissions
        DB::table('permissions')->insert($permissions);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Remove soft delete columns from permissions table
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropColumn(['is_active', 'is_deleted']);
        });

        // Remove soft delete columns from roles table
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn(['is_active', 'is_deleted']);
        });

        // Clear role_permission relationships
        DB::table('role_permission')->truncate();
        
        // Clear all permissions
        DB::table('permissions')->delete();
        
        // Reset auto increment
        DB::statement('ALTER TABLE permissions AUTO_INCREMENT = 1');
        
        // Re-insert original permissions (you can restore from backup if needed)
        $originalModules = [
            ['module' => 'Dashboard', 'submodule' => 'Dashboard'],
            ['module' => 'Customer', 'submodule' => 'Customer'],
            ['module' => 'Vendor', 'submodule' => 'Vendor'],
            ['module' => 'Ledger', 'submodule' => 'Ledger'],
            ['module' => 'Products Or Services', 'submodule' => 'ProductsOrServices'],
            ['module' => 'Category', 'submodule' => 'Category'],
            ['module' => 'Unit', 'submodule' => 'Unit'],
            ['module' => 'Inventory', 'submodule' => 'Inventory'],
            ['module' => 'Invoice', 'submodule' => 'Invoice'],
            ['module' => 'Salesreturn', 'submodule' => 'Salesreturn'],
            ['module' => 'Purchase', 'submodule' => 'Purchase'],
            ['module' => 'Purchase Order', 'submodule' => 'PurchaseOrder'],
            ['module' => 'Purchasereturn', 'submodule' => 'Purchasereturn'],
            ['module' => 'Expense', 'submodule' => 'Expense'],
            ['module' => 'Payment', 'submodule' => 'Payment'],
            ['module' => 'Quotation', 'submodule' => 'Quotation'],
            ['module' => 'Delivery Challan', 'submodule' => 'DeliveryChallan'],
            ['module' => 'Payment Summary Report', 'submodule' => 'PaymentSummaryReport'],
            ['module' => 'User', 'submodule' => 'User'],
        ];
        
        $types = ['create', 'edit', 'delete', 'view'];
        $permissions = [];
        $id = 1;
        
        foreach ($originalModules as $mod) {
            foreach ($types as $type) {
                $permissions[] = [
                    'id' => $id,
                    'name' => $type . '_' . strtolower($mod['submodule']),
                    'description' => ucfirst($type) . ' permission for ' . $mod['submodule'],
                    'module' => $mod['module'],
                    'submodule' => $mod['submodule'],
                    'type' => $type,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $id++;
            }
        }
        
        DB::table('permissions')->insert($permissions);
    }
}; 