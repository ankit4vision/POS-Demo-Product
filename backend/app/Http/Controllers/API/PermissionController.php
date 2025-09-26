<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $permissions = Permission::active()->get();
        return response()->json(['data' => $permissions], 200);
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
            'name' => 'required|string|max:255|unique:permissions',
            'description' => 'nullable|string',
            'module' => 'required|string|max:255',
            'submodule' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $permission = Permission::create($request->all());
        return response()->json(['data' => $permission], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Permission $permission)
    {
        if ($permission->is_deleted) {
            return response()->json(['message' => 'Permission not found'], 404);
        }
        
        return response()->json(['data' => $permission], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Permission $permission)
    {
        if ($permission->is_deleted) {
            return response()->json(['message' => 'Permission not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'description' => 'nullable|string',
            'module' => 'required|string|max:255',
            'submodule' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $permission->update($request->all());
        return response()->json(['data' => $permission], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Permission $permission)
    {
        if ($permission->is_deleted) {
            return response()->json(['message' => 'Permission not found'], 404);
        }

        // Soft delete the permission
        $permission->softDelete();
        
        // Remove role-permission relationships
        $permission->roles()->detach();
        
        return response()->json(['message' => 'Permission deleted successfully'], 200);
    }

    /**
     * Toggle permission active status
     */
    public function toggleActive(Permission $permission)
    {
        if ($permission->is_deleted) {
            return response()->json(['message' => 'Permission not found'], 404);
        }

        $permission->toggleActive();
        return response()->json(['data' => $permission, 'message' => 'Permission status updated'], 200);
    }

    /**
     * Restore a soft deleted permission
     */
    public function restore(Permission $permission)
    {
        if (!$permission->is_deleted) {
            return response()->json(['message' => 'Permission is not deleted'], 400);
        }

        $permission->restore();
        return response()->json(['data' => $permission, 'message' => 'Permission restored successfully'], 200);
    }
}
