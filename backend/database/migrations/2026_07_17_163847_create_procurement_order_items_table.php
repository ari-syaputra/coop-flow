<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('procurement_order_items', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke tabel induk di atas
            $table->foreignId('procurement_order_id')
                  ->constrained('procurement_orders')
                  ->onDelete('cascade');
                  
            $table->foreignId('fertilizer_id')->constrained('fertilizers');
            $table->string('fertilizer_name'); // Snapshot nama untuk histori jika record master berubah
            
            // Data Rekomendasi Awal dari AI (untuk audit pembanding)
            $table->integer('ai_suggested_bags')->default(0);
            $table->decimal('ai_suggested_kg', 12, 2)->default(0.00);

            // Data Aktual yang diinput dan disetujui user (Bisa disesuaikan manual)
            $table->integer('final_bags_ordered');
            $table->decimal('final_weight_kg', 12, 2);
            $table->integer('packaging_size_kg')->default(50);
            
            // Pencatatan finansial per item
            $table->decimal('price_per_kg', 15, 2);
            $table->decimal('harga_per_karung', 15, 2);
            $table->decimal('subtotal_price', 15, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procurement_order_items');
    }
};