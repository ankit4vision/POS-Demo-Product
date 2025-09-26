<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => 'admin123',
                'role' => 'admin'
            ],
            [
                'name' => 'Manager User',
                'email' => 'manager@example.com',
                'password' => 'manager123',
                'role' => 'manager'
            ],
            [
                'name' => 'Staff User',
                'email' => 'staff@example.com',
                'password' => 'staff123',
                'role' => 'staff'
            ],
            [
                'name' => 'Accountant User',
                'email' => 'accountant@example.com',
                'password' => 'accountant123',
                'role' => 'accountant'
            ]
        ];

        foreach ($users as $userData) {
            if (!User::where('email', $userData['email'])->exists()) {
                $user = User::create([
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'password' => Hash::make($userData['password']),
                ]);

                // Assign role to user
                $role = Role::where('name', $userData['role'])->first();
                if ($role) {
                    $user->roles()->attach($role->id);
                }
            }
        }
    }
}
