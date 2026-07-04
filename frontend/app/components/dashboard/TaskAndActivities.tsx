'use client';

import React from 'react';
import { FaChevronRight, FaMapMarkerAlt, FaUserAlt, FaCloudDownloadAlt, FaBoxOpen } from 'react-icons/fa';

export default function TaskAndActivities() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* 1. Tugas Hari Ini */}
      <div className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm lg:col-span-3 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-800">Tugas Hari Ini</h3>
            <button className="text-xs font-bold text-green-600 hover:underline">Lihat semua</button>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { count: 5, label: 'Lahan perlu diverifikasi', desc: 'Belum diverifikasi', color: 'bg-green-50 text-green-700' },
              { count: 12, label: 'Petani belum sinkron', desc: 'Data belum dikirim', color: 'bg-orange-50 text-orange-700' },
              { count: 8, label: 'Stok hampir habis', desc: '3 wilayah', color: 'bg-blue-50 text-blue-700' },
              { count: 2, label: 'Notifikasi distribusi', desc: 'Perlu perhatian', color: 'bg-pink-50 text-pink-700' },
            ].map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 transition cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center ${task.color}`}>
                    {task.count}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-zinc-800">{task.label}</p>
                    <p className="text-[10px] text-zinc-400">{task.desc}</p>
                  </div>
                </div>
                <FaChevronRight className="text-[10px] text-zinc-300 group-hover:text-zinc-500 transition" />
              </div>
            ))}
          </div>
        </div>
        <button className="w-full py-2.5 bg-green-50 text-green-700 font-bold text-xs rounded-xl hover:bg-green-100 transition mt-4">
          Lihat semua tugas
        </button>
      </div>

      {/* 2. Aktivitas Terbaru */}
      <div className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm lg:col-span-4">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-800">Aktivitas Terbaru</h3>
          <button className="text-xs font-bold text-green-600 hover:underline">Lihat semua</button>
        </div>
        <div className="mt-4 space-y-4">
          {[
            { label: 'Lahan Sawah Blok A diverifikasi', loc: 'Desa Sukamaju', time: '10 menit lalu', icon: FaMapMarkerAlt, iconBg: 'bg-green-50 text-green-600' },
            { label: 'Data petani Budi Santoso diperbarui', loc: 'Desa Sukamaju', time: '25 menit lalu', icon: FaUserAlt, iconBg: 'bg-blue-50 text-blue-600' },
            { label: 'Sinkronisasi data berhasil', loc: '12 data terkirim', time: '1 jam lalu', icon: FaCloudDownloadAlt, iconBg: 'bg-indigo-50 text-indigo-600' },
            { label: 'Lahan Sawah Blok B ditambahkan', loc: 'Desa Sukamaju', time: '2 jam lalu', icon: FaMapMarkerAlt, iconBg: 'bg-green-50 text-green-600' },
            { label: 'Foto lahan diunggah', loc: 'Lahan Sawah Blok C', time: '2 jam lalu', icon: FaBoxOpen, iconBg: 'bg-orange-50 text-orange-600' },
          ].map((act, idx) => (
            <div key={idx} className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg mt-0.5 ${act.iconBg}`}>
                  <act.icon className="text-xs" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800 leading-tight">{act.label}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{act.loc}</p>
                </div>
              </div>
              <span className="text-[10px] text-zinc-400 whitespace-nowrap">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Peta Spasial GIS Terkini */}
      <div className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm lg:col-span-5 flex flex-col">
        <div className="flex justify-between items-center pb-4">
          <h3 className="text-sm font-bold text-zinc-800">Peta Lahan Terbaru</h3>
          <button className="text-xs font-bold text-green-600 hover:underline">Lihat peta penuh</button>
        </div>
        
        <div className="flex-1 min-h-[220px] rounded-2xl relative overflow-hidden bg-zinc-100 border border-zinc-200 shadow-inner">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80" 
            alt="Satelit GIS Map" 
            className="w-full h-full object-cover filter brightness-90 saturate-120"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur rounded-xl shadow border border-zinc-200 flex flex-col p-1 space-y-1">
            <button className="w-7 h-7 text-xs font-bold text-zinc-700 hover:bg-zinc-100 rounded-lg flex items-center justify-center">+</button>
            <button className="w-7 h-7 text-xs font-bold text-zinc-700 hover:bg-zinc-100 rounded-lg flex items-center justify-center">-</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-100 text-center">
          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
              <span className="text-[11px] font-bold text-zinc-700">Terverifikasi</span>
            </div>
            <p className="text-xs font-medium text-zinc-400 pl-4 mt-0.5">28 Lahan</p>
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="text-[11px] font-bold text-zinc-700">Menunggu</span>
            </div>
            <p className="text-xs font-medium text-zinc-400 pl-4 mt-0.5">5 Lahan</p>
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span className="text-[11px] font-bold text-zinc-700">Dalam Proses</span>
            </div>
            <p className="text-xs font-medium text-zinc-400 pl-4 mt-0.5">3 Lahan</p>
          </div>
        </div>
      </div>

    </div>
  );
}