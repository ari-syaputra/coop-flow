'use client';

import React from 'react';

export default function MapWorkspace() {
  return (
    <div className="bg-zinc-800 h-80 rounded-2xl relative shadow-md overflow-hidden flex items-center justify-center border border-zinc-700">
      {/* Efek grid peta satelit tiruan */}
      <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
      
      {/* Poligon Lahan Tiruan */}
      <div className="absolute w-44 h-32 bg-green-500/30 border-2 border-green-400 rounded-lg transform -rotate-12 flex items-center justify-center animate-pulse">
        <span className="text-[10px] text-green-300 font-bold tracking-wider bg-zinc-950/60 px-2 py-0.5 rounded-full">
          Poligon Terkunci
        </span>
      </div>

      {/* Indikator Akurasi GPS */}
      <div className="absolute top-4 left-4 bg-zinc-900/90 text-white p-3 rounded-xl text-xs font-semibold space-y-1 backdrop-blur-sm border border-zinc-700 shadow-lg">
        <div className="flex items-center gap-2 text-green-400">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-ping"></div>
          <span>GPS Akurasi: 2 Meter</span>
        </div>
        <p className="text-[10px] text-zinc-400 font-normal">Satelit Terhubung: 9 Simpul</p>
      </div>

      <p className="text-xs text-zinc-400 font-medium z-10 bg-zinc-900/80 px-4 py-2 rounded-xl border border-zinc-700">
        Gunakan Leaflet.js di masa depan untuk visualisasi peta fisik riil
      </p>
    </div>
  );
}