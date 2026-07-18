<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_ml_logs', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke detail item transaksi
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade');
            $table->foreignId('land_id')->constrained('lands')->onDelete('restrict');
            $table->foreignId('fertilizer_id')->constrained('fertilizers')->onDelete('restrict');

            // Fitur Lingkungan & Lahan (Snapshot saat transaksi terjadi)
            $table->double('luas_lahan_hektar');
            $table->string('jenis_komoditas');
            $table->string('fase_tanam_saat_ini');
            $table->double('suhu_rata_rata_celcius');
            $table->integer('kelembapan_persen');
            $table->double('curah_hujan_mm');

            // Data Rekomendasi vs Realisasi
            $table->double('original_recommended_kg'); 
            $table->double('actual_purchased_kg');    
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_ml_logs');
    }
};