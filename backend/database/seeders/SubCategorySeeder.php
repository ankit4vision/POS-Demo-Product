<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SubCategory;

class SubCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        SubCategory::insert([
            ['category_id' => 1, 'name' => 'Mobile Phones', 'status' => 'active'],
            ['category_id' => 1, 'name' => 'Laptops', 'status' => 'active'],
            ['category_id' => 2, 'name' => 'Chairs', 'status' => 'inactive'],
            // Fruits & Vegetables (category_id: 4)
            ['category_id' => 4, 'name' => 'Fresh Fruits', 'status' => 'active'],
            ['category_id' => 4, 'name' => 'Leafy Greens', 'status' => 'active'],
            ['category_id' => 4, 'name' => 'Root Vegetables', 'status' => 'active'],
            // Dairy (category_id: 5)
            ['category_id' => 5, 'name' => 'Milk', 'status' => 'active'],
            ['category_id' => 5, 'name' => 'Cheese', 'status' => 'active'],
            ['category_id' => 5, 'name' => 'Butter & Ghee', 'status' => 'active'],
            // Bakery (category_id: 6)
            ['category_id' => 6, 'name' => 'Breads', 'status' => 'active'],
            ['category_id' => 6, 'name' => 'Cakes & Pastries', 'status' => 'active'],
            // Beverages (category_id: 7)
            ['category_id' => 7, 'name' => 'Juices', 'status' => 'active'],
            ['category_id' => 7, 'name' => 'Soft Drinks', 'status' => 'active'],
            // Snacks (category_id: 8)
            ['category_id' => 8, 'name' => 'Chips', 'status' => 'active'],
            ['category_id' => 8, 'name' => 'Biscuits', 'status' => 'active'],
            // Personal Care (category_id: 9)
            ['category_id' => 9, 'name' => 'Oral Care', 'status' => 'active'],
            ['category_id' => 9, 'name' => 'Hair Care', 'status' => 'active'],
            // Household (category_id: 10)
            ['category_id' => 10, 'name' => 'Cleaning Supplies', 'status' => 'active'],
            ['category_id' => 10, 'name' => 'Laundry', 'status' => 'active'],
            // Staples (category_id: 11)
            ['category_id' => 11, 'name' => 'Rice', 'status' => 'active'],
            ['category_id' => 11, 'name' => 'Pulses', 'status' => 'active'],
        ]);
    }
}
