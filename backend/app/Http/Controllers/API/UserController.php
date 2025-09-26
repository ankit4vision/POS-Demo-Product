<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%")
                  ->orWhere('first_name', 'LIKE', "%{$search}%")
                  ->orWhere('last_name', 'LIKE', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role_id')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('roles.id', $request->role_id);
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json($users, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:50|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20|regex:/^[\+]?[1-9][\d]{0,15}$/',
            'role_id' => 'required|exists:roles,id',
            'password' => 'required|string|min:4|confirmed',
            'status' => 'boolean',
            'first_name' => 'nullable|string|max:50',
            'last_name' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:500',
        ], [
            'name.regex' => 'The name field can only contain letters and spaces.',
            'phone.regex' => 'Please enter a valid phone number.',
            'password.confirmed' => 'Password confirmation does not match.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = User::create([
                'name' => trim($request->name),
                'email' => strtolower(trim($request->email)),
                'phone' => $request->phone ? trim($request->phone) : null,
                'password' => Hash::make($request->password),
                'status' => $request->status ?? true,
                'first_name' => $request->first_name ? trim($request->first_name) : null,
                'last_name' => $request->last_name ? trim($request->last_name) : null,
                'address' => $request->address ? trim($request->address) : null,
                'city' => $request->city ? trim($request->city) : null,
                'country' => $request->country ? trim($request->country) : null,
                'bio' => $request->bio ? trim($request->bio) : null,
            ]);

            $user->roles()->attach($request->role_id);

            return response()->json([
                'data' => $user->load('roles'),
                'message' => 'User created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(User $user)
    {
        return response()->json(['data' => $user->load('roles')], 200);
    }

    public function update(Request $request, User $user)
    {
        $rules = [
            'name' => 'required|string|min:2|max:50|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20|regex:/^[\+]?[1-9][\d]{0,15}$/',
            'role_id' => 'required|exists:roles,id',
            'status' => 'boolean',
            'first_name' => 'nullable|string|max:50',
            'last_name' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:500',
        ];

        $messages = [
            'name.regex' => 'The name field can only contain letters and spaces.',
            'phone.regex' => 'Please enter a valid phone number.',
        ];

        // Add password validation if password is provided
        if ($request->filled('password')) {
            $rules['password'] = 'required|string|min:4|confirmed';
            $messages['password.confirmed'] = 'Password confirmation does not match.';
        }

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $updateData = [
                'name' => trim($request->name),
                'email' => strtolower(trim($request->email)),
                'phone' => $request->phone ? trim($request->phone) : null,
                'status' => $request->status,
                'first_name' => $request->first_name ? trim($request->first_name) : null,
                'last_name' => $request->last_name ? trim($request->last_name) : null,
                'address' => $request->address ? trim($request->address) : null,
                'city' => $request->city ? trim($request->city) : null,
                'country' => $request->country ? trim($request->country) : null,
                'bio' => $request->bio ? trim($request->bio) : null,
            ];

            // Update password if provided
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);
            $user->roles()->sync([$request->role_id]);

            return response()->json([
                'data' => $user->load('roles'),
                'message' => 'User updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(User $user)
    {
        try {
            // Prevent deletion of admin users
            if ($user->hasRole('admin')) {
                return response()->json([
                    'message' => 'Cannot delete admin users.'
                ], 403);
            }

            $user->roles()->detach();
            $user->delete();
            
            return response()->json([
                'message' => 'User deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete user. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function profile(Request $request)
    {
        $user = $request->user();
        return response()->json(['data' => [
            'first_name' => $user->first_name ?? '',
            'last_name' => $user->last_name ?? '',
            'email' => $user->email,
            'phone' => $user->phone ?? '',
            'address' => $user->address ?? '',
            'city' => $user->city ?? '',
            'country' => $user->country ?? '',
            'bio' => $user->bio ?? '',
        ]], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validator = Validator::make($request->all(), [
            'first_name' => 'nullable|string|max:50',
            'last_name' => 'nullable|string|max:50',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:500',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user->update($validator->validated());
        return response()->json(['message' => 'Profile updated successfully!'], 200);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'password' => 'required|string|min:4|confirmed',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['errors' => ['current_password' => ['Current password is incorrect.']]], 422);
        }
        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json(['message' => 'Password updated successfully!'], 200);
    }
} 