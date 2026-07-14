<?php

namespace Database\Seeders;

use App\Models\Cooperative;
use App\Models\Warehouse;
use App\Models\Fertilizer;
use App\Models\InventoryMutation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Data Koperasi Induk Ter-aktivasi (Untuk simulasi yang sudah jalan)
        $cooperativeActive = Cooperative::create([
            'name'                   => 'Koperasi Desa Merah Putih Ranjeng',
            'cooperative_code'       => 'KDMP-3604-001',
            'is_activated'           => true,          
            'is_profile_completed'   => true,          
            'address'                => 'Kecamatan Ciruas, Kabupaten Serang, Banten',
            'latitude'               => -6.11234500,   
            'longitude'              => 106.23456700,
            'warehouse_capacity_ton' => 150
        ]);

        // Buat Data Koperasi Sampel Belum Ter-aktivasi (Untuk Bahan Demo Dashboard Kemenko)
        Cooperative::create([
            'name'                   => 'Koperasi Desa Merah Putih Wonosari',
            'cooperative_code'       => 'KDMP-3439-002',
            'is_activated'           => false,         
            'is_profile_completed'   => false,
        ]);

        Cooperative::create([
            'name'                   => 'Koperasi Desa Merah Putih Subang',
            'cooperative_code'       => 'KDMP-3213-003',
            'is_activated'           => false,
            'is_profile_completed'   => false,
        ]);


        // 2. Buat Data Multi-Gudang (Dihubungkan ke Koperasi Aktif & disimpan ke variabel yang benar)
        $gudangPusat = Warehouse::create([
            'cooperative_id' => $cooperativeActive->id, // 👈 Diperbaiki dari $cooperative
            'name'           => 'Gudang Pusat Klaten',
            'capacity_ton'   => 100,                     // 👈 Diperbaiki dari capacity_kg
            'address'        => 'Jl. Pemuda No. 12, Klaten Tengah', 
            'warehouse_type' => 'Gudang Utama',
            'surface_area'   => 400,
            'facilities'     => ['CCTV', 'Pallet', 'Timbangan Digital']
        ]);

        $gudangCabang = Warehouse::create([
            'cooperative_id' => $cooperativeActive->id,
            'name'           => 'Gudang Pembantu Cabang',
            'capacity_ton'   => 50,
            'address'        => 'Jl. Raya Lintas Desa No. 89, Ranjeng', 
            'warehouse_type' => 'Gudang Pembantu',
            'surface_area'   => 200,
            'facilities'     => ['CCTV', 'Ventilasi']
        ]);


        // 3. Buat Data Master Pupuk & Saldo Stok Awal (Sudah terhubung ke variabel $gudangPusat & $gudangCabang)
        $dataPupuk = [
            [
                'fertilizer_code'    => 'FPK-UREA',
                'warehouse_id'       => $gudangPusat->id, // 👈 Aman, variable terdefinisi
                'name'               => 'Urea',
                'current_stock_kg'   => 45250,
                'minimum_stock_kg'   => 20000,
                'price_per_kg'       => 2500, 
            ],
            [
                'fertilizer_code'    => 'FPK-NPK',
                'warehouse_id'       => $gudangPusat->id,
                'name'               => 'NPK',
                'current_stock_kg'   => 38400,
                'minimum_stock_kg'   => 15000,
                'price_per_kg'       => 3000,
            ],
            [
                'fertilizer_code'    => 'FPK-ORGANIK',
                'warehouse_id'       => $gudangPusat->id,
                'name'               => 'Pupuk Organik',
                'current_stock_kg'   => 12800,
                'minimum_stock_kg'   => 10000,
                'price_per_kg'       => 1500,
            ],
            [
                'fertilizer_code'    => 'FPK-SP36',
                'warehouse_id'       => $gudangCabang->id, // 👈 Aman, variable terdefinisi
                'name'               => 'SP-36',
                'current_stock_kg'   => 8500,
                'minimum_stock_kg'   => 5000,
                'price_per_kg'       => 2800,
            ],
            [
                'fertilizer_code'    => 'FPK-KCL',
                'warehouse_id'       => $gudangCabang->id,
                'name'               => 'KCl',
                'current_stock_kg'   => 7000,
                'minimum_stock_kg'   => 5000,
                'price_per_kg'       => 4000,
            ],
            [
                'fertilizer_code'    => 'FPK-DOLOMIT',
                'warehouse_id'       => $gudangCabang->id,
                'name'               => 'Dolomit',
                'current_stock_kg'   => 5500,
                'minimum_stock_kg'   => 5000,
                'price_per_kg'       => 1000,
            ],
            [
                'fertilizer_code'    => 'FPK-ZA',
                'warehouse_id'       => $gudangCabang->id,
                'name'               => 'ZA',
                'current_stock_kg'   => 7000, 
                'minimum_stock_kg'   => 10000,
                'price_per_kg'       => 2200,
            ],
        ];

        foreach ($dataPupuk as $item) {
            $fertilizer = Fertilizer::create($item);

            // 4. Berikan data histori awal (mutasi masuk)
            InventoryMutation::create([
                'fertilizer_id' => $fertilizer->id,
                'type'          => 'masuk',
                'quantity_kg'   => $item['current_stock_kg'],
                'description'   => 'Pasokan awal kuota subsidi dari gudang lini III PT Pupuk Indonesia',
                'created_at'    => now()->subDays(rand(1, 5))
            ]);
        }
    }
}