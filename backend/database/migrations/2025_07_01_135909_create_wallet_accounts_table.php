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
        Schema::create('wallet_accounts', function (Blueprint $table) {
            $table->id();
            $table->enum('party_type', ['customer', 'retailer']);
            $table->foreignId('party_id')->constrained('customers')->onDelete('cascade');
            $table->decimal('current_balance', 15, 2)->default(0);
            $table->timestamps();
            
            // Ensure one wallet account per party
            $table->unique(['party_type', 'party_id']);
            
            // Indexes for better performance
            $table->index(['party_type', 'party_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_accounts');
    }
}; 