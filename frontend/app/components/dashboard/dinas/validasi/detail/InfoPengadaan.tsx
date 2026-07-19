"use client";

import React from "react";

interface InfoPengadaanProps {
  data: any;
}

export default function InfoPengadaan({ data }: InfoPengadaanProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
      <div className="flex justify-between items-start border-b border-zinc-100 pb-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 font-bold text-emerald-700">
            COOP
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-base">{data.cooperative?.name}</h3>
            <p className="text-xs text-zinc-500">{data.cooperative?.address}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold">No. Pengajuan</p>
          <p className="text-sm font-bold text-zinc-800">{data.po_number}</p>
          <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold mt-2">Tanggal Pengajuan</p>
          <p className="text-sm font-bold text-zinc-800">
            {new Date(data.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
        <div className="grid grid-cols-3">
          <span className="text-zinc-500 font-medium">Musim Tanam</span>
          <span className="col-span-2 text-zinc-900 font-bold">: {data.periode_pengadaan}</span>
        </div>
        <div className="grid grid-cols-3">
          <span className="text-zinc-500 font-medium">Total Karung</span>
          <span className="col-span-2 text-zinc-900 font-bold">: {data.total_bags_ordered} Karung</span>
        </div>
        <div className="grid grid-cols-3">
          <span className="text-zinc-500 font-medium">Total Berat Pupuk</span>
          <span className="col-span-2 text-zinc-900 font-bold">: {(data.total_weight_kg / 1000).toFixed(3)} Ton</span>
        </div>
        <div className="grid grid-cols-3">
          <span className="text-zinc-500 font-medium">Estimasi Biaya</span>
          <span className="col-span-2 text-emerald-700 font-extrabold">
            : Rp {data.total_estimated_cost.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="grid grid-cols-3">
          <span className="text-zinc-500 font-medium">Status Validasi</span>
          <span className="col-span-2 text-amber-600 font-bold">: {data.status_verifikasi}</span>
        </div>
      </div>
    </div>
  );
}