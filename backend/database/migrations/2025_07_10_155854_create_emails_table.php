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
        Schema::create('emails', function (Blueprint $table) {
            $table->id();
            $table->string('to_email');
            $table->string('from_email');
            $table->enum('type', ['invoice', 'wallet_ledger', 'supplier_details', 'purchase_order']);
            $table->string('subject', 500);
            $table->longText('body');
            $table->enum('send_status', ['sent', 'failed'])->default('sent');
            $table->text('response_message')->nullable();
            $table->unsignedBigInteger('related_id')->nullable();
            $table->string('related_type', 50)->nullable();
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamps();
            
            // Indexes for better performance
            $table->index('type');
            $table->index('send_status');
            $table->index(['related_type', 'related_id']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emails');
    }
};
