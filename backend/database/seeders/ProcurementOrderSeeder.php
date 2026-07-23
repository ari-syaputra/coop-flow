<?php

namespace Database\Seeders;

use App\Models\Cooperative;
use App\Models\Fertilizer;
use App\Models\ProcurementOrder;
use App\Models\ProcurementOrderItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class ProcurementOrderSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Bersihkan tabel pengadaan terlebih dahulu (mencegah duplikasi)
        Schema::disableForeignKeyConstraints();
        ProcurementOrderItem::truncate();
        ProcurementOrder::truncate();
        Schema::enableForeignKeyConstraints();

        // 2. Ambil Koperasi (atau buat jika belum ada di database)
        $cooperative = Cooperative::first() ?? Cooperative::create([
            'name' => 'KUD Makmur Sejahtera',
            'cooperative_code' => 'KOP-DEFAULT-001',
            'email_cooperative' => 'koperasi@coopflow.id',
            'nib_cooperative' => '1234567890',
            'phone_cooperative' => '081234567891',
            'address' => 'SIDOMULYO RT 05',
            'province' => 'DAERAH ISTIMEWA YOGYAKARTA',
            'city_koor' => 'KABUPATEN SLEMAN',
            'district' => 'GODEAN',
            'village' => 'SIDOMULYO',
            'latitude' => -7.7713,
            'longitude' => 110.3025,
            'is_activated' => true,
            'is_profile_completed' => true,
        ]);

        // 3. Ambil data Pupuk dari InventorySeeder (berdasarkan fertilizer_code)
        $urea = Fertilizer::firstOrCreate(
            ['fertilizer_code' => 'FPK-UREA'],
            [
                'cooperative_id' => $cooperative->id,
                'name' => 'Urea',
                'current_stock_kg' => 45250,
                'minimum_stock_kg' => 20000,
                'price_per_kg' => 2500,
                'status' => 'tersedia',
            ]
        );

        $npk = Fertilizer::firstOrCreate(
            ['fertilizer_code' => 'FPK-NPK'],
            [
                'cooperative_id' => $cooperative->id,
                'name' => 'NPK',
                'current_stock_kg' => 38400,
                'minimum_stock_kg' => 15000,
                'price_per_kg' => 3000,
                'status' => 'tersedia',
            ]
        );

        // Format data pupuk untuk item PO
        $fertilizers = [
            [
                'id' => $urea->id,
                'name' => $urea->name,
                'packaging_size_kg' => 50,
                'price_per_kg' => $urea->price_per_kg ?? 2500,
                'harga_per_karung' => ($urea->price_per_kg ?? 2500) * 50,
            ],
            [
                'id' => $npk->id,
                'name' => $npk->name,
                'packaging_size_kg' => 50,
                'price_per_kg' => $npk->price_per_kg ?? 3000,
                'harga_per_karung' => ($npk->price_per_kg ?? 3000) * 50,
            ],
        ];

        // 4. Skenario Data PO Lengkap untuk Dashboard (Tersebar dalam 7 bulan terakhir)
        $dataOrders = [
            // [PO-1] PENDING_DINAS (Bulan ini)
            [
                'po_number' => 'PO-' . now()->format('Ymd') . '-A1B2C',
                'periode_pengadaan' => now()->translatedFormat('F Y'),
                'status_verifikasi' => 'PENDING_DINAS',
                'status_logistik' => 'NONE',
                'items' => [
                    ['fertilizer' => $fertilizers[0], 'bags' => 120],
                    ['fertilizer' => $fertilizers[1], 'bags' => 80],
                ],
                'created_at' => now()->subDays(1),
            ],

            // [PO-2] PENDING_KEMENKO (1 Bulan lalu)
            [
                'po_number' => 'PO-' . now()->subMonths(1)->format('Ymd') . '-D3E4F',
                'periode_pengadaan' => now()->subMonths(1)->translatedFormat('F Y'),
                'status_verifikasi' => 'PENDING_KEMENKO',
                'status_logistik' => 'NONE',
                'notes_from_verifier' => 'Lolos verifikasi tingkat Kabupaten Sleman.',
                'items' => [
                    ['fertilizer' => $fertilizers[0], 'bags' => 200],
                    ['fertilizer' => $fertilizers[1], 'bags' => 150],
                ],
                'created_at' => now()->subMonths(1)->subDays(3),
            ],

            // [PO-3] APPROVED & PROD_LINI_1_2 (2 Bulan lalu)
            [
                'po_number' => 'PO-' . now()->subMonths(2)->format('Ymd') . '-G5H6I',
                'periode_pengadaan' => now()->subMonths(2)->translatedFormat('F Y'),
                'status_verifikasi' => 'APPROVED',
                'status_logistik' => 'PROD_LINI_1_2',
                'origin_lat' => -6.2088,
                'origin_lng' => 106.8456,
                'destination_lat' => -7.7713,
                'destination_lng' => 110.3025,
                'gis_distance_km' => 540.20,
                'estimated_travel_hours' => 24,
                'dispatched_at' => now()->subMonths(2)->addHours(12),
                'notes_from_verifier' => 'Rute Intra-Pulau (Darat). Jarak Tempuh: 540.2 Km.',
                'items' => [
                    ['fertilizer' => $fertilizers[0], 'bags' => 300],
                    ['fertilizer' => $fertilizers[1], 'bags' => 250],
                ],
                'created_at' => now()->subMonths(2)->subDays(5),
            ],

            // [PO-4] GUDANG_LINI_3 (3 Bulan lalu)
            [
                'po_number' => 'PO-' . now()->subMonths(3)->format('Ymd') . '-J7K8L',
                'periode_pengadaan' => now()->subMonths(3)->translatedFormat('F Y'),
                'status_verifikasi' => 'APPROVED',
                'status_logistik' => 'GUDANG_LINI_3',
                'dinas_received_at' => now()->subMonths(3)->addDays(2),
                'receipt_notes' => 'Pupuk telah diterima fisik lengkap & fisik baik di Gudang Lini 3 Sleman.',
                'items' => [
                    ['fertilizer' => $fertilizers[0], 'bags' => 180, 'received' => 180],
                    ['fertilizer' => $fertilizers[1], 'bags' => 120, 'received' => 120],
                ],
                'created_at' => now()->subMonths(3)->subDays(2),
            ],

            // [PO-5] SIAP_TEBUS_LINI_4 (4 Bulan lalu)
            [
                'po_number' => 'PO-' . now()->subMonths(4)->format('Ymd') . '-M9N0P',
                'periode_pengadaan' => now()->subMonths(4)->translatedFormat('F Y'),
                'status_verifikasi' => 'APPROVED',
                'status_logistik' => 'SIAP_TEBUS_LINI_4',
                'items' => [
                    ['fertilizer' => $fertilizers[0], 'bags' => 400, 'received' => 400],
                ],
                'created_at' => now()->subMonths(4)->subDays(1),
            ],

            // [PO-6] SELESAI (5 Bulan lalu)
            [
                'po_number' => 'PO-' . now()->subMonths(5)->format('Ymd') . '-Q1R2S',
                'periode_pengadaan' => now()->subMonths(5)->translatedFormat('F Y'),
                'status_verifikasi' => 'APPROVED',
                'status_logistik' => 'SELESAI',
                'completed_at' => now()->subMonths(5)->addDays(10),
                'items' => [
                    ['fertilizer' => $fertilizers[0], 'bags' => 500, 'received' => 500],
                    ['fertilizer' => $fertilizers[1], 'bags' => 500, 'received' => 500],
                ],
                'created_at' => now()->subMonths(5)->subDays(4),
            ],

            // [PO-7] REJECTED_DINAS (6 Bulan lalu)
            [
                'po_number' => 'PO-' . now()->subMonths(6)->format('Ymd') . '-T3U4V',
                'periode_pengadaan' => now()->subMonths(6)->translatedFormat('F Y'),
                'status_verifikasi' => 'REJECTED_DINAS',
                'status_logistik' => 'NONE',
                'rejection_reason' => 'Pengajuan melebihi batas alokasi kuota tahunan wilayah KUD Sleman.',
                'items' => [
                    ['fertilizer' => $fertilizers[1], 'bags' => 1000],
                ],
                'created_at' => now()->subMonths(6)->subDays(2),
            ],
        ];

        // 5. Eksekusi Penyimpanan ke Database
        foreach ($dataOrders as $orderData) {
            $itemsData = $orderData['items'];
            unset($orderData['items']);

            $totalBags = 0;
            $totalKg = 0;
            $totalCost = 0;
            $itemCount = count($itemsData);

            // Simpan tanggal untuk digunakan di relasi item agar grafik sinkron
            $timestamp = $orderData['created_at'];

            $order = ProcurementOrder::create(array_merge([
                'cooperative_id' => $cooperative->id,
                'total_items' => $itemCount,
                'total_bags_ordered' => 0,
                'total_weight_kg' => 0,
                'total_estimated_cost' => 0,
                'updated_at' => $timestamp,
            ], $orderData));

            foreach ($itemsData as $itemInfo) {
                $fert = $itemInfo['fertilizer'];
                $bags = (int) $itemInfo['bags'];
                $weight = $bags * $fert['packaging_size_kg'];
                $subtotal = $bags * $fert['harga_per_karung'];

                ProcurementOrderItem::create([
                    'procurement_order_id' => $order->id,
                    'fertilizer_id' => $fert['id'],
                    'fertilizer_name' => $fert['name'],
                    'ai_suggested_bags' => $bags,
                    'ai_suggested_kg' => $weight,
                    'final_bags_ordered' => $bags,
                    'final_weight_kg' => $weight,
                    'packaging_size_kg' => $fert['packaging_size_kg'],
                    'price_per_kg' => $fert['price_per_kg'],
                    'harga_per_karung' => $fert['harga_per_karung'],
                    'subtotal_price' => $subtotal,
                    'actual_received_bags' => isset($itemInfo['received']) ? (int) $itemInfo['received'] : null,
                    // Penting: Samakan created_at dan updated_at dengan order
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ]);

                $totalBags += $bags;
                $totalKg += $weight;
                $totalCost += $subtotal;
            }

            $order->update([
                'total_bags_ordered' => $totalBags,
                'total_weight_kg' => $totalKg,
                'total_estimated_cost' => $totalCost,
            ]);
        }
    }
}