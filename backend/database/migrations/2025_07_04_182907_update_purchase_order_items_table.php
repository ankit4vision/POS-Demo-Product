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
    public function up(): void
    {
        Schema::table('purchase_order_items', function (Blueprint $table) {
            // Remove unnecessary fields
            $table->dropColumn(['received_quantity', 'tax_percent', 'discount_percent']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('purchase_order_items', function (Blueprint $table) {
            // Add back the removed fields
            $table->decimal('received_quantity', 10, 2)->default(0);
            $table->decimal('tax_percent', 5, 2)->default(0);
            $table->decimal('discount_percent', 5, 2)->default(0);
        });
    }
};
