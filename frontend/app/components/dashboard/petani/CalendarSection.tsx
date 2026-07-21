'use client';

import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CalendarProps {
  calendars?: {
    planting: Array<{ id: number; plant_name: string; date: string; phase?: string }>;
    fertilizer: Array<{ id: number; fertilizer_name: string; date: string; stage?: string }>;
  };
}

export default function CalendarSection({ calendars }: CalendarProps) {
  const [currentDate] = useState(new Date(2026, 6, 1)); // Default Bulan Juli 2026

  // Simulasi Tanggal dalam sebulan (Juli = 31 Hari)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Helper untuk mewarnai tanggal tertentu (sesuai contoh UI)
  const getPlantingClass = (day: number) => {
    if (day === 16) return 'bg-emerald-600 text-white font-bold rounded-full'; // Tanam
    if (day === 22) return 'bg-sky-500 text-white font-bold rounded-full'; // Persiapan
    return 'text-slate-700 hover:bg-slate-100 rounded-full';
  };

  const getFertilizerClass = (day: number) => {
    if (day === 16) return 'bg-emerald-700 text-white font-bold rounded-full'; // Dasar
    if (day === 22) return 'bg-sky-500 text-white font-bold rounded-full'; // Susulan 1
    return 'text-slate-700 hover:bg-slate-100 rounded-full';
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-extrabold text-slate-900">Kalender</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. KALENDER TANAM */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <p className="font-extrabold text-xs text-slate-800">Kalender Tanam</p>

          {/* Header Navigasi Bulan */}
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 px-1">
            <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
              <FaChevronLeft className="text-[10px]" />
            </button>
            <span>Juli 2026</span>
            <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>

          {/* Grid Hari */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => (
              <span key={d} className="font-bold text-slate-400 py-1">
                {d}
              </span>
            ))}
            {daysInMonth.map((day) => (
              <div
                key={`p-${day}`}
                className={`py-1 text-[11px] flex items-center justify-center cursor-pointer transition ${getPlantingClass(
                  day
                )}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Legend Keterangan Warna */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[9px] text-slate-500">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Tanam</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>Persiapan Lahan</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Pemeliharaan</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Panen</span>
            </div>
          </div>
        </div>

        {/* 2. KALENDER PEMUPUKAN */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <p className="font-extrabold text-xs text-slate-800">Kalender Pemupukan</p>

          {/* Header Navigasi Bulan */}
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 px-1">
            <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
              <FaChevronLeft className="text-[10px]" />
            </button>
            <span>Juli 2026</span>
            <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>

          {/* Grid Hari */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => (
              <span key={d} className="font-bold text-slate-400 py-1">
                {d}
              </span>
            ))}
            {daysInMonth.map((day) => (
              <div
                key={`f-${day}`}
                className={`py-1 text-[11px] flex items-center justify-center cursor-pointer transition ${getFertilizerClass(
                  day
                )}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Legend Keterangan Warna */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[9px] text-slate-500">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
              <span>Dasar</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>Susulan 1</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Susulan 2</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              <span>Lainnya</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}