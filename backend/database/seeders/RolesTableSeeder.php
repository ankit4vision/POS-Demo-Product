<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [
            [
                'name' => 'Admin',
                'description' => 'Administrator role with full access',
            ],
            [
                'name' => 'Manager',
                'description' => 'Manager role with elevated access',
            ],
            [
                'name' => 'Editor',
                'description' => 'Editor role with content management access',
            ],
            [
                'name' => 'User',
                'description' => 'Regular user role',
            ],
            [
                'name' => 'Guest',
                'description' => 'Guest role with limited access',
            ],
            [
                'name' => 'Support',
                'description' => 'Support role for customer service',
            ],
            [
                'name' => 'Developer',
                'description' => 'Developer role for technical access',
            ],
            [
                'name' => 'Tester',
                'description' => 'Tester role for quality assurance',
            ],
            [
                'name' => 'Analyst',
                'description' => 'Analyst role for data analysis',
            ],
            [
                'name' => 'Designer',
                'description' => 'Designer role for UI/UX access',
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
