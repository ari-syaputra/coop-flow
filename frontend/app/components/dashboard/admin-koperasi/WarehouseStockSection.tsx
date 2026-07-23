"use client";

import React from "react";

interface WarehouseStockSectionProps {
  stock: any[];
  activities: any[];
}

export default function WarehouseStockSection({
  stock = [],
  activities = [],
}: WarehouseStockSectionProps) {
  // Fungsi penentu warna badge stok
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Aman":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Perlu Dipantau":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Hampir Habis":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // Fungsi penentu warna progress bar stok
  const getBarColor = (status: string) => {
    if (status === "Aman") return "bg-emerald-500";
    if (status === "Perlu Dipantau") return "bg-orange-500";
    return "bg-rose-500";
  };

  // Fungsi penentu warna titik aktivitas sesuai tipe (gaya sederhana ala Dinas)
  const getActivityDotColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "persetujuan":
        return "bg-emerald-500";
      case "penolakan":
        return "bg-red-500";
      case "penerimaan":
        return "bg-blue-500";
      case "distribusi":
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. MONITORING KONDISI STOK GUDANG */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-slate-800 tracking-tight">
          Kondisi Stok Gudang Utama
        </h2>

        <div className="space-y-5">
          {stock.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {item.name}
                  </h4>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                    {item.fertilizer_code}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-800 block">
                    {(item.current_stock_kg / 1000).toFixed(1)}{" "}
                    <span className="text-xs font-medium text-slate-500">
                      Ton
                    </span>
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border mt-1 ${getBadgeColor(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getBarColor(item.status)}`}
                  style={{ width: `${Math.max(item.persentase, 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. AKTIVITAS TERBARU (Gaya sederhana ala Dinas: titik warna) */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="text-md font-black text-slate-800 tracking-tight">
          Aktifitas Terbaru
        </h2>

        <div className="space-y-4">
          {activities.map((act) => {
            // Jika judul mengandung kata "tidak disetujui", otomatis arahkan tipe ke penolakan
            const deteksiTipe = act.judul
              ?.toLowerCase()
              .includes("tidak disetujui")
              ? "penolakan"
              : act.tipe;

            return (
              <div key={act.id} className="flex items-start space-x-3 text-xs">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getActivityDotColor(deteksiTipe)}`}
                />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-zinc-600 font-medium truncate">
                    {act.judul}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-bold tracking-tight truncate">
                    {act.subjudul}
                  </p>
                  <p className="text-[9px] text-zinc-400 font-medium">
                    {act.waktu}
                  </p>
                </div>
              </div>
            );
          })}

          {activities.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">
              Belum ada riwayat aktifitas logistik terbaru.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
