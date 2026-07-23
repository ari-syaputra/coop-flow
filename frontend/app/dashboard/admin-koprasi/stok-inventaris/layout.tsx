"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function StokInventarisLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMutasiActive = pathname.endsWith("/mutasi");

  if (isMutasiActive) {
    return <>{children}</>;
  }

  return (

    <div className="flex flex-col space-y-4 animate-fadeIn bg-zinc-50/50 min-h-screen -mt-2.5 overflow-hidden">
      
      {/* HEADER UTAMA (Statis/Fixed height di dalam layout) */}
      <div className="border-b border-zinc-100 pb-3 shrink-0">
        <h1 className="text-xl font-semibold text-[#115e59] tracking-tight">Stok & Inventaris</h1>
        <p className="text-xs text-zinc-500 font-medium mt-1">
          Kelola pengiriman dan penyaluran pupuk dari koperasi ke Dinas Pertanian
        </p>
      </div>

      <div className="flex-1 relative min-h-0">
        {children}
      </div>
    </div>
  );
}