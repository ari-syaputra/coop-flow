"use client";

import React from "react";
import RegionSelectSection from "./RegionSelectSection";

// 🟢 Tipe data disesuaikan persis dengan validasi PlantController.php
export interface PlantItem {
  name: string;
  planting_date: string;
  current_phase: string;
  last_fertilizer_type: string;
  last_fertilizer_amount: string;
  last_phase: string;
}

export interface LandItem {
  land_name: string;
  area: string;
  unit: string;
  status: string;
  soil_type: string;
  water_source: string;
  irrigation_type: string;
  current_use: string;
  ownership_document: File | null;
  location_address: string;
  province_id: string;
  city_id: string;
  district_id: string;
  village_id: string;
  plants: PlantItem[];
}

interface LandFormSectionProps {
  lands: LandItem[];
  onLandChange: (index: number, field: string, value: any) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
}

export default function LandFormSection({ lands, onLandChange, onAddRow, onRemoveRow }: LandFormSectionProps) {

  const handlePlantChange = (landIndex: number, plantIndex: number, field: keyof PlantItem, value: string) => {
    const updatedPlants = [...lands[landIndex].plants];
    updatedPlants[plantIndex] = { ...updatedPlants[plantIndex], [field]: value };
    onLandChange(landIndex, "plants", updatedPlants);
  };

  const addPlantRow = (landIndex: number) => {
    const updatedPlants: PlantItem[] = [
      ...lands[landIndex].plants,
      {
        name: "",
        planting_date: "",
        current_phase: "Vegetatif",
        last_fertilizer_type: "",
        last_fertilizer_amount: "",
        last_phase: "",
      }
    ];
    onLandChange(landIndex, "plants", updatedPlants);
  };

  const removePlantRow = (landIndex: number, plantIndex: number) => {
    if (lands[landIndex].plants.length === 1) return;
    const updatedPlants = lands[landIndex].plants.filter((_, i) => i !== plantIndex);
    onLandChange(landIndex, "plants", updatedPlants);
  };

  return (
    <div className="border-t border-gray-100 pt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold text-[#0F7B4A] uppercase tracking-wider">
          2. Aset Lahan Pertanian & Vegetasi
        </h3>
        <button
          type="button"
          onClick={onAddRow}
          className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold transition-colors"
        >
          + Tambah Baris Lahan
        </button>
      </div>

      <div className="space-y-6">
        {lands.map((land, index) => (
          <div key={index} className="p-4 bg-gray-50/70 rounded-xl border border-gray-200 space-y-4 relative">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-700">Lahan #{index + 1}</span>
              {lands.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveRow(index)}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold"
                >
                  Hapus Lahan ✕
                </button>
              )}
            </div>

            {/* Parameter Utama Lahan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Nama Blok Lahan *</label>
                <input
                  type="text"
                  required
                  value={land.land_name}
                  onChange={(e) => onLandChange(index, "land_name", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="Misal: Sawah Kulon"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Luas Lahan *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={land.area}
                  onChange={(e) => onLandChange(index, "area", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Satuan Ukuran *</label>
                <select
                  value={land.unit}
                  onChange={(e) => onLandChange(index, "unit", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                >
                  <option value="Hektar(Ha)">Hektar (Ha)</option>
                  <option value="Meter Persegi(m2)">Meter Persegi (m2)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Status Kepemilikan *</label>
                <select
                  value={land.status}
                  onChange={(e) => onLandChange(index, "status", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                >
                  <option value="Milik Sendiri">Milik Sendiri</option>
                  <option value="Sewa">Sewa</option>
                  <option value="Bagi Hasil">Bagi Hasil</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            {/* Fisik Tanah & Irigasi */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Jenis Tanah</label>
                <input
                  type="text"
                  value={land.soil_type}
                  onChange={(e) => onLandChange(index, "soil_type", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="Misal: Aluvial / Lempung"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Penggunaan Saat Ini</label>
                <input
                  type="text"
                  value={land.current_use}
                  onChange={(e) => onLandChange(index, "current_use", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="Misal: Tumpang Sari"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Sumber Air</label>
                <input
                  type="text"
                  value={land.water_source}
                  onChange={(e) => onLandChange(index, "water_source", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="Misal: Sungai / Sumur Bor"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Tipe Irigasi</label>
                <input
                  type="text"
                  value={land.irrigation_type}
                  onChange={(e) => onLandChange(index, "irrigation_type", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="Misal: Irigasi Teknis"
                />
              </div>
            </div>

            {/* Dokumen & Alamat Lahan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Unggah Surat/Dokumen Kepemilikan</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => onLandChange(index, "ownership_document", e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-500 bg-white border border-gray-200 py-1 px-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Alamat Detail Lokasi Lahan</label>
                <input
                  type="text"
                  value={land.location_address}
                  onChange={(e) => onLandChange(index, "location_address", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="Nama Blok, Patokan, dsb."
                />
              </div>
            </div>

            {/* Wilayah Lahan Khusus */}
            <div className="pt-2 bg-white p-3 rounded-lg border border-gray-200">
              <span className="block text-xs font-bold text-gray-700 mb-1">
                Wilayah Administratif Lahan #{index + 1} (Dapat diubah bila berbeda dari domisili)
              </span>
              <RegionSelectSection
                provinceId={land.province_id}
                cityId={land.city_id}
                districtId={land.district_id}
                villageId={land.village_id}
                onChange={(field, val) => onLandChange(index, field, val)}
              />
            </div>

            {/* SUB-FORM: KOMODITAS TANAMAN PADA LAHAN INI */}
            <div className="bg-white p-3 rounded-lg border border-gray-200/70 mt-2 space-y-3">
              <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                <span className="text-[11px] font-bold text-emerald-800">Daftar Komoditas Tanaman di Blok Ini *</span>
                <button
                  type="button"
                  onClick={() => addPlantRow(index)}
                  className="text-[10px] bg-sky-50 text-sky-700 hover:bg-sky-100 px-2 py-1 rounded font-semibold transition-colors"
                >
                  + Tambah Jenis Tanaman
                </button>
              </div>

              {land.plants.map((plant, pIndex) => (
                <div key={pIndex} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* 1. Nama Tanaman */}
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Nama Komoditas *</label>
                      <input
                        type="text"
                        required
                        value={plant.name}
                        onChange={(e) => handlePlantChange(index, pIndex, "name", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded-md text-xs bg-white focus:outline-none"
                        placeholder="Misal: Padi / Jagung"
                      />
                    </div>

                    {/* 2. Tanggal Tanam */}
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Tanggal Tanam *</label>
                      <input
                        type="date"
                        required
                        value={plant.planting_date}
                        onChange={(e) => handlePlantChange(index, pIndex, "planting_date", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded-md text-xs bg-white focus:outline-none"
                      />
                    </div>

                    {/* 3. Fase Saat Ini */}
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Fase Saat Ini (current_phase)</label>
                      <select
                        value={plant.current_phase}
                        onChange={(e) => handlePlantChange(index, pIndex, "current_phase", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded-md text-xs bg-white focus:outline-none"
                      >
                        <option value="Pengolahan Lahan">Pengolahan Lahan</option>
                        <option value="Vegetatif">Vegetatif</option>
                        <option value="Generatif">Generatif</option>
                        <option value="Panen">Panen</option>
                        <option value="Pasca Panen">Pasca Panen</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                    {/* 4. Jenis Pupuk Terakhir */}
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Jenis Pupuk Terakhir</label>
                      <input
                        type="text"
                        value={plant.last_fertilizer_type}
                        onChange={(e) => handlePlantChange(index, pIndex, "last_fertilizer_type", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded-md text-xs bg-white focus:outline-none"
                        placeholder="Misal: NPK / Urea"
                      />
                    </div>

                    {/* 5. Jumlah Pupuk Terakhir */}
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Jumlah Pupuk Terakhir (Kg/L)</label>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={plant.last_fertilizer_amount}
                        onChange={(e) => handlePlantChange(index, pIndex, "last_fertilizer_amount", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded-md text-xs bg-white focus:outline-none"
                        placeholder="0"
                      />
                    </div>

                    {/* 6. Fase Sebelumnya & Tombol Hapus */}
                    <div className="flex items-center gap-1">
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Fase Sebelumnya (last_phase)</label>
                        <input
                          type="text"
                          value={plant.last_phase}
                          onChange={(e) => handlePlantChange(index, pIndex, "last_phase", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded-md text-xs bg-white focus:outline-none"
                          placeholder="Misal: Vegetatif"
                        />
                      </div>
                      {land.plants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlantRow(index, pIndex)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold pt-3 px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}