'use client';

import React from 'react';
import { FaSearch, FaUserAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface Farmer {
  id: number;
  name: string;
  nik: string;
  commodity: string;
  status: string;
  phone: string;
}

interface ValidationFarmerListProps {
  farmers: Farmer[];
  selectedFarmer: Farmer | null;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSelectFarmer: (farmer: Farmer) => void;
}

export default function ValidationFarmerList({
  farmers,
  selectedFarmer,
  searchTerm,
  setSearchTerm,
  onSelectFarmer
}: ValidationFarmerListProps) {
  
  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.nik.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm space-y-3">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-3.5 text-zinc-400 text-sm" />
          <input
            type="text"
            placeholder="Cari nama petani atau NIK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition"
          />
        </div>
      </div>

      {/* List Items */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {filteredFarmers.map((farmer) => (
          <div 
            key={farmer.id}
            className={`bg-white p-4 rounded-2xl border transition flex flex-col justify-between gap-4 shadow-sm ${
              selectedFarmer?.id === farmer.id ? 'border-green-500 ring-1 ring-green-500' : 'border-zinc-100 hover:border-zinc-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-zinc-50 text-zinc-500 rounded-xl mt-0.5">
                <FaUserAlt className="text-sm" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-zinc-800">{farmer.name}</h3>
                <p className="text-xs text-zinc-400 font-medium">NIK: {farmer.nik}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md text-[10px] font-bold tracking-wide">
                    {farmer.commodity}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    farmer.status.includes('Tersimpan') ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {farmer.status}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onSelectFarmer(farmer)}
              className="w-full py-2 bg-[#f8fafc] border border-zinc-200 hover:bg-green-600 hover:text-white hover:border-green-600 rounded-xl text-xs font-bold text-zinc-700 transition flex items-center justify-center gap-2"
            >
              <FaMapMarkerAlt />
              {farmer.status.includes('Tersimpan') ? 'Petakan Ulang Lahan' : 'Mulai Pemetaan Spasial'}
            </button>
          </div>
        ))}
        
        {filteredFarmers.length === 0 && (
          <p className="text-center text-sm text-zinc-400 py-6 font-medium">Tidak ada data petani ditemukan.</p>
        )}
      </div>
    </div>
  );
}