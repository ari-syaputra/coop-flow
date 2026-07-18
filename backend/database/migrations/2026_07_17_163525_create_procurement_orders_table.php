<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('procurement_orders', function (Blueprint $table) {
            $table->id();
            // Hubungan foreign key ke tabel cooperatives Anda sudah tepat
            $table->foreignId('cooperative_id')->constrained('cooperatives')->onDelete('cascade');
            $table->string('po_number')->unique();
            $table->string('periode_pengadaan');
            
            // Perhitungan Agregat Masukan User
            $table->integer('total_items')->default(0);
            $table->integer('total_bags_ordered')->default(0);
            $table->decimal('total_weight_kg', 12, 2)->default(0.00);
            $table->decimal('total_estimated_cost', 15, 2)->default(0.00);

            // STATUS KONTROL MANUSIA (Otoritas Birokrasi Anda)
            $table->enum('status_verifikasi', [
                'DRAFT', 'PENDING_DINAS', 'REJECTED_DINAS', 'PENDING_KEMENKO', 'REJECTED_KEMENKO', 'APPROVED'
            ])->default('DRAFT');

            $table->enum('status_logistik', [
                'NONE',                 // Belum dikirim
                'PROD_LINI_1_2',        // [Klik Kemenko] Sudah jalan dari PT Pupuk Indo (Pusat)
                'GUDANG_LINI_3',        // [Klik Dinas] Dinas konfirmasi pupuk mendarat di Gudang Penyangga Kab
                'SIAP_TEBUS_LINI_4',    // [Klik Dinas] Dinas merilis kuota alokasi agar bisa ditebus
                'SELESAI'               // [Klik Koperasi] Barang diterima fisik di gudang KDMP
            ])->default('NONE');

            // --- PARAMETER INTEGRASI ALGORITMA GIS & ESTIMASI ---
            // Titik Awal Pabrik Pusat Pupuk Indonesia (Jakarta/Cikampek)
            $table->decimal('origin_lat', 10, 8)->default(-6.1195);  
            $table->decimal('origin_lng', 11, 8)->default(106.4095);
            
            // Mengunci koordinat tujuan (disamakan presisi tipenya dengan tabel cooperatives Anda)
            $table->decimal('destination_lat', 10, 8)->nullable();   
            $table->decimal('destination_lng', 11, 8)->nullable();
            
            $table->decimal('gis_distance_km', 8, 2)->default(0.00); // Hasil hitung rumus Haversine
            $table->integer('estimated_travel_hours')->default(0);    // Estimasi jam tempuh truk logistik
            
            // Penanda Waktu Distribusi
            $table->timestamp('dispatched_at')->nullable();           // Terisi saat Kemenko mengubah ke PROD_LINI_1_2
            $table->timestamp('dinas_received_at')->nullable();       // Terisi saat Dinas mengubah ke GUDANG_LINI_3
            $table->timestamp('completed_at')->nullable();            // Terisi saat Koperasi mengubah ke SELESAI

            $table->text('rejection_reason')->nullable();
            $table->text('notes_from_verifier')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procurement_orders');
    }
};