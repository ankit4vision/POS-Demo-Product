<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->string('barcode')->nullable();
            $table->string('image')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('sub_category_id')->nullable()->constrained('sub_categories')->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained('brands')->nullOnDelete();
            $table->foreignId('unit_id')->nullable()->constrained('units')->nullOnDelete();
            $table->decimal('purchase_price', 10, 2)->default(0);
            $table->decimal('sales_price', 10, 2)->default(0);
            $table->decimal('retailer_sales_price', 10, 2)->default(0);
            $table->decimal('individual_sales_price', 10, 2)->default(0);
            $table->decimal('last_purchase_price', 10, 2)->nullable();
            $table->decimal('vat_percent', 5, 2)->nullable();
            $table->decimal('opening_stock', 10, 2)->nullable();
            $table->decimal('low_stock_alert', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
}; 