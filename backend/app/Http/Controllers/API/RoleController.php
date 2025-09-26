<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();
        $allPermissions = Permission::active()->get();
        // Ensure Admin always has all permissions
        foreach ($roles as $role) {
            if (strtolower($role->name) === 'admin') {
                $role->setRelation('permissions', $allPermissions);
            }
        }
        return response()->json(['data' => $roles], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role = Role::create($request->all());
        return response()->json(['data' => $role], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Role $role)
    {
        if ($role->is_deleted) {
            return response()->json(['message' => 'Role not found'], 404);
        }
        
        $role->load('permissions');
        if (strtolower($role->name) === 'admin') {
            $role->setRelation('permissions', Permission::active()->get());
        }
        return response()->json(['data' => $role], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Role $role)
    {
        if ($role->is_deleted) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role->update($request->all());
        return response()->json(['data' => $role->load('permissions')], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Role $role)
    {
        if ($role->is_deleted) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        // Prevent deletion of admin role
        if (strtolower($role->name) === 'admin') {
            return response()->json(['message' => 'Cannot delete admin role'], 403);
        }

        // Soft delete the role
        $role->softDelete();
        
        // Remove role-permission relationships
        $role->permissions()->detach();
        
        return response()->json(['message' => 'Role deleted successfully'], 200);
    }

    /**
     * Toggle role active status
     */
    public function toggleActive(Role $role)
    {
        if ($role->is_deleted) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        // Prevent deactivating admin role
        if (strtolower($role->name) === 'admin') {
            return response()->json(['message' => 'Cannot deactivate admin role'], 403);
        }

        $role->toggleActive();
        return response()->json(['data' => $role, 'message' => 'Role status updated'], 200);
    }

    /**
     * Restore a soft deleted role
     */
    public function restore(Role $role)
    {
        if (!$role->is_deleted) {
            return response()->json(['message' => 'Role is not deleted'], 400);
        }

        $role->restore();
        return response()->json(['data' => $role, 'message' => 'Role restored successfully'], 200);
    }

    public function updatePermissions(Request $request, Role $role)
    {
        if ($role->is_deleted) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        if (strtolower($role->name) === 'admin') {
            return response()->json(['message' => 'Admin role always has all permissions and cannot be changed.'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role->permissions()->sync($request->permissions);
        return response()->json(['data' => $role->load('permissions')], 200);
    }
}
