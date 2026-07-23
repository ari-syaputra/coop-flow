<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Farmer;
use App\Models\Fertilizer;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $cooperativeId = 1;

        // Ambil SEMUA petani (bukan cuma 1) dan pupuk milik koperasi 1
        $farmers = Farmer::whereHas('user', function ($q) use ($cooperativeId) {
            $q->where('cooperative_id', $cooperativeId);
        })->get();

        $fertilizers = Fertilizer::where('cooperative_id', $cooperativeId)->get();

        if ($farmers->isEmpty() || $fertilizers->isEmpty()) {
            return;
        }

        // Variasi total distribusi (kg) per bulan (Jan - Jul 2026)
        $monthlyDistributions = [
            6 => 1200, // Jan 2026
            5 => 2500, // Feb 2026
            4 => 1800, // Mar 2026
            3 => 3100, // Apr 2026
            2 => 2200, // Mei 2026
            1 => 4000, // Jun 2026
            0 => 1500, // Jul 2026 (Bulan ini)
        ];

        foreach ($monthlyDistributions as $monthsAgo => $totalKg) {
            $baseDate = Carbon::now()->subMonths($monthsAgo)->startOfMonth();
            
            // Kita pecah total volume bulan ini ke 3 sampai 6 transaksi berbeda
            $numberOfTransactions = rand(3, 6);
            $kgPerTransaction = $totalKg / $numberOfTransactions;

            for ($i = 0; $i < $numberOfTransactions; $i++) {
                // Pilih entitas acak untuk setiap transaksi
                $farmer = $farmers->random(); 
                $selectedFertilizer = $fertilizers->random(); 

                // Variasikan jumlah Kg agar angkanya tidak bulat sempurna (+/- 20%)
                $actualKg = round($kgPerTransaction * (rand(80, 120) / 100));
                
                // Kalkulasi harga (Asumsi Rp 2.500/kg)
                $pricePerKg = 2500;
                $subtotal = $actualKg * $pricePerKg;

                // Acak hari di bulan tersebut agar titik grafiknya natural
                $transactionDate = (clone $baseDate)->addDays(rand(1, 28));
                $dateString = $transactionDate->format('ymd');

                // 1. Buat Transaksi Header
                $transaction = Transaction::create([
                    'transaction_code' => 'GAF-' . $dateString . '-' . rand(1000, 9999),
                    'invoice_number'   => 'INV-' . $dateString . '-' . rand(1000, 9999),
                    'farmer_id'        => $farmer->id,
                    'grand_total'      => $subtotal,
                    'amount_paid'      => $subtotal,
                    'payment_method'   => 'Cash',
                    'status'           => 'success',
                    'created_at'       => $transactionDate,
                    'updated_at'       => $transactionDate,
                ]);

                // 2. Buat Item Transaksi
                TransactionItem::create([
                    'transaction_id'      => $transaction->id,
                    'fertilizer_id'       => $selectedFertilizer->id,
                    'actual_purchased_kg' => $actualKg,
                    'price_per_kg'        => $pricePerKg,
                    'subtotal'            => $subtotal,
                    'created_at'          => $transactionDate,
                    'updated_at'          => $transactionDate,
                ]);
            }
        }
    }
}