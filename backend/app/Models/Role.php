<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'is_active',
        'is_deleted',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_deleted' => 'boolean',
    ];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_role');
    }

    // Scope for active roles
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('is_deleted', false);
    }

    // Scope for non-deleted roles
    public function scopeNotDeleted($query)
    {
        return $query->where('is_deleted', false);
    }

    // Soft delete method
    public function softDelete()
    {
        $this->update(['is_deleted' => true]);
    }

    // Restore method
    public function restore()
    {
        $this->update(['is_deleted' => false]);
    }

    // Toggle active status
    public function toggleActive()
    {
        $this->update(['is_active' => !$this->is_active]);
    }
} 