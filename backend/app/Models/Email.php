<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
    use HasFactory;

    protected $fillable = [
        'to_email',
        'from_email',
        'type',
        'subject',
        'body',
        'send_status',
        'response_message',
        'related_id',
        'related_type',
        'sent_at'
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the related model based on related_type and related_id
     */
    public function related()
    {
        return $this->morphTo();
    }

    /**
     * Scope a query to only include sent emails
     */
    public function scopeSent($query)
    {
        return $query->where('send_status', 'sent');
    }

    /**
     * Scope a query to only include failed emails
     */
    public function scopeFailed($query)
    {
        return $query->where('send_status', 'failed');
    }

    /**
     * Scope a query to filter by email type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}
