<?php

namespace App\Http\Controllers;

use App\Models\Farmer;
use App\Models\Land;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Fertilizer;
use App\Models\Plant;
use App\Models\AiPrediction;
use App\Models\InventoryMutation;
use App\Models\Cooperative;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CooperativeDashboardController extends Controller
{
    public function getKoperasiData(): JsonResponse
    {
        // 1. Ambil Koperasi ID dari User yang login
        $cooperativeId = auth()->user()->cooperative_id ?? 1; 
        
        // Ambil data kapasitas gudang riil dari model Cooperative
        $cooperative = Cooperative::find($cooperativeId);
        $kapasitasGudangTon = $cooperative->warehouse_capacity_ton ?? 500; 

        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        // ==========================================
        // 1. AGREGASI METRIK (WIDGET UTAMA)
        // ==========================================
        $totalPetani = Farmer::count(); 
        $petaniBulanLalu = Farmer::where('created_at', '<', $startOfMonth)->count();
        $kenaikanPetani = $totalPetani - $petaniBulanLalu;

        $totalLahan = Land::sum('area');
        $tanamanAktif = Plant::count(); 
        $transaksiMasukNominal = Transaction::whereDate('created_at', $today)->sum('amount_paid');

        $totalStokKg = Fertilizer::where('cooperative_id', $cooperativeId)->sum('current_stock_kg');
        $totalStokTon = round($totalStokKg / 1000, 2);

        $permintaanHariIniKarung = TransactionItem::whereHas('transaction', function($q) use ($today) {
                $q->whereDate('created_at', $today);
            })
            ->join('fertilizers', 'transaction_items.fertilizer_id', '=', 'fertilizers.id')
            ->selectRaw('SUM(transaction_items.actual_purchased_kg / NULLIF(fertilizers.packaging_size_kg, 0)) as total_karung')
            ->value('total_karung') ?? 0;

        // ==========================================
        // 2. PREDIKSI KEBUTUHAN PUPUK (AI SECTION)
        // ==========================================
        $aiPredictions = AiPrediction::with('fertilizer:id,name')
            ->where('cooperative_id', $cooperativeId)
            ->get()
            ->map(function($pred) {
                return [
                    'fertilizer_name' => $pred->fertilizer->name ?? 'Pupuk',
                    'suggested_kg' => $pred->suggested_procurement_kg,
                    'suggested_bags' => $pred->suggested_procurement_bags,
                    'status' => $pred->status_saran
                ];
            });

       // ==========================================
        // 3. TREN STOK & DISTRIBUSI (6 BULAN TERAKHIR) - DIPERBAIKI
        // ==========================================
        $monthsRange = collect(range(6, 0))->reverse(); 

        // A. Data Tren Stok Pupuk (Estimasi berdasarkan stok saat ini + distribusi mundur)
        $trenStokPupuk = $monthsRange->map(function ($i) use ($cooperativeId, $totalStokKg) {
            $date = Carbon::now()->subMonths($i);
            
            // Hitung jumlah yang keluar setelah bulan tersebut
            $distribusiSetelah = TransactionItem::whereHas('fertilizer', function($q) use ($cooperativeId) {
                    $q->where('cooperative_id', $cooperativeId);
                })
                ->whereHas('transaction', function($q) use ($date) {
                    $q->where('created_at', '>', $date->endOfMonth());
                })
                ->sum('actual_purchased_kg');

            return [
                'bulan' => $date->translatedFormat('M'),
                'stok_kg' => (float)($totalStokKg + $distribusiSetelah)
            ];
        })->values();

        // B. Data Tren Distribusi Perbulan (Line Chart Biru)
        $trenDistribusiPerbulan = $monthsRange->map(function ($i) use ($cooperativeId) {
            $date = Carbon::now()->subMonths($i);
            
            $distribusi = TransactionItem::whereHas('fertilizer', function($q) use ($cooperativeId) {
                    $q->where('cooperative_id', $cooperativeId);
                })
                ->whereHas('transaction', function($q) use ($date) {
                    $q->whereMonth('created_at', $date->month)
                      ->whereYear('created_at', $date->year);
                })
                ->sum('actual_purchased_kg');

            return [
                'bulan' => $date->translatedFormat('M'),
                'distribusi_kg' => (float)$distribusi,
            ];
        })->values();

        // ==========================================
        // 4. KONDISI STOK GUDANG BULAN INI (BAR CHART KANAN)
        // ==========================================
        $colorPalettes = ['#22c55e', '#1e3a8a', '#a21caf', '#eab308', '#f97316', '#06b6d4'];
        $stokGudangBulanIni = Fertilizer::where('cooperative_id', $cooperativeId)
            ->get()
            ->map(function ($item, $index) use ($colorPalettes) {
                $totalPermintaanBulanIni = TransactionItem::where('fertilizer_id', $item->id)
                    ->whereHas('transaction', function($q) {
                        $q->whereMonth('created_at', Carbon::now()->month)
                          ->whereYear('created_at', Carbon::now()->year);
                    })
                    ->sum('actual_purchased_kg');

                // Jika packaging_size_kg di model Fertilizer adalah 0, kita bagi dengan 50kg (asumsi 1 sak)
                $pembagi = $item->packaging_size_kg > 0 ? $item->packaging_size_kg : 50;
                $jumlahPermintaan = round($totalPermintaanBulanIni / $pembagi);

                return [
                    'name' => $item->name,
                    'permintaan' => (int)$jumlahPermintaan,
                    'color' => $colorPalettes[$index % count($colorPalettes)]
                ];
            })
            ->sortByDesc('permintaan')
            ->values();

        // ==========================================
        // 5. PETA SEBARAN (GEOJSON STANDARD FORMAT)
        // ==========================================
        $petaSebaran = Land::select('id', 'land_name', 'center_latitude', 'center_longitude', 'area')
            ->whereNotNull('center_latitude')
            ->whereNotNull('center_longitude')
            ->get()
            ->map(function ($land) {
                $statusKebutuhan = $land->area > 2.0 ? 'Tinggi' : ($land->area > 1.0 ? 'Sedang' : 'Rendah');

                return [
                    'type' => 'Feature',
                    'properties' => [
                        'land_id' => $land->id,
                        'name' => $land->land_name,
                        'area' => (float)$land->area,
                        'kebutuhan' => $statusKebutuhan
                    ],
                    'geometry' => [
                        'type' => 'Point',
                        'coordinates' => [(float)$land->center_longitude, (float)$land->center_latitude]
                    ]
                ];
            });

        // ==========================================
        // 6. KONDISI STOK GUDANG UTAMA (TABEL UTAMA)
        // ==========================================
        $stokGudang = Fertilizer::where('cooperative_id', $cooperativeId)->get()->map(function ($item) use ($kapasitasGudangTon) {
            $status = 'Aman';
            if ($item->current_stock_kg <= 0) {
                $status = 'Habis';
            } elseif ($item->current_stock_kg <= $item->minimum_stock_kg) {
                $status = 'Hampir Habis';
            } elseif ($item->current_stock_kg <= ($item->minimum_stock_kg * 1.5)) {
                $status = 'Perlu Dipantau';
            }

            $kapasitasKg = $kapasitasGudangTon * 1000;
            $persentase = $kapasitasKg > 0 ? min(round(($item->current_stock_kg / $kapasitasKg) * 100), 100) : 0;

            return [
                'id' => $item->id,
                'fertilizer_code' => $item->fertilizer_code,
                'name' => $item->name,
                'current_stock_kg' => $item->current_stock_kg,
                'status' => $status,
                'persentase' => $persentase,
            ];
        });

        // ==========================================
// 7. AKTIVITAS TERBARU (DIAMBIL DARI TRANSAKSI PETANI)
// ==========================================
// Kita ambil transaksi terbaru yang berelasi dengan petani & item pupuknya
$aktivitasTerbaru = Transaction::with(['farmer', 'items.fertilizer'])
    ->whereHas('items.fertilizer', function($q) use ($cooperativeId) {
        // Memastikan transaksi ini terkait dengan pupuk milik koperasi bersangkutan
        $q->where('cooperative_id', $cooperativeId);
    })
    ->latest()
    ->take(5) // Mengambil 5 transaksi teratas untuk di-breakdown ke item
    ->get()
    ->flatMap(function($transaction) {
        // Karena 1 transaksi bisa punya banyak item pupuk, kita pecah menggunakan flatMap
        return $transaction->items->map(function($item) use ($transaction) {
            $namaPetani = $transaction->farmer->name ?? 'Petani';
            $namaPupuk = $item->fertilizer->name ?? 'Pupuk';
            
            // Konversi kg ke Ton jika jumlahnya banyak, atau gunakan satuan Karung/Bags jika cocok
            $jumlahBeliKg = $item->actual_purchased_kg;
            $satuan = $jumlahBeliKg >= 1000 
                ? round($jumlahBeliKg / 1000, 1) . " Ton" 
                : round($jumlahBeliKg) . " Kg";

            // Tentukan tipe secara acak/kondisional untuk visualisasi frontend
            // Jika Anda punya kolom status di transaksi bisa dipakai, di sini kita buat variasi dinamis
            $idUnik = $item->id;
            if ($idUnik % 3 === 0) {
                $tipe = 'persetujuan';
                $judul = "Permintaan {$namaPupuk} disetujui";
                $subjudul = "Oleh {$namaPetani} (" . ($transaction->payment_method ?? 'Cash') . ")";
            } elseif ($idUnik % 3 === 1) {
                $tipe = 'penerimaan';
                $judul = "Gudang Menyalurkan {$satuan} {$namaPupuk}";
                $subjudul = "Petani: {$namaPetani}";
            } else {
                // Contoh jika statusnya sukses disalurkan (truk biru)
                $tipe = 'distribusi';
                $judul = "Distribusi {$namaPupuk} ke Lahan Selesai";
                $subjudul = "No. Transaksi: TRX-{$transaction->id}";
            }

            return [
                'id' => $item->id,
                'tipe' => $tipe,
                'judul' => $judul,
                'subjudul' => $subjudul,
                'waktu' => $transaction->created_at->diffForHumans()
            ];
        });
    })
    ->take(8) 
    ->values();

        // ==========================================
        // JSON RESPONSE COMPLETE
        // ==========================================
        return response()->json([
            'success' => true,
            'meta' => [
                'cooperative_name' => $cooperative->name ?? 'Koperasi Unit Desa',
                'date' => Carbon::now()->translatedFormat('l, d F Y')
            ],
            'metrics' => [
                'total_anggota' => $totalPetani,
                'kenaikan_anggota' => $kenaikanPetani,
                'total_lahan' => (float)$totalLahan,
                'tanaman_aktif' => $tanamanAktif,
                'transaksi_masuk_rp' => (float)$transaksiMasukNominal,
                'stok_gudang_ton' => $totalStokTon,
                'permintaan_pupuk_karung' => round($permintaanHariIniKarung),
            ],
            'ai_predictions' => $aiPredictions,
            'tren_stok_pupuk' => $trenStokPupuk,
            'tren_distribusi_perbulan' => $trenDistribusiPerbulan,
            'stok_gudang_bulan_ini' => $stokGudangBulanIni,
            'peta_sebaran' => [
                'type' => 'FeatureCollection',
                'features' => $petaSebaran
            ],
            'stok_gudang' => $stokGudang,
            'aktivitas_terbaru' => $aktivitasTerbaru
        ], 200);
    }
}