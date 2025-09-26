<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::dropIfExists('purchase_items');
        Schema::dropIfExists('purchases');
    }

    public function down()
    {
        // Optionally, you can recreate the tables here if you want to support rollback
    }
}; 