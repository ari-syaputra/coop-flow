"use client";

import React from "react";

interface FilterAnggotaProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (val: boolean) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  wilayahFilter: string;
  setWilayahFilter: (val: string) => void;
  kelompokFilter: string;
  setKelompokFilter: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  availRegions: string[];
  availGroups: string[];
  onResetFilters: () => void;
  onAddFarmer: () => void; // Aksi ketika tombol Tambah Petani diklik
}

export default function FilterAnggota({
  searchTerm,
  setSearchTerm,
  isFilterOpen,
  setIsFilterOpen,
  statusFilter,
  setStatusFilter,
  wilayahFilter,
  setWilayahFilter,
  kelompokFilter,
  setKelompokFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  availRegions,
  availGroups,
  onResetFilters,
  onAddFarmer,
}: FilterAnggotaProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4">
      {/* Row 1: Search Bar, Filter Toggle & Tombol Tambah Petani */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari nama atau NIK petani...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          {/* Tombol Filter */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
              isFilterOpen
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-medium"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.24 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
            Filter
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-3 h-3 transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {/* Tombol Tambah Petani */}
          <button
            onClick={onAddFarmer}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F7B4A] hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Petani
          </button>
        </div>
      </div>

      {/* Kondisional Render Panel Filter */}
      {isFilterOpen && (
        <div className="pt-4 border-t border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Dropdown Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Status Validasi
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option>Semua Status</option>
                <option>Aktif</option>
                <option>Pending</option>
                <option>Ditolak</option>
              </select>
            </div>

            {/* Dropdown Wilayah */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Wilayah
              </label>
              <select
                value={wilayahFilter}
                onChange={(e) => setWilayahFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option>Semua Wilayah</option>
                {availRegions.map((reg, idx) => (
                  <option key={idx} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown Kelompok Tani */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Kelompok Tani
              </label>
              <select
                value={kelompokFilter}
                onChange={(e) => setKelompokFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option>Semua Kelompok Tani</option>
                {availGroups.map((grp, idx) => (
                  <option key={idx} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal Mulai */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Tanggal Selesai */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onResetFilters}
              className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}