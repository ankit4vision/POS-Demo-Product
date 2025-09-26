<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Product::insert([
            [
                'name' => 'Apple',
                'sku' => 'FRU-APL-001',
                'barcode' => '100000000001',
                'category_id' => 4, // Fruits & Vegetables
                'sub_category_id' => 4, // Fresh Fruits
                'brand_id' => 10, // Tata
                'unit_id' => 3, // Kg
                'purchase_price' => 80.00,
                'sales_price' => 100.00,
                'retailer_sales_price' => 95.00,
                'individual_sales_price' => 105.00,
                'last_purchase_price' => 80.00,
                'vat_percent' => 0,
                'opening_stock' => 50,
                'low_stock_alert' => 10,
                'description' => 'Fresh apples',
                'status' => 'active',
                'discount' => 0,
            ],
            [
                'name' => 'Amul Milk',
                'sku' => 'DAI-AML-001',
                'barcode' => '100000000002',
                'category_id' => 5, // Dairy
                'sub_category_id' => 7, // Milk
                'brand_id' => 4, // Amul
                'unit_id' => 5, // Litre
                'purchase_price' => 45.00,
                'sales_price' => 50.00,
                'retailer_sales_price' => 48.00,
                'individual_sales_price' => 52.00,
                'last_purchase_price' => 45.00,
                'vat_percent' => 0,
                'opening_stock' => 100,
                'low_stock_alert' => 20,
                'description' => 'Amul full cream milk',
                'status' => 'active',
                'discount' => 0,
            ],
            [
                'name' => 'Britannia Bread',
                'sku' => 'BAK-BRI-001',
                'barcode' => '100000000003',
                'category_id' => 6, // Bakery
                'sub_category_id' => 10, // Breads
                'brand_id' => 6, // Britannia
                'unit_id' => 7, // Packet
                'purchase_price' => 20.00,
                'sales_price' => 25.00,
                'retailer_sales_price' => 24.00,
                'individual_sales_price' => 26.00,
                'last_purchase_price' => 20.00,
                'vat_percent' => 0,
                'opening_stock' => 40,
                'low_stock_alert' => 10,
                'description' => 'Fresh white bread',
                'status' => 'active',
                'discount' => 0,
            ],
            [
                'name' => 'Pepsi Soft Drink',
                'sku' => 'BEV-PEP-001',
                'barcode' => '100000000004',
                'category_id' => 7, // Beverages
                'sub_category_id' => 14, // Soft Drinks
                'brand_id' => 12, // Pepsi
                'unit_id' => 6, // Millilitre
                'purchase_price' => 30.00,
                'sales_price' => 35.00,
                'retailer_sales_price' => 34.00,
                'individual_sales_price' => 36.00,
                'last_purchase_price' => 30.00,
                'vat_percent' => 0,
                'opening_stock' => 60,
                'low_stock_alert' => 15,
                'description' => 'Pepsi 500ml bottle',
                'status' => 'active',
                'discount' => 0,
            ],
            [
                'name' => 'Parle-G Biscuits',
                'sku' => 'SNA-PAR-001',
                'barcode' => '100000000005',
                'category_id' => 8, // Snacks
                'sub_category_id' => 17, // Biscuits
                'brand_id' => 7, // Parle
                'unit_id' => 7, // Packet
                'purchase_price' => 5.00,
                'sales_price' => 7.00,
                'retailer_sales_price' => 6.50,
                'individual_sales_price' => 7.50,
                'last_purchase_price' => 5.00,
                'vat_percent' => 0,
                'opening_stock' => 200,
                'low_stock_alert' => 30,
                'description' => 'Parle-G glucose biscuits',
                'status' => 'active',
                'discount' => 0,
            ],
        ]);
    }
} 