import React from "react";
import { getGreeting } from "@/app/lib/dashboardUtils";

interface KemenkoHeroProps {
  userName: string;
  today: string;
}

export default function KemenkoHero({ userName, today }: KemenkoHeroProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 h-64 shadow-md">
      <img
        src="/kemenko-hero.png"
        alt="Petani"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-white to-transparent"></div>

      <div className="relative z-10 p-8 h-full flex flex-col justify-center max-w-xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
          {getGreeting()}, <br className="hidden sm:inline" />
          <span className="text-emerald-600">{userName}</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-700/90 mb-3 leading-relaxed">
          Pantau registrasi koperasi dan validasi pengadaan pupuk secara
          real-time.
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-800 backdrop-blur-xs px-3 py-1.5 rounded-full w-fit border border-emerald-500/20">
          <span>📅</span>
          <span>{today}</span>
        </div>
      </div>
    </div>
  );
}
