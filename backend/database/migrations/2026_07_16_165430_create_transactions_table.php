<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained('users')->onDelete('restrict'); 
            
            $table->string('invoice_number')->unique();
            $table->string('payment_method'); 
            $table->decimal('amount_paid', 12, 2); 
            $table->enum('status', ['pending', 'success', 'failed', 'expired'])->default('pending');
            $table->json('payment_details')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};