'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSearch, FaPlus, FaSeedling, FaWifi, FaArrowLeft, FaBoxOpen, FaUserAlt, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Navbar from '@/app/components/dashboard/Navbar';

// Mockup Data Petani (diambil dari database lokal)
const initialFarmersList = [
  { id: 1, name: 'Bapak Slamet Riyadi', group: 'Kelompok Tani Makmur A' },
  { id: 2, name: 'Ibu Siti Aminah', group: 'Kelompok Tani Makmur A' },
  { id: 3, name: 'Bapak Supardi', group: 'Kelompok Tani Rejeki' },
];

// Mockup Relasi: Daftar Tanaman yang digarap per ID Petani
const initialFarmerPlants = [
  { id: 101, farmerId: 1, name: 'Padi Ciherang', category: 'Pangan', area: '1.2 Ha', estimateHarvest: 'Oktober 2026', status: 'Fase Vegetatif' },
  { id: 102, farmerId: 1, name: 'Cabai Rawit Dewata', category: 'Hortikultura', area: '0.3 Ha', estimateHarvest: 'Agustus 2026', status: 'Siap Panen' },
  { id: 103, farmerId: 2, name: 'Jagung Hibrida Pioneer', category: 'Pangan', area: '2.0 Ha', estimateHarvest: 'November 2026', status: 'Baru Tanam' },
];

export default function DataTanamanPetaniPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('Andi');
  const [farmers] = useState(initialFarmersList);
  const [farmerPlants, setFarmerPlants] = useState(initialFarmerPlants);
  
  const [searchFarmer, setSearchFarmer] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<typeof initialFarmersList[0] | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // State Form Input Garapan Tanaman Baru
  const [formData, setFormData] = useState({
    name: 'Padi Ciherang',
    category: 'Pangan',
    area: '',
    estimateHarvest: '',
    status: 'Baru Tanam'
  });

  useEffect(() => {
    const profile = localStorage.getItem('user_profile');
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.name) setAdminName(parsed.name);
    }
  }, []);

  // Filter list petani berdasarkan input pencarian
  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(searchFarmer.toLowerCase())
  );

  // Ambil daftar tanaman khusus untuk petani yang sedang aktif dipilih
  const activePlants = farmerPlants.filter(p => p.farmerId === selectedFarmer?.id);

  const handleSelectFarmer = (farmer: typeof initialFarmersList[0]) => {
    setSelectedFarmer(farmer);
    setIsAdding(false);
  };

  const handleSavePlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmer) return;

    const newPlant = {
      id: Date.now(),
      farmerId: selectedFarmer.id,
      ...formData
    };

    setFarmerPlants(prev => [...prev, newPlant]);
    setIsAdding(false);

    Swal.fire({
      icon: 'success',
      title: 'Komoditas Terikat!',
      text: `Berhasil menambahkan komoditas tanaman untuk ${selectedFarmer.name} secara lokal.`,
      confirmButtonColor: '#10b981',
      customClass: { popup: 'rounded-2xl' }
    });
  };

  const handleDeletePlant = (id: number) => {
    Swal.fire({
      title: 'Hapus data tanaman?',
      text: "Data komoditas terpilih akan dihapus dari plot garapan petani ini.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#d4d4d8',
      confirmButtonText: 'Ya, Hapus'
    }).then((result) => {
      if (result.isConfirmed) {
        setFarmerPlants(prev => prev.filter(p => p.id !== id));
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-800 antialiased font-sans pb-12">
      {/* Navbar */}
      <Navbar adminName={adminName} handleLogout={() => router.push('/auth/login')} />

      {/* Konten Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/admin-lapangan"
              className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-800 shadow-sm transition flex items-center justify-center"
            >
              <FaArrowLeft className="text-sm" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">Komoditas & Data Tanaman Petani</h1>
              <p className="text-xs text-zinc-500 font-medium">Pencatatan jenis varietas tanaman aktif per komoditas garapan petani</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-center shadow-sm">
            <FaWifi />
            <span>Mode Relasi Offline Aktif</span>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel Kiri: Pilih Petani Terlebih Dahulu */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm space-y-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Langkah 1: Pilih Petani</span>
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-3.5 text-zinc-400 text-sm" />
                <input
                  type="text"
                  placeholder="Cari nama petani..."
                  value={searchFarmer}
                  onChange={(e) => setSearchFarmer(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition"
                />
              </div>
            </div>

            {/* List Loop Petani */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredFarmers.map((farmer) => (
                <div 
                  key={farmer.id}
                  onClick={() => handleSelectFarmer(farmer)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between shadow-sm bg-white ${
                    selectedFarmer?.id === farmer.id ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-zinc-100 hover:border-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl text-sm ${selectedFarmer?.id === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-400'}`}>
                      <FaUserAlt />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-800">{farmer.name}</h4>
                      <p className="text-xs text-zinc-400 font-medium">{farmer.group}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel Kanan: Workspace Tanaman Petani Terpilih */}
          <div className="lg:col-span-8">
            {selectedFarmer ? (
              <div className="space-y-4">
                
                {/* Header Profile Petani Aktif */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Petani Terpilih</span>
                    <h2 className="text-lg font-extrabold text-zinc-800 mt-1">{selectedFarmer.name}</h2>
                    <p className="text-xs text-zinc-400 font-medium">{selectedFarmer.group}</p>
                  </div>
                  {!isAdding && (
                    <button
                      onClick={() => {
                        setIsAdding(true);
                        setFormData({ name: 'Padi Ciherang', category: 'Pangan', area: '', estimateHarvest: '', status: 'Baru Tanam' });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
                    >
                      <FaPlus />
                      <span>Tambah Tanaman</span>
                    </button>
                  )}
                </div>

                {/* Form Input Komoditas Baru */}
                {isAdding ? (
                  <div className="bg-white p-6 rounded-2xl border border-emerald-500/3xl shadow-md space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-sm font-bold text-zinc-800 border-b border-zinc-100 pb-2">Catat Varietas Komoditas Baru</h3>
                    <form onSubmit={handleSavePlant} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Pilih Varietas</label>
                          <select 
                            value={formData.name}
                            onChange={(e) => {
                              const cat = e.target.value.includes('Cabai') || e.target.value.includes('Bawang') ? 'Hortikultura' : 'Pangan';
                              setFormData({...formData, name: e.target.value, category: cat});
                            }}
                            className="w-full border border-zinc-200 rounded-xl p-2.5 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option>Padi Ciherang</option>
                            <option>Jagung Hibrida Pioneer</option>
                            <option>Cabai Rawit Dewata</option>
                            <option>Bawang Merah Bima Brebes</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Luas Lahan Garapan</label>
                          <input 
                            type="text" required placeholder="Contoh: 1.5 Ha"
                            value={formData.area}
                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                            className="w-full border border-zinc-200 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Perkiraan Bulan Panen</label>
                          <input 
                            type="text" required placeholder="Contoh: September 2026"
                            value={formData.estimateHarvest}
                            onChange={(e) => setFormData({...formData, estimateHarvest: e.target.value})}
                            className="w-full border border-zinc-200 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Kondisi Tanam Saat Ini</label>
                          <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full border border-zinc-200 rounded-xl p-2.5 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option>Baru Tanam</option>
                            <option>Fase Vegetatif</option>
                            <option>Fase Generatif</option>
                            <option>Siap Panen</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          type="button" onClick={() => setIsAdding(false)}
                          className="px-4 py-2 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-50 transition"
                        >
                          Batal
                        </button>
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Simpan secara Luring
                        </button>
                      </div>
                    </form>
                  </div>
                ) : null}

                {/* Grid Tanaman yang Sedang Digarap */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activePlants.map((plant) => (
                    <div key={plant.id} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm relative flex flex-col justify-between gap-4 group">
                      <button 
                        onClick={() => handleDeletePlant(plant.id)}
                        className="absolute top-4 right-4 p-1.5 text-zinc-300 hover:text-rose-600 rounded-lg transition"
                        title="Hapus komoditas"
                      >
                        <FaTrash className="text-xs" />
                      </button>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs">
                            <FaSeedling />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-zinc-800">{plant.name}</h3>
                            <p className="text-[11px] text-zinc-400 font-medium">Kategori: {plant.category}</p>
                          </div>
                        </div>

                        <div className="border-t border-zinc-50 pt-2 grid grid-cols-2 gap-2 text-xs font-medium text-zinc-500">
                          <div>
                            <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Luas Area</span>
                            <span className="text-zinc-700 font-semibold">{plant.area}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Estimasi Panen</span>
                            <span className="text-zinc-700 font-semibold flex items-center gap-1">
                              <FaCalendarAlt className="text-[10px] text-zinc-400" />
                              {plant.estimateHarvest}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl">
                        <span className="text-[11px] font-bold text-zinc-500">Status Lahan</span>
                        <span className="text-[11px] font-extrabold text-emerald-700">{plant.status}</span>
                      </div>
                    </div>
                  ))}

                  {activePlants.length === 0 && !isAdding && (
                    <div className="sm:col-span-2 text-center py-12 bg-white rounded-2xl border border-zinc-100">
                      <p className="text-sm text-zinc-400 font-medium">Petani ini belum memiliki daftar komoditas aktif.</p>
                      <button 
                        onClick={() => setIsAdding(true)}
                        className="text-xs font-bold text-emerald-600 mt-1 hover:underline"
                      >
                        Tambah komoditas sekarang
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* Kondisi Belum Memilih Petani */
              <div className="bg-white border border-dashed border-zinc-200 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px] shadow-sm">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-4 shadow-inner">
                  <FaBoxOpen className="text-3xl" />
                </div>
                <h3 className="text-base font-extrabold text-zinc-800 tracking-tight">Belum Ada Petani Terpilih</h3>
                <p className="text-sm text-zinc-400 font-medium max-w-sm mt-1 leading-relaxed">
                  Silakan cari dan pilih nama petani di panel sebelah kiri terlebih dahulu untuk melihat atau memperbarui jenis tanaman yang mereka garap.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}