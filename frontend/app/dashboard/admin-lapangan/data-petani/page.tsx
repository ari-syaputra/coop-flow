'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaWifi, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Navbar from '@/app/components/dashboard/Navbar';
import api from '../../../lib/axios'; 

// Import komponen-komponen terpisah
import FarmerList from '@/app/components/dashboard/farmers/FarmerList';
import FarmerForm from '@/app/components/dashboard/farmers/FarmerForm';
import EmptyState from '@/app/components/dashboard/farmers/EmptyState';

export default function DataPetaniPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('Andi');
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // 1. SESUAIKAN: State Form Data sekarang menyertakan array lands
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    farmer_group: 'Kelompok Tani Makmur A',
    nik: '',
    notes: '',
    lands: [{ land_name: '', area: 0, location_address: '' }] // Baris default awal
  });

  // Konfigurasi reusable untuk Toast Kanan Atas
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  // Fetch semua data petani dari Backend Laravel via Docker
  const fetchFarmers = async () => {
    try {
      const response = await api.get('/farmers');
      if (response.data.success) {
        setFarmers(response.data.data);
      }
    } catch (error) {
      console.error("Gagal memuat data petani", error);
    }
  };

  useEffect(() => {
    const profile = localStorage.getItem('user_profile');
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.name) setAdminName(parsed.name);
    }
    fetchFarmers();
  }, []);

  // 2. SESUAIKAN: Fungsi saat baris petani dipilih (Membawa data lands dari database)
  const handleSelectFarmer = (farmer: any) => {
    setIsAdding(false);
    setSelectedFarmer(farmer);
    setFormData({
      name: farmer.user?.name || '',
      email: farmer.user?.email || '',
      phone: farmer.user?.phone || '',
      address: farmer.user?.address || '',
      farmer_group: farmer.farmer_group,
      nik: farmer.nik,
      notes: farmer.notes || '',
      // Map data lands jika ada, jika kosong sediakan 1 template inputan
      lands: farmer.lands && farmer.lands.length > 0 
        ? farmer.lands.map((l: any) => ({
            land_name: l.land_name,
            area: parseFloat(l.area) || 0,
            location_address: l.location_address || ''
          }))
        : [{ land_name: '', area: 0, location_address: '' }]
    });
  };

  // 3. SESUAIKAN: Reset form data ke kondisi awal saat klik tambah baru
  const handleInitAdd = () => {
    setSelectedFarmer(null);
    setIsAdding(true);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      address: '', 
      farmer_group: 'Kelompok Tani Makmur A', 
      nik: '', 
      notes: '',
      lands: [{ land_name: '', area: 0, location_address: '' }] // Reset ke 1 baris kosong
    });
  };

  const handleSaveFarmer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.nik.length !== 16) {
      Toast.fire({ icon: 'error', title: 'Format NIK Salah. Harus 16 digit!' });
      return;
    }

    try {
      if (isAdding) {
        const payload = { ...formData, password: 'password123' };
        await api.post('/farmers', payload);
        Toast.fire({ icon: 'success', title: 'Petani baru didaftarkan!' });
      } else if (selectedFarmer) {
        await api.put(`/farmers/${selectedFarmer.id}`, formData);
        Toast.fire({ icon: 'success', title: 'Profil petani diperbarui!' });
      }

      setIsAdding(false);
      setSelectedFarmer(null);
      fetchFarmers(); 
    } catch (error: any) {
      const msg = error.response?.data 
        ? Object.values(error.response.data).join(', ') 
        : 'Terjadi kesalahan sistem.';
      Toast.fire({ icon: 'error', title: msg });
    }
  };

  const handleDeleteFarmer = async () => {
    if (!selectedFarmer) return;

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data master petani akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#71717a',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/farmers/${selectedFarmer.id}`);
          Toast.fire({ icon: 'success', title: 'Data petani telah dibuang.' });
          setSelectedFarmer(null);
          fetchFarmers();
        } catch (error) {
          Toast.fire({ icon: 'error', title: 'Gagal menghapus data.' });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-800 antialiased font-sans pb-12">
      <Navbar adminName={adminName} handleLogout={() => router.push('/auth/login')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/admin-lapangan"
              className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-800 shadow-sm transition flex items-center justify-center"
            >
              <FaArrowLeft className="text-sm" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">Manajemen Data Petani</h1>
              <p className="text-xs text-zinc-500 font-medium">Integrasi Real-Time dengan Database Master Docker Backend</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-center shadow-sm">
            <FaWifi />
            <span>Koneksi Server Aktif</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <FarmerList 
              farmers={farmers}
              selectedFarmer={selectedFarmer}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSelectFarmer={handleSelectFarmer}
              onInitAdd={handleInitAdd}
            />
          </div>

          <div className="lg:col-span-7">
            {isAdding || selectedFarmer ? (
              <FarmerForm 
                isAdding={isAdding}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSaveFarmer}
                onCancel={() => { setSelectedFarmer(null); setIsAdding(false); }}
                onDelete={handleDeleteFarmer}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}