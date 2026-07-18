"use client";

import { Farmer } from "@/app/types/farmer";
import { FiUser, FiMap, FiActivity } from "react-icons/fi"; 
import LandPredictionCard, { CustomFertilizerItem, CustomizedBagOutput } from "@/app/components/dashboard/penyaluran/LandPredictionCard";

export interface LandSummary {
  totalBags: number;
  totalCost: number;
  totalKg: number;
  rawItems: CustomFertilizerItem[];
  customizedBags?: CustomizedBagOutput[]; 
}

interface FarmerDetailPanelProps {
  farmer: Farmer;
  landsSummary: Record<string, LandSummary>;
  onLandsSummaryChange: (summary: Record<string, LandSummary>) => void;
  onCheckout: (summary: { 
    totalBags: number; 
    totalCost: number; 
    totalKg: number;
    items: any[]; 
  }) => void;
}

export interface SelectedFertilizerItem {
  bagKey: string;
  fertilizer_id: number; // ID Relasi DB Utama
  fertilizer_code: string;
  nama: string;
  weightKg: number;
  price_per_kg: number;
  subtotal: number;
  isChecked: boolean;
  image_url: string | null;
  packaging_size_kg?: number; 
  
  // Data ML Spesifik per Item Pupuk
  original_recommended_kg: number; // Dosis rekomendasi awal dari ML
  land_id: number; // ID Lahan tempat pupuk diaplikasikan
  analysis_meta_snapshot: {
    luas_lahan_hektar: number;
    jenis_komoditas: string;
    fase_tanam_saat_ini: string;
    suhu_rata_rata_celcius: number;
    kelembapan_percent: number;
    curah_hujan_mm: number;
  };
}

export default function FarmerDetailPanel({ farmer, landsSummary, onLandsSummaryChange, onCheckout }: FarmerDetailPanelProps) {
  
  const handleLandSummaryChange = (landId: string, summary: any) => {
    onLandsSummaryChange({
      ...landsSummary,
      [landId]: summary,
    });
  };

  const grandTotalBags = Object.values(landsSummary).reduce((acc, curr) => acc + curr.totalBags, 0);
  const grandTotalCost = Object.values(landsSummary).reduce((acc, curr) => acc + curr.totalCost, 0);
  const grandTotalKg = Object.values(landsSummary).reduce((acc, curr) => acc + curr.totalKg, 0);

  const getAllSelectedItems = () => {
    const allCustomBags: any[] = [];

    // Iterasi landsSummary berdasarkan ID lahannya
    Object.entries(landsSummary).forEach(([landId, summary]) => {
      // Cari data objek land asli dari array farmer.lands untuk mengambil metadata
      const currentLand = farmer.lands.find((l) => String(l.id) === String(landId));
      const activePlant = currentLand?.plants?.[0]; // Ambil tanaman aktif pertama sebagai representasi

      const analysisMeta = {
        luas_lahan_hektar: Number(currentLand?.area || 0),
        jenis_komoditas: activePlant?.name || "Lainnya",
        fase_tanam_saat_ini: activePlant?.current_phase || "Vegetatif",
        suhu_rata_rata_celcius: Number(currentLand?.average_temperature || 0),
        kelembapan_persen: Number(currentLand?.average_humidity || 0),
       curah_hujan_mm: Number(currentLand?.average_monthly_precipitation || 0),
      };

      if (summary.customizedBags && Array.isArray(summary.customizedBags)) {
        summary.customizedBags.forEach((bag) => {
          // Hanya proses item yang dicentang (aktif dipilih petani)
          if (!bag.isChecked) return;

          const originalItem = summary.rawItems.find(
            (item) => item.fertilizer_code?.toLowerCase() === bag.fertilizer_code?.toLowerCase()
          );

          const dynamicPackagingSize = 
            (bag as any).packaging_size_kg || 
            originalItem?.packaging_size_kg || 
            50;

          // PERBAIKAN: Ambil ID secara berlapis dari seluruh properti ID yang memungkinkan
          const rawId = 
            bag.fertilizer_id || 
            (bag as any).id || 
            originalItem?.fertilizer_id || 
            originalItem?.id || 
            (originalItem as any).fertilizer?.id; // Antisipasi relasi objek bertingkat dari backend

          const resolvedFertilizerId = rawId ? Number(rawId) : 0;

          // Menghindari pengiriman ID bernilai 0 ke backend
          if (resolvedFertilizerId === 0) {
            console.warn(`[WARNING] Gagal melacak fertilizer_id untuk pupuk ${bag.nama || bag.fertilizer_code}`);
          }

          allCustomBags.push({
            bagKey: bag.bagKey,
            fertilizer_id: resolvedFertilizerId, 
            fertilizer_code: bag.fertilizer_code,
            nama: bag.nama,
            weightKg: bag.weightKg,
            price_per_kg: bag.price_per_kg,
            subtotal: bag.subtotal,
            isChecked: bag.isChecked,
            image_url: bag.image_url || originalItem?.image_url || null,
            packaging_size_kg: dynamicPackagingSize,
            
            // Data spesifik untuk kebutuhan transaksi & ML
            land_id: Number(landId),
            original_recommended_kg: originalItem?.original_recommended_kg || bag.weightKg,
            analysis_meta_snapshot: analysisMeta
          });
        });
      } else if (summary.rawItems && Array.isArray(summary.rawItems)) {
        summary.rawItems.forEach((item, idx) => {
          const defaultBagsCount = item.jumlah_karung || 1;
          
          // PERBAIKAN: Ambil ID di skenario fallback rawItems secara aman
          const rawId = item.fertilizer_id || item.id || (item as any).fertilizer?.id;
          const resolvedFertilizerId = rawId ? Number(rawId) : 0;

          for (let i = 0; i < defaultBagsCount; i++) {
            allCustomBags.push({
              bagKey: `bag-default-${landId}-${idx}-${i}`,
              fertilizer_id: resolvedFertilizerId,
              fertilizer_code: item.fertilizer_code,
              nama: item.nama,
              weightKg: item.packaging_size_kg || 50,
              price_per_kg: item.price_per_kg,
              subtotal: Math.round(item.price_per_kg * (item.packaging_size_kg || 50)),
              isChecked: true,
              image_url: item.image_url || null,
              packaging_size_kg: item.packaging_size_kg || 50,
              
              // Data spesifik untuk kebutuhan transaksi & ML
              land_id: Number(landId),
              original_recommended_kg: item.original_recommended_kg || 50,
              analysis_meta_snapshot: analysisMeta
            });
          }
        });
      }
    });

    return allCustomBags;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-100 pb-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl text-emerald-600 flex-shrink-0">
            <FiUser className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-xs">
            <div>
              <span className="text-gray-400 block mb-0.5">Alamat</span>
              <span className="font-medium text-gray-700 block truncate max-w-[150px]">
                {farmer.user.address}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Total Kepemilikan</span>
              <span className="font-bold text-gray-800">{farmer.lands.length} Lahan</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Total Luas Area</span>
              <span className="font-bold text-gray-800">{farmer.total_land_area} Hektar</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Terdaftar Sejak</span>
              <span className="font-medium text-gray-700">
                {new Date(farmer.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiMap className="text-emerald-600" /> Informasi Detail Lahan & Vegetasi Tanaman
          </h4>
          
          <div className={`grid grid-cols-1 gap-4 ${farmer.lands.length > 1 ? "md:grid-cols-2" : ""}`}>
            {farmer.lands.map((land) => (
              <div key={land.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2 mb-3">
                    <div>
                      <h5 className="font-bold text-sm text-gray-800">{land.land_name}</h5>
                      <p className="text-[11px] text-gray-400">Hak: <span className="font-medium text-gray-600">{land.status}</span></p>
                    </div>
                    <span className="bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      {land.area} {land.unit || "Ha"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                    <div className="bg-white p-2 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block">Tanah & Air</span>
                      <span className="font-medium text-gray-700 truncate block">
                        {land.soil_type || "-"} / {land.water_source || "-"}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block">Kondisi Rata-rata</span>
                      <span className="font-medium text-gray-700 block">
                        {land.average_temperature}°C / {land.average_humidity}% RH
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-100/60 rounded-xl p-3 mt-auto">
                  <h6 className="text-[11px] font-bold text-emerald-950 mb-2 flex items-center gap-1">
                    <FiActivity className="text-emerald-700" /> Vegetasi Aktif
                  </h6>
                  
                  {land.plants && land.plants.length > 0 ? (
                    <div className="divide-y divide-emerald-100/40">
                      {land.plants.map((plant) => (
                        <div key={plant.id} className="text-[11px] py-1.5 first:pt-0 last:pb-0 grid grid-cols-2 gap-y-1">
                          <div>
                            <span className="text-gray-400 block">Komoditas</span>
                            <span className="font-bold text-emerald-900 capitalize">{plant.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-400 block">Waktu Tanam</span>
                            <span className="font-medium text-gray-700">
                              {new Date(plant.planting_date).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Fase</span>
                            <span className="text-emerald-800 font-semibold">{plant.current_phase || "Vegetatif"}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-400 block">Terakhir</span>
                            <span className="text-gray-700 font-medium">
                              {plant.last_fertilizer_amount || 0} Kg
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic py-0.5">Tidak ada vegetasi aktif.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-gray-800">Prediksi Kebutuhan Pupuk</h4>
        <p className="text-xs text-gray-400 mb-4">Berdasarkan data lahan di atas, silahkan lakukan rekomendasi takaran pupuk untuk masing-masing lahan:</p>
        
        <div className="grid grid-cols-1 gap-4">
          {farmer.lands.map((land) => {
            const previousSavedSummary = landsSummary[land.id];
            
            return (
              <LandPredictionCard 
                key={land.id} 
                land={land} 
                village={farmer.village}
                onLandSummaryChange={handleLandSummaryChange}
                initialCustomBags={previousSavedSummary?.customizedBags}
                initialSummary={previousSavedSummary ? {
                  totalBags: previousSavedSummary.totalBags,
                  totalCost: previousSavedSummary.totalCost,
                  totalKg: previousSavedSummary.totalKg
                } : undefined}
              />
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex gap-8 items-center">
          <div>
            <span className="text-[10px] text-gray-400 block font-semibold uppercase">Total Pupuk</span>
            <span className="text-base font-bold text-emerald-600">
              {grandTotalBags} Karung <span className="text-xs font-normal text-gray-400">({grandTotalKg} Kg)</span>
            </span>
          </div>
          <div className="border-l pl-6 border-gray-200">
            <span className="text-[10px] text-gray-400 block font-semibold uppercase">Total Estimasi Biaya</span>
            <span className="text-base font-black text-gray-800">
              Rp {grandTotalCost.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => onCheckout({ 
            totalBags: grandTotalBags, 
            totalCost: grandTotalCost, 
            totalKg: grandTotalKg,
            items: getAllSelectedItems() 
          })}
          disabled={grandTotalBags === 0}
          className={`px-4 py-2.5 rounded-lg font-medium text-sm transition shadow-sm ${
            grandTotalBags === 0 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-emerald-800 text-white hover:bg-emerald-900"
          }`}
        >
          Lanjut Pembayaran
        </button>
      </div>
    </div>
  );
}