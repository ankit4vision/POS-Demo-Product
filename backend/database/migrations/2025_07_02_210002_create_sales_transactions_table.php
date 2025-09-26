<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sales_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sale_id');
            $table->string('payment_type', 20); // cash, card, upi, wallet, etc.
            $table->decimal('amount', 10, 2);
            $table->string('description')->nullable();
            $table->timestamps();
            $table->foreign('sale_id')->references('id')->on('sales')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sales_transactions');
    }
}; 