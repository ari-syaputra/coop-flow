<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_id')->constrained('cooperatives')->onDelete('cascade');
            $table->foreignId('fertilizer_id')->constrained('fertilizers')->onDelete('cascade');
            
            // Hasil Prediksi
            $table->decimal('suggested_procurement_kg', 12, 2)->default(0);
            $table->integer('suggested_procurement_bags')->default(0);
            $table->string('status_saran')->default('DRAFT'); 
            
            // Meta Snapshot saat prediksi terjadi
            $table->json('analysis_meta');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_predictions');
    }
};