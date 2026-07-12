<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cooperatives', function (Blueprint $table) {
            $table->id();
            $table->string('name'); 
            $table->string('cooperative_code')->unique();

            $table->boolean('is_activated')->default(false);
            $table->boolean('is_profile_completed')->default(false); 

            $table->string('address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable(); 
            $table->decimal('longitude', 11, 8)->nullable();
            $table->integer('warehouse_capacity_ton')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cooperatives');
    }
};