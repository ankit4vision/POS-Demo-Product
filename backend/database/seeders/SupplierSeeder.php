<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'ABC Electronics Ltd.',
                'email' => 'info@abcelectronics.com',
                'phone' => '+91-9876543210',
                'address' => '123 Tech Park, Bangalore, Karnataka',
                'contact_person' => 'Rajesh Kumar',
                'status' => 'active',
            ],
            [
                'name' => 'XYZ Pharmaceuticals',
                'email' => 'sales@xyzpharma.com',
                'phone' => '+91-9876543211',
                'address' => '456 Medical Zone, Mumbai, Maharashtra',
                'contact_person' => 'Dr. Priya Sharma',
                'status' => 'active',
            ],
            [
                'name' => 'Fresh Foods Supply Co.',
                'email' => 'orders@freshfoods.com',
                'phone' => '+91-9876543212',
                'address' => '789 Food Court, Delhi, NCR',
                'contact_person' => 'Amit Patel',
                'status' => 'active',
            ],
            [
                'name' => 'Quality Stationery',
                'email' => 'info@qualitystationery.com',
                'phone' => '+91-9876543213',
                'address' => '321 Office Plaza, Chennai, Tamil Nadu',
                'contact_person' => 'Suresh Reddy',
                'status' => 'active',
            ],
            [
                'name' => 'Home Decor Solutions',
                'email' => 'contact@homedecor.com',
                'phone' => '+91-9876543214',
                'address' => '654 Design Street, Hyderabad, Telangana',
                'contact_person' => 'Meera Singh',
                'status' => 'inactive',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
} 