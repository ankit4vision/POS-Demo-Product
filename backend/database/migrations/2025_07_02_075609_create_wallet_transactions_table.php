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
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('wallet_id');
            $table->string('type', 20); // debit/credit
            $table->decimal('amount', 10, 2);
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->timestamps();

            $table->foreign('wallet_id')->references('id')->on('wallet_accounts')->onDelete('cascade');
            $table->foreign('invoice_id')->references('id')->on('sales')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
