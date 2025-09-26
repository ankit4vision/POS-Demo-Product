<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
    }
};
