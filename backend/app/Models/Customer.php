<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'phone',
        'email',
        'gst_number',
        'address',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function walletAccount()
    {
        return $this->hasOne(WalletAccount::class, 'party_id');
    }

    public function walletTransactions()
    {
        return $this->hasManyThrough(
            WalletTransaction::class,
            WalletAccount::class,
            'party_id', // Foreign key on wallet_accounts table
            'wallet_id', // Foreign key on wallet_transactions table
            'id', // Local key on customers table
            'id' // Local key on wallet_accounts table
        )->where('wallet_accounts.party_type', $this->type);
    }

    // Accessors
    public function getCurrentBalanceAttribute()
    {
        // First try to get from loaded relationship
        if ($this->walletAccount) {
            $balance = 0;
            $transactions = $this->walletAccount->transactions()->orderBy('created_at')->get();
            
            foreach ($transactions as $transaction) {
                if ($transaction->type === 'credit') {
                    $balance += $transaction->amount;
                } else {
                    $balance -= $transaction->amount;
                }
            }
            
            return $balance;
        }
        
        // If relationship not loaded, try to find wallet account directly
        $walletAccount = WalletAccount::where('party_id', $this->id)
                                    ->where('party_type', $this->type)
                                    ->first();
        
        if (!$walletAccount) {
            return 0;
        }
        
        $balance = 0;
        $transactions = $walletAccount->transactions()->orderBy('created_at')->get();
        
        foreach ($transactions as $transaction) {
            if ($transaction->type === 'credit') {
                $balance += $transaction->amount;
            } else {
                $balance -= $transaction->amount;
            }
        }
        
        return $balance;
    }

    public function getBalanceStatusAttribute()
    {
        $balance = $this->current_balance;
        if ($balance > 0) {
            return 'credit'; // जमा - Customer has credit
        } elseif ($balance < 0) {
            return 'debit'; // उधार - Customer owes money
        }
        return 'zero';
    }

    public function getBalanceTextAttribute()
    {
        $balance = $this->current_balance;
        if ($balance > 0) {
            return "जमा ₹" . number_format($balance, 2);
        } elseif ($balance < 0) {
            return "उधार ₹" . number_format(abs($balance), 2);
        }
        return "शून्य";
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeCustomers($query)
    {
        return $query->where('type', 'customer');
    }

    public function scopeRetailers($query)
    {
        return $query->where('type', 'retailer');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('phone', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('gst_number', 'like', "%{$search}%");
        });
    }
} 