<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'type',
        'amount',
        'description',
        'payment_method',
        'reference',
        'is_editable',
        'invoice_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_editable' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function walletAccount()
    {
        return $this->belongsTo(WalletAccount::class, 'wallet_id');
    }

    public function party()
    {
        return $this->hasOneThrough(
            Customer::class,
            WalletAccount::class,
            'id', // Foreign key on wallet_accounts table
            'id', // Foreign key on customers table
            'wallet_id', // Local key on wallet_transactions table
            'party_id' // Local key on wallet_accounts table
        );
    }

    public function invoice()
    {
        // return $this->belongsTo(Invoice::class);
        return null; // Invoice model not implemented yet
    }

    // Alias for snake_case relationship access
    public function wallet_account()
    {
        return $this->walletAccount();
    }

    // Accessors
    public function getTypeTextAttribute()
    {
        return $this->type === 'credit' ? 'जमा' : 'उधार';
    }

    public function getTypeColorAttribute()
    {
        return $this->type === 'credit' ? 'success' : 'danger';
    }

    public function getFormattedAmountAttribute()
    {
        return '₹' . number_format($this->amount, 2);
    }

    public function getRunningBalanceAttribute()
    {
        // Calculate running balance up to this transaction
        $balance = 0;
        if (!$this->walletAccount) {
            return 0;
        }
        $transactions = $this->walletAccount->transactions()
            ->where('created_at', '<=', $this->created_at)
            ->orderBy('created_at')
            ->get();

        foreach ($transactions as $transaction) {
            if ($transaction->type === 'credit') {
                $balance += $transaction->amount;
            } else {
                $balance -= $transaction->amount;
            }
        }

        return $balance;
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeCredits($query)
    {
        return $query->where('type', 'credit');
    }

    public function scopeDebits($query)
    {
        return $query->where('type', 'debit');
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    public function scopeByWallet($query, $walletAccountId)
    {
        return $query->where('wallet_id', $walletAccountId);
    }

    // Methods for editing and deleting transactions
    public function canEdit()
    {
        return $this->is_editable;
    }

    public function canDelete()
    {
        return $this->is_editable;
    }

    public function updateTransaction($data)
    {
        if (!$this->canEdit()) {
            throw new \Exception('This transaction cannot be edited');
        }

        $oldAmount = $this->amount;
        $oldType = $this->type;

        // Update the transaction
        $this->update($data);

        // Recalculate wallet balance
        $walletAccount = $this->walletAccount;
        if (!$walletAccount) {
            throw new \Exception('No wallet account associated with this transaction');
        }
        // First, reverse the old transaction
        if ($oldType === 'credit') {
            $walletAccount->current_balance -= $oldAmount;
        } else {
            $walletAccount->current_balance += $oldAmount;
        }

        // Then apply the new transaction
        if ($this->type === 'credit') {
            $walletAccount->current_balance += $this->amount;
        } else {
            $walletAccount->current_balance -= $this->amount;
        }

        $walletAccount->save();

        return $this;
    }

    public function deleteTransaction()
    {
        if (!$this->canDelete()) {
            throw new \Exception('This transaction cannot be deleted');
        }

        $walletAccount = $this->walletAccount;

        // Reverse the transaction effect on balance
        if ($this->type === 'credit') {
            $walletAccount->current_balance -= $this->amount;
        } else {
            $walletAccount->current_balance += $this->amount;
        }

        $walletAccount->save();

        // Delete the transaction
        $this->delete();

        return true;
    }
} 