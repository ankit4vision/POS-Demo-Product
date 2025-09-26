<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Category::insert([
            ['name' => 'Electronics', 'status' => 'active'],
            ['name' => 'Furniture', 'status' => 'active'],
            ['name' => 'Stationery', 'status' => 'inactive'],
            ['name' => 'Fruits & Vegetables', 'status' => 'active'],
            ['name' => 'Dairy', 'status' => 'active'],
            ['name' => 'Bakery', 'status' => 'active'],
            ['name' => 'Beverages', 'status' => 'active'],
            ['name' => 'Snacks', 'status' => 'active'],
            ['name' => 'Personal Care', 'status' => 'active'],
            ['name' => 'Household', 'status' => 'active'],
            ['name' => 'Staples', 'status' => 'active'],
        ]);
    }
}
