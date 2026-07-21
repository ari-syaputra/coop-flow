'use client';

import React from 'react';
import { FaMapMarkedAlt, FaBoxOpen, FaReceipt, FaSeedling } from 'react-icons/fa';

interface SummaryProps {
  totalLandHa: number;
  fertilizerReceivedKg: number;
  totalTransactions: number;
  mainCommodity: string;
}

export default function SummaryCards({
  totalLandHa,
  fertilizerReceivedKg,
  totalTransactions,
  mainCommodity,
}: SummaryProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-extrabold text-slate-900">Ringkasan Saya</h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Lahan Saya */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FaMapMarkedAlt className="text-xl" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Lahan Saya</p>
            <p className="text-base font-black text-slate-900">
              {totalLandHa.toLocaleString('id-ID')} <span className="text-xs font-semibold">Ha</span>
            </p>
          </div>
        </div>

        {/* Card 2: Pupuk Diterima */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FaBoxOpen className="text-xl" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Pupuk Diterima</p>
            <p className="text-base font-black text-slate-900">
              {fertilizerReceivedKg.toLocaleString('id-ID')} <span className="text-xs font-semibold">Kg</span>
            </p>
          </div>
        </div>

        {/* Card 3: Riwayat Transaksi */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FaReceipt className="text-xl" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Riwayat Transaksi</p>
            <p className="text-base font-black text-slate-900">{totalTransactions}</p>
          </div>
        </div>

        {/* Card 4: Komoditas Utama */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FaSeedling className="text-xl" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Komoditas Utama</p>
            <p className="text-base font-black text-slate-900">{mainCommodity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}