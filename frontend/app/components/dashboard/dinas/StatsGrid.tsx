"use client";

import React from "react";
import { HiUsers, HiMap, HiHomeModern, HiDocumentText, HiArrowTrendingUp } from "react-icons/hi2";

interface StatsGridProps {
  metrics: {
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
    { name: "Total Petani", value: metrics.total_petani, trend: metrics.trends.total_petani, unit: "Petani", icon: HiUsers, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Jumlah Lahan", value: metrics.jumlah_lahan, trend: metrics.trends.jumlah_lahan, unit: "Lahan", icon: HiMap, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Koperasi Aktif", value: metrics.koperasi_aktif, trend: metrics.trends.koperasi_aktif, unit: "Koperasi", icon: HiHomeModern, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Total Pengajuan", value: metrics.total_pengajuan, trend: metrics.trends.total_pengajuan, unit: "Pengajuan", icon: HiDocumentText, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl ${c.bg} ${c.color}`}><c.icon className="text-xl" /></div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{c.name}</p>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-black text-zinc-900">{c.value.toLocaleString()} <span className="text-xs font-normal text-zinc-500">{c.unit}</span></p>
            {c.trend > 0 && (
              <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <HiArrowTrendingUp className="mr-0.5" /> {c.trend}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}