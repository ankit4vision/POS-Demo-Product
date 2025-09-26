<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('sale_items', function (Blueprint $table) {
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('purchase_price', 10, 2)->nullable()->after('tax');
            $table->decimal('last_purchase_price', 10, 2)->nullable()->after('purchase_price');
        });
    }

    public function down()
    {
        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropColumn(['discount', 'tax', 'purchase_price', 'last_purchase_price']);
        });
    }
}; 