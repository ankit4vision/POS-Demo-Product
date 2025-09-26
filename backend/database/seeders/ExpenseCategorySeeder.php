<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ExpenseCategory;

class ExpenseCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ExpenseCategory::insert([
            ['name' => 'Travel', 'status' => 'active'],
            ['name' => 'Office Supplies', 'status' => 'active'],
            ['name' => 'Utilities', 'status' => 'inactive'],
        ]);
    }
}
