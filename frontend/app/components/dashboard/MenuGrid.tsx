'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaMapMarkerAlt, FaUserAlt, FaSeedling, FaBoxOpen, 
  FaCloudDownloadAlt, FaClipboardList, FaBell, FaChartBar, FaChevronRight 
} from 'react-icons/fa';

export default function MenuGrid() {
  const menuItems = [
    { title: 'Validasi Lahan', desc: 'Verifikasi dan petakan lahan petani', icon: FaMapMarkerAlt, color: 'bg-green-50 text-green-600', href: '/dashboard/admin-lapangan/validasi-lahan' },
    { title: 'Data Petani', desc: 'Kelola data dan profil petani anggota', icon: FaUserAlt, color: 'bg-blue-50 text-blue-600', href: '/dashboard/admin-lapangan/data-petani' },
    { title: 'Kalender Tanam', desc: 'Lihat jadwal tanam petani', icon: FaSeedling, color: 'bg-emerald-50 text-emerald-600', href: '#' },
    { title: 'Data Tanaman', desc: 'Kelola jenis komoditas dan varietas', icon: FaBoxOpen, color: 'bg-orange-50 text-orange-600', href: '/dashboard/admin-lapangan/data-tanaman' },
    { title: 'Sinkronisasi Offline', desc: 'Kirim data yang tersimpan secara offline', icon: FaCloudDownloadAlt, color: 'bg-indigo-50 text-indigo-600', href: '#' },
    { title: 'Riwayat Aktivitas', desc: 'Lihat semua aktivitas lapangan', icon: FaClipboardList, color: 'bg-cyan-50 text-cyan-600', href: '#' },
    { title: 'Notifikasi', desc: 'Informasi penting dan pengingat tugas', icon: FaBell, color: 'bg-pink-50 text-pink-600', href: '#' },
    { title: 'Ringkasan', desc: 'Laporan singkat aktivitas dan progres', icon: FaChartBar, color: 'bg-amber-50 text-amber-600', href: '#' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {menuItems.map((item, i) => {
        const Icon = item.icon;
        const CardContent = (
          <>
            <div className="flex items-start justify-between w-full">
              <div className={`p-3.5 rounded-xl ${item.color}`}>
                <Icon className="text-2xl" />
              </div>
              <div className="h-7 w-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:border-green-500 group-hover:bg-green-50 group-hover:text-green-600 transition text-[11px]">
                <FaChevronRight />
              </div>
            </div>
            <div className="mt-5 space-y-1">
              <h3 className="text-base font-bold text-zinc-800 tracking-tight">{item.title}</h3>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </>
        );

        return (
          <Link href={item.href} key={i} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-zinc-200 transition group cursor-pointer">
            {CardContent}
          </Link>
        );
      })}
    </div>
  );
}