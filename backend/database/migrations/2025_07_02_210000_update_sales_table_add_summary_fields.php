<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->renameColumn('total', 'grand_total');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('total_discount', 10, 2)->default(0);
            $table->decimal('total_tax', 10, 2)->default(0);
            $table->decimal('round_off', 10, 2)->default(0);
            $table->decimal('rounded_total', 10, 2)->default(0);
        });
    }

    public function down()
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->renameColumn('grand_total', 'total');
            $table->dropColumn(['subtotal', 'total_discount', 'total_tax', 'round_off', 'rounded_total']);
        });
    }
}; 