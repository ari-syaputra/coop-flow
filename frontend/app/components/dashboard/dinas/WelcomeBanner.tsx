"use client";

import React, { useState, useEffect } from "react";
import { HiCalendar, HiSun } from "react-icons/hi2";
import { getWeatherData } from "@/app/services/weatherService";

export default function WelcomeBanner() {
  const [weather, setWeather] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("Selamat Pagi");

  useEffect(() => {
    // 1. Logika Penentu Ucapan Waktu Real-time
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 4 && currentHour < 11) {
        setGreeting("Selamat Pagi");
      } else if (currentHour >= 11 && currentHour < 15) {
        setGreeting("Selamat Siang");
      } else if (currentHour >= 15 && currentHour < 18.5) {
        setGreeting("Selamat Sore");
      } else {
        setGreeting("Selamat Malam");
      }
    };

    // 2. Format Tanggal Indonesia Dinamis
    const formatIndonesianDate = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      setCurrentDate(new Date().toLocaleDateString("id-ID", options));
    };

    updateGreeting();
    formatIndonesianDate();

    // 3. Integrasi Cuaca & Fallback Wilayah Sleman/Yogyakarta
    const fetchWeather = (lat: number, lon: number) => {
      getWeatherData(lat, lon).then((data) => {
        if (data) {
          setWeather(data);
          const weatherPayload = {
            temp: data.main.temp,
            humidity: data.main.humidity,
            rain: data.rain ? data.rain["1h"] : 0,
            windSpeed: data.wind?.speed,
            latitude: lat,
            longitude: lon,
            locationName: data.name,
            fetchedAt: new Date().toISOString(),
          };
          localStorage.setItem("current_validation_weather", JSON.stringify(weatherPayload));
        }
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Gagal mendeteksi lokasi otomatis, menggunakan fallback:", error);
          fetchWeather(-7.77, 110.37);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      fetchWeather(-7.77, 110.37);
    }
  }, []);

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-zinc-100 shadow-sm bg-cover bg-center text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center min-h-[166px]"
      style={{ backgroundImage: `url('/bannerdinas.png')` }}
    >
      <div className="space-y-2 z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1B4332]">
          {greeting}, <span className="text-[#00C270]">Dinas Pertanian</span>
        </h1>
        <p className="text-gray-600 zinc-100/95 text-sm md:text-sm max-w-xl font-reguler">
          Kelola pengadaan untuk mendukung ketahanan pangan Kabupaten Sleman secara terpadu dan transparan.
        </p>
        
        {/* Badge Dinamis: Tanggal & Temperatur/Deskripsi Cuaca */}
        <div className="flex flex-wrap gap-3 pt-2">
          <span className="flex items-center space-x-1.5  text-black text-xs font-semibold">
            <HiCalendar className="text-sm" />
            <span>{currentDate || "Memuat tanggal..."}</span>
          </span>
          <span className="flex items-center space-x-1.5  text-black text-xs font-semibold">
            <HiSun className="text-sm text-amber-300" />
            <span>
              {weather 
                ? `${Math.round(weather.main.temp)}°C ${weather.weather[0].description}` 
                : "Memuat cuaca..."}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}