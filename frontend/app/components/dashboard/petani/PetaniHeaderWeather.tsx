'use client';

import React, { useState, useEffect } from 'react';
import { getWeatherData } from '@/app/services/weatherService';

interface FarmerHeaderProps {
  name: string;
  role: string;
  avatar: string | null;
}

export default function FarmerHeader({ name, role, avatar }: FarmerHeaderProps) {
  const [weather, setWeather] = useState<any>(null);
  const [greeting, setGreeting] = useState<string>('Selamat Pagi');

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 4 && currentHour < 11) setGreeting('Selamat Pagi');
    else if (currentHour >= 11 && currentHour < 15) setGreeting('Selamat Siang');
    else if (currentHour >= 15 && currentHour < 18.5) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');

    // Weather Fetching
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          getWeatherData(pos.coords.latitude, pos.coords.longitude).then((data) => {
            if (data) setWeather(data);
          });
        },
        () => {
          getWeatherData(-7.77, 110.37).then((data) => {
            if (data) setWeather(data);
          });
        }
      );
    }
  }, []);

  return (
    /* Card Container Utama: Background Hijau Muda Modern dengan Gradient Halus & Rounded Besar */
    <div className="bg-gradient-to-r from-emerald-50/90 via-emerald-100/70 to-green-50/80 border border-emerald-200/60 rounded-3xl p-3.5 shadow-sm flex items-center justify-between">
      
      {/* Kiri: Avatar & Info Profil */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-0.5 border-2 border-emerald-500/30 shadow-xs flex-shrink-0">
          <img
            src={avatar || '/default-avatar.png'}
            alt={name}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute(
                'src',
                'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=059669&color=fff'
              );
            }}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-emerald-700 tracking-wide">{greeting}</p>
          <h1 className="text-base font-black text-slate-800 leading-tight">{name}</h1>
          <span className="inline-block mt-0.5 bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
            {role}
          </span>
        </div>
      </div>

      {/* Kanan: Widget Cuaca Mini Modern (Glassmorphism White Card) */}
      <div className="bg-white/80 backdrop-blur-md border border-emerald-100/80 rounded-2xl px-3 py-1.5 shadow-xs flex items-center space-x-2">
        <div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-tight">Cuaca</p>
          <p className="text-xs font-black text-emerald-950 text-right">
            {weather ? `${Math.round(weather.main.temp)}°C` : '--°C'}
          </p>
        </div>
        {weather ? (
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt="weather"
            className="w-8 h-8 object-contain"
          />
        ) : (
          <div className="w-7 h-7 bg-emerald-50/80 rounded-full animate-pulse" />
        )}
      </div>

    </div>
  );
}