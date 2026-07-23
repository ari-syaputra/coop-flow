"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

interface ChartsProps {
  donut?: {
    disetujui: number;
    menunggu_validasi: number;
    ditolak: number;
    total: number;
  };
  line?: Array<{
    month: string;
    disetujui: number;
    menunggu_validasi: number;
    ditolak: number;
  }>;
  bar?: Array<{ kecamatan: string; total_kg: number }>;
}

export default function DashboardCharts({
  donut,
  line = [],
  bar = [],
}: ChartsProps) {
  // Safe State untuk menangani Hydration Issue Recharts di Next.js
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Total pengajuan
  const donutTotal = donut?.total ?? 0;

  // 1. Data mentah Donut
  const rawDonutData = [
    { name: "Disetujui", value: donut?.disetujui ?? 0, color: "#10B981" },
    {
      name: "Menunggu Validasi",
      value: donut?.menunggu_validasi ?? 0,
      color: "#F59E0B",
    },
    { name: "Ditolak", value: donut?.ditolak ?? 0, color: "#EF4444" },
  ];

  // 2. Filter hanya data yang nilainya > 0 agar Recharts bisa merender busur lingkaran
  const activeDonutData = rawDonutData.filter((item) => item.value > 0);

  // 3. Fallback: Jika tidak ada data bertipe spesifik yang > 0, gunakan slice netral (abu-abu)
  const donutData =
    activeDonutData.length > 0
      ? activeDonutData
      : [
          {
            name: "Belum Divalidasi / Lainnya",
            value: donutTotal || 1,
            color: "#E4E4E7",
          },
        ];

  if (!isMounted) {
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-zinc-100">
        <span className="text-xs text-zinc-400 font-medium">
          Memuat Grafik...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart (Persentase Status Pengajuan) */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm lg:col-span-1 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-zinc-700 mb-2">
            Persentase Status Pengajuan
          </h3>

          <div className="h-52 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={activeDonutData.length > 1 ? 3 : 0}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #f4f4f5",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: "600" }}
                  formatter={(value: any) => [
                    `${Number(value).toLocaleString()} Pengajuan`,
                    "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Teks di Tengah Donut */}
            <div className="absolute text-center pointer-events-none">
              <p className="text-2xl font-black text-zinc-800">
                {donutTotal.toLocaleString()}
              </p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Pengajuan
              </p>
            </div>
          </div>

          {/* Legenda Kustom */}
          <div className="flex justify-center items-center space-x-4 pt-2 border-t border-zinc-50">
            {rawDonutData.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] font-semibold text-zinc-500">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart (Pengajuan per Kecamatan) */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-zinc-700 mb-4">
            Pengajuan per Kecamatan (Kg)
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bar}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f4f4f5"
                />
                <XAxis
                  dataKey="kecamatan"
                  tick={{ fontSize: 11, fill: "#71717a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#71717a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #f4f4f5",
                  }}
                  cursor={{ fill: "#f8fafc" }}
                  formatter={(value: any) => [
                    `${Number(value).toLocaleString()} Kg`,
                    "Total Pupuk",
                  ]}
                />
                <Bar
                  dataKey="total_kg"
                  name="Total Pupuk (Kg)"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart (Tren Pengajuan Pupuk) */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-700 mb-4">
          Tren Pengajuan Pupuk (6 Bulan Terakhir)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={line}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #f4f4f5",
                }}
                formatter={(value: any) => [
                  `${Number(value).toLocaleString()} Pengajuan`,
                ]}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", fontWeight: "600" }}
              />
              <Line
                type="monotone"
                dataKey="disetujui"
                name="Disetujui"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="menunggu_validasi"
                name="Menunggu Validasi"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="ditolak"
                name="Ditolak"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
