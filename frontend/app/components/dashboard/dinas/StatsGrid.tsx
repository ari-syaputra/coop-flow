"use client";

import React from "react";
import {
  HiUsers,
  HiMap,
  HiHomeModern,
  HiDocumentText,
  HiArrowTrendingUp,
} from "react-icons/hi2";

interface StatsGridProps {
  metrics?: {
    total_petani: number;
    jumlah_lahan: number;
    koperasi_aktif: number;
    total_pengajuan: number;
    trends: {
      total_petani: number;
      jumlah_lahan: number;
      koperasi_aktif: number;
      total_pengajuan: number;
    };
  };
}

export default function StatsGrid({ metrics }: StatsGridProps) {
  const cards = [
    {
      name: "Total Petani",
      value: metrics?.total_petani ?? 0,
      trend: metrics?.trends?.total_petani ?? 0,
      unit: "Petani",
      icon: HiUsers,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Jumlah Lahan",
      value: metrics?.jumlah_lahan ?? 0,
      trend: metrics?.trends?.jumlah_lahan ?? 0,
      unit: "Lahan",
      icon: HiMap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      name: "Koperasi Aktif",
      value: metrics?.koperasi_aktif ?? 0,
      trend: metrics?.trends?.koperasi_aktif ?? 0,
      unit: "Koperasi",
      icon: HiHomeModern,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      name: "Total Pengajuan",
      value: metrics?.total_pengajuan ?? 0,
      trend: metrics?.trends?.total_pengajuan ?? 0,
      unit: "Pengajuan",
      icon: HiDocumentText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition"
        >
          {/* Wadah Ikon: Berukuran w-14 h-14, terkunci di sebelah kiri (shrink-0) */}
          <div
            className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${c.bg} ${c.color}`}
          >
            <c.icon className="text-2xl" />
          </div>

          {/* Konten Teks & Statistik di Sebelah Kanan Ikon */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider truncate">
              {c.name}
            </p>
            <div className="flex items-baseline justify-between mt-1 gap-1">
              <p className="text-xl font-black text-zinc-900 truncate">
                {c.value.toLocaleString()}{" "}
                <span className="text-xs font-normal text-zinc-500">
                  {c.unit}
                </span>
              </p>
              {c.trend > 0 && (
                <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                  <HiArrowTrendingUp className="mr-0.5" /> {c.trend}%
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
