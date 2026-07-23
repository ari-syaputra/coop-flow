import React from "react";
import Link from "next/link";
import {
  HiBuildingOffice2,
  HiTruck,
  HiDocumentChartBar,
} from "react-icons/hi2";

interface NavCardProps {
  icon: React.ReactNode;
  title: string;
  ctaText: string;
  href: string;
  bgColor?: string;
  iconColor?: string;
}

function NavCard({
  icon,
  title,
  ctaText,
  href,
  bgColor = "bg-emerald-100",
  iconColor = "text-emerald-700",
}: NavCardProps) {
  return (
    <div className="bg-emerald-50/40 rounded-2xl p-5 flex items-center gap-4 border border-emerald-100/60 shadow-xs">
      <div
        className={`h-16 w-16 rounded-2xl ${bgColor} ${iconColor} flex items-center justify-center text-3xl shrink-0`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
        <Link
          href={href}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
        >
          {ctaText} <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default function NavCardsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <NavCard
        icon={<HiBuildingOffice2 />}
        title="Manajemen Koperasi"
        ctaText="Kelola Manajemen"
        href="/dashboard/kemenko-pangan/manajemen-koperasi"
        bgColor="bg-emerald-100/70"
        iconColor="text-emerald-700"
      />
      <NavCard
        icon={<HiTruck />}
        title="Validasi Pengadaan Pupuk"
        ctaText="Kelola Pupuk"
        href="/dashboard/kemenko-pangan/validasi-pengadaan"
        bgColor="bg-blue-100/70"
        iconColor="text-blue-700"
      />
      <NavCard
        icon={<HiDocumentChartBar />}
        title="Laporan"
        ctaText="Kelola Laporan"
        href="/dashboard/kemenko-pangan/laporan"
        bgColor="bg-purple-100/70"
        iconColor="text-purple-700"
      />
    </div>
  );
}
