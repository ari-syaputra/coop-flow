"use client";

import React from "react";

interface RecentListsProps {
  orders: Array<{ id: number; cooperative_name: string; po_number: string; district: string; date: string; status: string }>;
  activities: Array<{ id: number; description: string; time: string; type: string }>;
}

export default function RecentLists({ orders, activities }: RecentListsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List Validasi Pengadaan */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm lg:col-span-2">
        <h3 className="text-sm font-bold text-zinc-700 mb-4">Pengajuan Menunggu Validasi</h3>
        {orders.length === 0 ? (
          <p className="text-xs text-zinc-400 py-6 text-center">Tidak ada pengajuan baru butuh validasi.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3">Nomor PO</th>
                  <th className="pb-3">Koperasi / Wilayah</th>
                  <th className="pb-3 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 text-sm">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-zinc-50/50">
                    <td className="py-3 font-bold text-zinc-800">{o.po_number}</td>
                    <td className="py-3 text-zinc-500 text-xs leading-tight">
                      <span className="font-semibold text-zinc-700 block text-sm">{o.cooperative_name}</span>
                      Kec. {o.district}
                    </td>
                    <td className="py-3 text-right text-xs text-zinc-400 font-medium">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Aktivitas Log */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm lg:col-span-1">
        <h3 className="text-sm font-bold text-zinc-700 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          {activities.map(a => (
            <div key={a.id} className="flex items-start space-x-3 text-xs">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                a.type === "success" ? "bg-emerald-500" : a.type === "danger" ? "bg-red-500" : "bg-blue-500"
              }`} />
              <div className="space-y-0.5">
                <p className="text-zinc-600 font-medium">{a.description}</p>
                <p className="text-[10px] text-zinc-400 font-bold tracking-tight">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}