<?php

require_once 'vendor/autoload.php';

use App\Models\Customer;
use App\Models\WalletAccount;
use App\Models\WalletTransaction;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Fixing wallet accounts...\n";

// Get all customers
$customers = Customer::all();

foreach ($customers as $customer) {
    echo "Processing customer: {$customer->name} (ID: {$customer->id})\n";
    
    // Check if wallet account exists
    $walletAccount = WalletAccount::where('party_id', $customer->id)
                                 ->where('party_type', $customer->type)
                                 ->first();
    
    if (!$walletAccount) {
        echo "  - Creating wallet account...\n";
        $walletAccount = WalletAccount::create([
            'party_type' => $customer->type,
            'party_id' => $customer->id,
            'current_balance' => 0,
        ]);
        echo "  - Wallet account created with ID: {$walletAccount->id}\n";
    } else {
        echo "  - Wallet account already exists (ID: {$walletAccount->id})\n";
    }
    
    // Calculate actual balance from transactions
    $balance = 0;
    $transactions = $walletAccount->transactions()->orderBy('created_at')->get();
    
    foreach ($transactions as $transaction) {
        if ($transaction->type === 'credit') {
            $balance += $transaction->amount;
        } else {
            $balance -= $transaction->amount;
        }
    }
    
    // Update wallet account balance
    $walletAccount->update(['current_balance' => $balance]);
    echo "  - Updated balance to: {$balance}\n";
    
    // Test the customer's balance calculation
    $customer->load('walletAccount.transactions');
    $customer->append(['current_balance', 'balance_status', 'balance_text']);
    
    echo "  - Customer balance: {$customer->current_balance}\n";
    echo "  - Balance status: {$customer->balance_status}\n";
    echo "  - Balance text: {$customer->balance_text}\n";
    echo "\n";
}

echo "Wallet accounts fixed!\n"; 