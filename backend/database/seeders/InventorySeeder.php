<?php

namespace Database\Seeders;

use App\Models\Cooperative;
use App\Models\Fertilizer;
use App\Models\InventoryMutation;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ambil semua Koperasi yang sudah dibuat oleh CooperativeSeeder
        $allCooperatives = Cooperative::all();

        // 2. Data Master Pupuk (Template)
        $dataPupukTemplate = [
            ['fertilizer_code' => 'FPK-UREA',    'name' => 'Urea',          'current_stock_kg' => 45250, 'minimum_stock_kg' => 20000, 'price_per_kg' => 2500, 'status' => 'tersedia'],
            ['fertilizer_code' => 'FPK-NPK',     'name' => 'NPK',           'current_stock_kg' => 38400, 'minimum_stock_kg' => 15000, 'price_per_kg' => 3000, 'status' => 'tersedia'],
            ['fertilizer_code' => 'FPK-ORGANIK', 'name' => 'Pupuk Organik', 'current_stock_kg' => 12800, 'minimum_stock_kg' => 10000, 'price_per_kg' => 1500, 'status' => 'tersedia'],
            ['fertilizer_code' => 'FPK-SP36',    'name' => 'SP-36',         'current_stock_kg' => 8500,  'minimum_stock_kg' => 5000,  'price_per_kg' => 2800, 'status' => 'tersedia'],
            ['fertilizer_code' => 'FPK-KCL',     'name' => 'KCl',           'current_stock_kg' => 7000,  'minimum_stock_kg' => 5000,  'price_per_kg' => 4000, 'status' => 'tersedia'],
            ['fertilizer_code' => 'FPK-DOLOMIT', 'name' => 'Dolomit',       'current_stock_kg' => 5500,  'minimum_stock_kg' => 5000,  'price_per_kg' => 1000, 'status' => 'tersedia'],
            ['fertilizer_code' => 'FPK-ZA',      'name' => 'ZA',            'current_stock_kg' => 7000,  'minimum_stock_kg' => 10000, 'price_per_kg' => 2200, 'status' => 'menipis'],
        ];

        foreach ($allCooperatives as $coop) {
            // Cek apakah ini Koperasi Default (Godean)
            $isDefaultCoop = ($coop->cooperative_code === 'KOP-DEFAULT-001');

            // Update kapasitas gudang jika belum diisi
            if ($isDefaultCoop) {
                $coop->update([
                    'latitude'               => -6.11234500,
                    'longitude'              => 106.23456700,
                    'warehouse_capacity_ton' => 150,
                ]);
            } else {
                $coop->update([
                    'warehouse_capacity_ton' => rand(100, 200),
                ]);
            }

            foreach ($dataPupukTemplate as $item) {
                // Untuk Koperasi Default: gunakan stok persis milikmu
                // Untuk Koperasi lain: generate stok variatif
                $stock  = $isDefaultCoop ? $item['current_stock_kg'] : rand(5000, 35000);
                $status = $isDefaultCoop ? $item['status'] : ($stock < $item['minimum_stock_kg'] ? 'menipis' : 'tersedia');

                // Kode unik per koperasi agar tidak tumpang tindih di database
                $fertilizerCode = $isDefaultCoop 
                    ? $item['fertilizer_code'] 
                    : $item['fertilizer_code'] . '-' . $coop->district;

                // 3. Simpan / Update Stok Pupuk per Koperasi
                $fertilizer = Fertilizer::updateOrCreate(
                    [
                        'cooperative_id'  => $coop->id,
                        'fertilizer_code' => $fertilizerCode,
                    ],
                    [
                        'name'             => $item['name'],
                        'current_stock_kg' => $stock,
                        'minimum_stock_kg' => $item['minimum_stock_kg'],
                        'price_per_kg'     => $item['price_per_kg'],
                        'status'           => $status,
                    ]
                );

                // 4. Catat Mutasi Inventaris Awal
                InventoryMutation::firstOrCreate(
                    [
                        'fertilizer_id' => $fertilizer->id,
                        'description'   => 'Pasokan awal kuota subsidi dari gudang lini III PT Pupuk Indonesia'
                    ],
                    [
                        'type'        => 'masuk',
                        'quantity_kg' => $stock,
                        'created_at'  => now()->subDays(rand(1, 5))
                    ]
                );
            }
        }
    }
}