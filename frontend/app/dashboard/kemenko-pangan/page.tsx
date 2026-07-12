"use client";

import React from "react";
import { 
  FaUsers, 
  FaClock, 
  FaWarehouse, 
  FaSeedling, 
  FaSearch, 
  FaFilter,
  FaCheckCircle
} from "react-icons/fa";

export default function KemenkoPanganDashboard() {
  // Data dummy untuk antrean aktivasi (Pending Activation) sesuai gambar
  const pendingCooperatives = [
    { id: 1, name: "Koperasi Tani Makmur Jaya", code: "KOP-2025-0512-0012", region: "Jawa Tengah / Klaten", date: "20 Mei 2025 10:24" },
    { id: 2, name: "Koperasi Sejahtera Bersama", code: "KOP-2025-0512-0013", region: "Jawa Timur / Jember", date: "20 Mei 2025 09:18" },
    { id: 3, name: "Koperasi Tani Subur Abadi", code: "KOP-2025-0511-0011", region: "Sulawesi Selatan / Gowa", date: "19 Mei 2025 16:45" },
    { id: 4, name: "Koperasi Harapan Petani", code: "KOP-2025-0511-0010", region: "Lampung / Lampung Tengah", date: "19 Mei 2025 14:11" },
    { id: 5, name: "Koperasi Maju Bersama", code: "KOP-2025-0510-0009", region: "Nusa Tenggara Barat / Lombok Timur", date: "18 Mei 2025 11:32" },
  ];

  // Data dummy untuk direktori master koperasi sesuai gambar
  const masterCooperatives = [
    { id: "KOP-0001", name: "Koperasi Tani Sejahtera", code: "KOP-1001", location: "Jawa Barat / Bandung", users: 256, warehouses: 8, status: "Active" },
    { id: "KOP-0002", name: "Koperasi Makmur Abadi", code: "KOP-1002", location: "Jawa Tengah / Semarang", users: 187, warehouses: 6, status: "Active" },
    { id: "KOP-0003", name: "Koperasi Tani Subur", code: "KOP-1003", location: "Jawa Timur / Malang", users: 342, warehouses: 10, status: "Active" },
    { id: "KOP-0004", name: "Koperasi Sumber Rejeki", code: "KOP-1004", location: "Sulawesi Selatan / Maros", users: 198, warehouses: 5, status: "Active" },
    { id: "KOP-0005", name: "Koperasi Harapan Baru", code: "KOP-1005", location: "Sumatera Utara / Deli Serdang", users: 221, warehouses: 7, status: "Active" },
  ];

  return (
    <div className="w-full font-sans text-slate-800">
      {/* HEADER SECTION: Menampilkan info Periode Data secara simetris */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Ringkasan Eksekutif</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pusat pemantauan berkas registrasi kuota pupuk subsidi nasional</p>
        </div>
        
        {/* Periode Data Dropdown */}
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-3 text-xs font-medium">
          <span className="text-slate-400">Periode Data</span>
          <span className="text-slate-700 font-bold">Mei 2025</span>
        </div>
      </header>

      {/* 4 STATISTIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xl"><FaUsers /></div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Registered Cooperatives</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">1,240</h3>
            <p className="text-[10px] text-emerald-600 font-medium mt-1">&uarr; 8.5% <span className="text-slate-400 font-normal">dari bulan lalu</span></p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl text-xl"><FaClock /></div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Activation Requests</p>
            <div className="flex items-center space-x-2 mt-0.5">
              <h3 className="text-xl font-black text-slate-900">12</h3>
              <span className="text-[9px] bg-red-50 text-red-600 font-extrabold高度 px-1.5 py-0.5 rounded uppercase">Needs Action</span>
            </div>
            <p className="text-[10px] text-amber-600 font-medium mt-1">&uarr; 2 <span className="text-slate-400 font-normal">dari minggu lalu</span></p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xl"><FaWarehouse /></div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Active Warehouses</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">3,450</h3>
            <p className="text-[10px] text-blue-600 font-medium mt-1">&uarr; 5.2% <span className="text-slate-400 font-normal">dari bulan lalu</span></p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex items-center space-x-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl text-xl"><FaSeedling /></div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cumulative Fertilizer Distributed</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">450,000 <span className="text-xs font-normal text-slate-500">Tons</span></h3>
            <p className="text-[10px] text-emerald-600 font-medium mt-1">&uarr; 12.7% <span className="text-slate-400 font-normal">dari bulan lalu</span></p>
          </div>
        </div>
      </div>

      {/* SECTION 1: PENDING ACTIVATION QUEUE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center text-xs font-bold">📋</div>
            <h2 className="text-sm font-bold text-slate-800">Cooperative Registration Queue (Pending Activation)</h2>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition">Lihat semua</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-4 font-semibold w-12">No.</th>
                <th className="py-3 px-4 font-semibold">Cooperative Name</th>
                <th className="py-3 px-4 font-semibold">Unique Code</th>
                <th className="py-3 px-4 font-semibold">Province / Regency</th>
                <th className="py-3 px-4 font-semibold">Date Submitted</th>
                <th className="py-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pendingCooperatives.map((coop, index) => (
                <tr key={coop.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-400">{index + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{coop.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{coop.code}</td>
                  <td className="py-3.5 px-4 text-slate-600">{coop.region}</td>
                  <td className="py-3.5 px-4 text-slate-500">{coop.date}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button className="bg-[#107349] hover:bg-emerald-800 text-white font-semibold px-4 py-1.5 rounded-lg inline-flex items-center space-x-1.5 shadow-sm transition text-[11px] focus:outline-none">
                      <FaCheckCircle className="text-[10px]" />
                      <span>Activate & Generate Account</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: MASTER COOPERATIVES DIRECTORY */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-xs font-bold">🏢</div>
            <h2 className="text-sm font-bold text-slate-800">Master Cooperatives Directory (Active)</h2>
          </div>

          {/* Search & Filter bar */}
          <div className="flex items-center space-x-2 text-xs">
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari koperasi, kode, atau lokasi..." 
                className="pl-8 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
              />
            </div>
            <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 font-medium transition">
              <FaFilter className="text-[10px]" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-4 font-semibold w-12">No.</th>
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Cooperative Name</th>
                <th className="py-3 px-4 font-semibold">Code</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold text-center">Total Users</th>
                <th className="py-3 px-4 font-semibold text-center">Active Warehouses</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {masterCooperatives.map((coop, index) => (
                <tr key={coop.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-400">{index + 1}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{coop.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{coop.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{coop.code}</td>
                  <td className="py-3.5 px-4 text-slate-600">{coop.location}</td>
                  <td className="py-3.5 px-4 text-center font-semibold">{coop.users}</td>
                  <td className="py-3.5 px-4 text-center font-semibold">{coop.warehouses}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                      {coop.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-lg inline-flex items-center space-x-1 shadow-sm transition text-[11px]">
                      <span>View Detail</span>
                      <span className="text-[10px] text-slate-400">&raquo;</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}