"use client";

import React from "react";

interface ItemTableProps {
  items: any[];
}

export default function RincianItemTable({ items }: ItemTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
      <div className="p-4 bg-zinc-50 border-b border-zinc-100 font-bold text-sm text-zinc-700">
        Ringkasan Pengajuan Pupuk
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <th className="p-4 w-16 text-center">No</th>
              <th className="p-4">Nama Pupuk</th>
              <th className="p-4">Kemasan</th>
              <th className="p-4 text-center">Jumlah Pesanan</th>
              <th className="p-4 text-right">Total Berat</th>
              <th className="p-4 text-right">Subtotal Harga</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-sm font-medium">
            {items?.map((item, idx) => (
              <tr key={item.id} className="hover:bg-zinc-50/50 transition">
                <td className="p-4 text-center text-zinc-400">{idx + 1}</td>
                <td className="p-4 text-zinc-900 font-bold">{item.fertilizer_name}</td>
                <td className="p-4 text-zinc-500">{item.packaging_size_kg} Kg</td>
                <td className="p-4 text-center text-zinc-800 font-semibold">{item.final_bags_ordered} Karung</td>
                <td className="p-4 text-right text-zinc-900 font-black">
                  {parseFloat(item.final_weight_kg).toLocaleString("id-ID")} Kg
                </td>
                <td className="p-4 text-right text-emerald-700 font-bold">
                  Rp {parseFloat(item.subtotal_price).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}