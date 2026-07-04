'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaWifi, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Navbar from '@/app/components/dashboard/Navbar';

// Import Komponen Hasil Pemisahan Modular
import ValidationFarmerList from '@/app/components/dashboard/land-validation/ValidationFarmerList';
import MapWorkspace from '@/app/components/dashboard/land-validation/MapWorkspace';
import ValidationForm from '@/app/components/dashboard/land-validation/ValidationForm';
import EmptyValidationState from '@/app/components/dashboard/land-validation/EmptyValidationState';

const initialFarmersData = [
  { id: 1, name: 'Bapak Slamet Riyadi', nik: '3271042011740003', commodity: 'Padi', status: 'Belum Mapping', phone: '08123456789' },
  { id: 2, name: 'Ibu Siti Aminah', nik: '3271045508820001', commodity: 'Jagung', status: 'Belum Mapping', phone: '08571234567' },
  { id: 3, name: 'Bapak Supardi', nik: '3271041203650002', commodity: 'Hortikultura', status: 'Tersimpan Lokal (Luring)', phone: '08998765432' },
  { id: 4, name: 'Bapak Ahmad Jaelani', nik: '3271040905790005', commodity: 'Padi', status: 'Belum Mapping', phone: '08211122334' },
];

export default function ValidasiLahanPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('Andi');
  const [farmers, setFarmers] = useState(initialFarmersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<typeof initialFarmersData[0] | null>(null);

  const [plantingDate, setPlantingDate] = useState('2026-11-20');
  const [areaHectares, setAreaHectares] = useState('1.5');

  useEffect(() => {
    const profile = localStorage.getItem('user_profile');
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.name) setAdminName(parsed.name);
    }
  }, []);

  const handleSaveMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmer) return;

    setFarmers(prev => prev.map(f => f.id === selectedFarmer.id ? { ...f, status: 'Tersimpan Lokal (Luring)' } : f));

    Swal.fire({
      icon: 'success',
      title: 'Data Validasi Spasial Disimpan!',
      text: `Lahan untuk ${selectedFarmer.name} berhasil direkam ke penyimpanan lokal (Offline-First).`,
      confirmButtonColor: '#15803d',
      customClass: { popup: 'rounded-2xl' }
    });

    setSelectedFarmer(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-800 antialiased font-sans pb-12">
      <Navbar adminName={adminName} handleLogout={() => router.push('/auth/login')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/dashboard/admin-lapangan')}
              className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-800 shadow-sm transition"
            >
              <FaArrowLeft className="text-sm" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">Validasi Lahan Geospasial</h1>
              <p className="text-xs text-zinc-500 font-medium">Lakukan pemetaan poligon fisik lahan dan konfirmasi profil petani</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-center shadow-sm">
            <FaWifi />
            <span>Mode Sinkronisasi Luring Aktif</span>
          </div>
        </div>

        {/* Layout Grid Component Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel Kiri: List Petani */}
          <div className="lg:col-span-5">
            <ValidationFarmerList 
              farmers={farmers}
              selectedFarmer={selectedFarmer}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSelectFarmer={(farmer) => setSelectedFarmer(farmer)}
            />
          </div>

          {/* Panel Kanan: Workspace & Form */}
          <div className="lg:col-span-7">
            {selectedFarmer ? (
              <div className="space-y-6">
                <MapWorkspace />
                <ValidationForm 
                  selectedFarmer={selectedFarmer}
                  areaHectares={areaHectares}
                  setAreaHectares={setAreaHectares}
                  plantingDate={plantingDate}
                  setPlantingDate={setPlantingDate}
                  onSubmit={handleSaveMapping}
                  onCancel={() => setSelectedFarmer(null)}
                />
              </div>
            ) : (
              <EmptyValidationState />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}