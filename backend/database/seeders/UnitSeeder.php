<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Unit::insert([
            ['name' => 'Piece', 'status' => 'active'],
            ['name' => 'Box', 'status' => 'active'],
            ['name' => 'Kg', 'status' => 'active'],
            ['name' => 'Gram', 'status' => 'active'],
            ['name' => 'Litre', 'status' => 'active'],
            ['name' => 'Millilitre', 'status' => 'active'],
            ['name' => 'Packet', 'status' => 'active'],
            ['name' => 'Dozen', 'status' => 'active'],
        ]);
    }
}
