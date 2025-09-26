<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'status',
        'first_name',
        'last_name',
        'address',
        'city',
        'country',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'status' => 'boolean',
        // 'password' => 'hashed', // Removed for compatibility
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }

    public function hasRole($role)
    {
        return $this->roles()->where('name', $role)->exists();
    }

    public function hasPermission($permission)
    {
        // Admin role has all permissions
        if ($this->hasRole('admin')) {
            return true;
        }
        
        return $this->roles()->whereHas('permissions', function ($query) use ($permission) {
            $query->where('name', $permission);
        })->exists();
    }

    public function getAllPermissions()
    {
        // Admin role has all permissions
        if ($this->hasRole('admin')) {
            return \App\Models\Permission::active()->get();
        }
        
        return $this->roles()->with('permissions')->get()->flatMap(function ($role) {
            return $role->permissions;
        })->unique('id');
    }

    public function getPermissionsByModule($module)
    {
        // Admin role has all permissions
        if ($this->hasRole('admin')) {
            return \App\Models\Permission::active()->where('module', $module)->get();
        }
        
        return $this->roles()->whereHas('permissions', function ($query) use ($module) {
            $query->where('module', $module);
        })->with(['permissions' => function ($query) use ($module) {
            $query->where('module', $module);
        }])->get()->flatMap(function ($role) {
            return $role->permissions;
        })->unique('id');
    }

    public function hasAnyPermission($permissions)
    {
        // Admin role has all permissions
        if ($this->hasRole('admin')) {
            return true;
        }
        
        if (!is_array($permissions)) {
            $permissions = [$permissions];
        }
        
        return $this->roles()->whereHas('permissions', function ($query) use ($permissions) {
            $query->whereIn('name', $permissions);
        })->exists();
    }

    public function hasAllPermissions($permissions)
    {
        // Admin role has all permissions
        if ($this->hasRole('admin')) {
            return true;
        }
        
        if (!is_array($permissions)) {
            $permissions = [$permissions];
        }
        
        $userPermissions = $this->getAllPermissions()->pluck('name')->toArray();
        return count(array_intersect($permissions, $userPermissions)) === count($permissions);
    }
}
