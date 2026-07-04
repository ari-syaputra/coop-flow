<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farmers', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Atribut spesifik manajemen tani
            $blueprint->string('farmer_group')->nullable(); 
            $blueprint->string('nik', 16)->unique()->nullable();
            $blueprint->decimal('total_land_area', 8, 2)->default(0.00);
            $blueprint->text('notes')->nullable(); 
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmers');
    }
};