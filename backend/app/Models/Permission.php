<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'module',
        'submodule',
        'type',
        'is_active',
        'is_deleted',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_deleted' => 'boolean',
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permission');
    }

    // Scope for active permissions
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('is_deleted', false);
    }

    // Scope for non-deleted permissions
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
