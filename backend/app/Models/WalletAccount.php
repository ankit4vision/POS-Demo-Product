<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'party_type',
        'party_id',
        'current_balance',
    ];

    protected $casts = [
        'current_balance' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function party()
    {
        return $this->belongsTo(Customer::class, 'party_id');
    }

    public function transactions()
    {
        return $this->hasMany(WalletTransaction::class, 'wallet_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'party_id');
    }

    // Methods
    public function addTransaction($type, $amount, $description = null, $paymentMethod = null, $reference = null, $invoiceId = null)
    {
        // Create transaction
        $transaction = $this->transactions()->create([
            'type' => $type,
            'amount' => $amount,
            'description' => $description,
            'payment_method' => $paymentMethod,
            'reference' => $reference,
            'invoice_id' => $invoiceId, // Will be null since Invoice model doesn't exist yet
        ]);

        // Update balance
        if ($type === 'credit') {
            $this->current_balance += $amount;
        } else {
            $this->current_balance -= $amount;
        }
        
        $this->save();

        return $transaction;
    }

    public function getBalanceStatusAttribute()
    {
        if ($this->current_balance > 0) {
            return 'credit'; // जमा
        } elseif ($this->current_balance < 0) {
            return 'debit'; // उधार
        }
        return 'zero';
    }

    public function getBalanceTextAttribute()
    {
        if ($this->current_balance > 0) {
            return "जमा ₹" . number_format($this->current_balance, 2);
        } elseif ($this->current_balance < 0) {
            return "उधार ₹" . number_format(abs($this->current_balance), 2);
        }
        return "शून्य";
    }

    public function recalculateCurrentBalance()
    {
        $balance = 0;
        foreach ($this->transactions as $transaction) {
            $balance += $transaction->type === 'credit'
                ? $transaction->amount
                : -$transaction->amount;
        }
        $this->current_balance = $balance;
        $this->save();
    }

    // Scopes
    public function scopeByPartyType($query, $partyType)
    {
        return $query->where('party_type', $partyType);
    }

    public function scopeByParty($query, $partyId)
    {
        return $query->where('party_id', $partyId);
    }
} 