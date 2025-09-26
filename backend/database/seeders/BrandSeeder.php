<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Brand;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Brand::insert([
            ['name' => 'Sony', 'status' => 'active'],
            ['name' => 'Samsung', 'status' => 'active'],
            ['name' => 'Ikea', 'status' => 'inactive'],
            ['name' => 'Amul', 'status' => 'active'],
            ['name' => 'Mother Dairy', 'status' => 'active'],
            ['name' => 'Britannia', 'status' => 'active'],
            ['name' => 'Parle', 'status' => 'active'],
            ['name' => 'Dabur', 'status' => 'active'],
            ['name' => 'Haldiram', 'status' => 'active'],
            ['name' => 'Tata', 'status' => 'active'],
            ['name' => 'Nestle', 'status' => 'active'],
            ['name' => 'Pepsi', 'status' => 'active'],
            ['name' => 'Coca Cola', 'status' => 'active'],
        ]);
    }
}
