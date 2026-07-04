'use client';

import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

interface GreetingBannerProps {
  adminName: string;
}

export default function GreetingBanner({ adminName }: GreetingBannerProps) {
  return (
    <div className=" p-2 rounded-3xl  flex items-center space-x-4">
      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 overflow-hidden flex items-center justify-center text-4xl select-none">
        👨‍🌾
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold text-zinc-900">Selamat Pagi, {adminName} ☀️</h1>
        <p className="text-xs text-zinc-400">Mari selesaikan tugas lapangan hari ini.</p>
        <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full border border-green-100 cursor-pointer hover:bg-green-100 transition">
          <span>5 lahan perlu diverifikasi hari ini</span>
          <FaChevronRight className="text-[9px]" />
        </div>
      </div>
    </div>
  );
}