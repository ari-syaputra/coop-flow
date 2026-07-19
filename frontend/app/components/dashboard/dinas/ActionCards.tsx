"use client";

import React from "react";
import Link from "next/link";
import { HiArrowUpRight, HiClipboardDocumentCheck, HiDocumentChartBar } from "react-icons/hi2";

interface ActionCardsProps {
  validasiCount: number;
}

export default function ActionCards({ validasiCount }: ActionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card Validasi Pengadaan */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-start space-x-4 group hover:shadow-md transition">
        <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600">
          <HiClipboardDocumentCheck className="text-2xl" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-zinc-800">Validasi Pengadaan</h3>
            {validasiCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {validasiCount}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">Persetujuan pengajuan pupuk bersubsidi.</p>
          
          {/* Navigasi instan SPA menggunakan Next Link */}
          <Link 
            href="/dashboard/dinas-pertanian/validasi-pengadaan" 
            className="inline-flex pt-3 items-center text-xs font-bold text-emerald-600 group-hover:underline"
          >
            Kelola Validasi <HiArrowUpRight className="ml-1" />
          </Link>
        </div>
      </div>

      {/* Card Laporan */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-start space-x-4 group hover:shadow-md transition">
        <div className="p-3.5 bg-amber-50 rounded-2xl text-amber-600">
          <HiDocumentChartBar className="text-2xl" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-zinc-800">Laporan & Rekapitulasi</h3>
          <p className="text-xs text-zinc-400">Rekap pengadaan dan pemantauan distribusi wilayah.</p>
          
          <Link 
            href="/dashboard/dinas-pertanian/laporan" 
            className="inline-flex pt-3 items-center text-xs font-bold text-amber-600 group-hover:underline"
          >
            Kelola Laporan <HiArrowUpRight className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}