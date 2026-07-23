"use client";

import React, { useState, useEffect } from "react";
import api from "@/app/lib/axios";
import { buildLastNMonths } from "@/app/lib/dashboardUtils";

// Import Komponen Terpisah
import KemenkoHero from "@/app/components/dashboard/kemenko/KemenkoHero";
import NavCardsSection from "@/app/components/dashboard/kemenko/NavCardsSection";
import StatCardsSection from "@/app/components/dashboard/kemenko/StatCardsSection";
import DashboardCharts from "@/app/components/dashboard/kemenko/DashboardCharts";

export default function KemenkoPanganDashboard() {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [userName, setUserName] = useState("Dr. Hendra Wijaya");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    koperasiAktif: 0,
    menungguRegistrasi: 0,
    menungguValidasi: 0,
    pengadaanDisetujui: 0,
  });

  const [donutPengadaan, setDonutPengadaan] = useState({
    disetujui: 0,
    menunggu_validasi: 0,
    ditolak: 0,
    total: 0,
  });
  const [barRegistrasi, setBarRegistrasi] = useState<
    Array<{ bulan: string; jumlah: number }>
  >([]);
  const [lineTrenPengadaan, setLineTrenPengadaan] = useState<
    Array<{
      bulan: string;
      disetujui: number;
      menunggu_validasi: number;
      ditolak: number;
    }>
  >([]);

  // Ambil nama user dari localStorage/auth jika ada
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.name) setUserName(user.name);
      }
    } catch (e) {
      console.error("Gagal mengambil nama user:", e);
    }
  }, []);

  // Fetch Data Statistik & Chart
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        const [resActive, resPending, resProcurement] = await Promise.all([
          api.get("/kemenko/registrations/active"),
          api.get("/kemenko/registrations/pending"),
          api.get("/cooperative/procurement"),
        ]);

        const activeData = resActive.data;
        const pendingData = resPending.data;
        const procurementData = resProcurement.data;

        const activeList = Array.isArray(activeData)
          ? activeData
          : activeData?.data || [];
        const pendingList = Array.isArray(pendingData)
          ? pendingData
          : pendingData?.data || [];
        const procurementList: any[] = Array.isArray(procurementData)
          ? procurementData
          : procurementData?.data || [];

        // ----- Kartu statistik -----
        const countWaitingValidation = procurementList.filter(
          (item) =>
            item.status_verifikasi === "PENDING_DINAS" ||
            item.status_verifikasi === "PENDING_KEMENKO",
        ).length;

        const countApproved = procurementList.filter(
          (item) => item.status_verifikasi === "APPROVED",
        ).length;

        setStats({
          koperasiAktif: activeList.length,
          menungguRegistrasi: pendingList.length,
          menungguValidasi: countWaitingValidation,
          pengadaanDisetujui: countApproved,
        });

        // ----- Donut -----
        const countRejected = procurementList.filter(
          (item) =>
            item.status_verifikasi === "REJECTED_DINAS" ||
            item.status_verifikasi === "REJECTED_KEMENKO",
        ).length;

        setDonutPengadaan({
          disetujui: countApproved,
          menunggu_validasi: countWaitingValidation,
          ditolak: countRejected,
          total: countApproved + countWaitingValidation + countRejected,
        });

        // ----- Bar -----
        const months6 = buildLastNMonths(6);
        const barData = months6.map(({ label, year, month }) => {
          const jumlah = activeList.filter((item: any) => {
            if (!item.created_at) return false;
            const d = new Date(item.created_at);
            return d.getFullYear() === year && d.getMonth() === month;
          }).length;
          return { bulan: label, jumlah };
        });
        setBarRegistrasi(barData);

        // ----- Line -----
        const lineData = months6.map(({ label, year, month }) => {
          const itemsBulanIni = procurementList.filter((item) => {
            if (!item.created_at) return false;
            const d = new Date(item.created_at);
            return d.getFullYear() === year && d.getMonth() === month;
          });
          return {
            bulan: label,
            disetujui: itemsBulanIni.filter(
              (i) => i.status_verifikasi === "APPROVED",
            ).length,
            menunggu_validasi: itemsBulanIni.filter(
              (i) =>
                i.status_verifikasi === "PENDING_DINAS" ||
                i.status_verifikasi === "PENDING_KEMENKO",
            ).length,
            ditolak: itemsBulanIni.filter(
              (i) =>
                i.status_verifikasi === "REJECTED_DINAS" ||
                i.status_verifikasi === "REJECTED_KEMENKO",
            ).length,
          };
        });
        setLineTrenPengadaan(lineData);
      } catch (error) {
        console.error("Gagal mengambil data statistik dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="w-full font-sans text-slate-800">
      {/* HERO BANNER */}
      <KemenkoHero userName={userName} today={today} />

      {/* 3 CARD NAVIGASI */}
      <NavCardsSection />

      {/* 4 KARTU STATISTIK */}
      <StatCardsSection stats={stats} loading={loading} />

      {/* GRAFIK */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 bg-slate-100 animate-pulse rounded-2xl lg:col-span-1" />
          <div className="h-72 bg-slate-100 animate-pulse rounded-2xl lg:col-span-2" />
        </div>
      ) : (
        <DashboardCharts
          donutPengadaan={donutPengadaan}
          barRegistrasi={barRegistrasi}
          lineTrenPengadaan={lineTrenPengadaan}
        />
      )}
    </div>
  );
}
