"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import {
  FaChartPie,
  FaBoxes,
  FaTruckLoading,
  FaBrain,
  FaUserFriends,
  FaExchangeAlt,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaCogs,
  FaUsers,
  FaSeedling,
} from "react-icons/fa";

interface SidebarProps {
  handleLogout: () => void;
  role: string; 
  isOpen: boolean;
}

export default function Sidebar({ handleLogout, role, isOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    // --- MENU KEMENKO PANGAN ---
    { name: "Dashboard", icon: FaChartPie, href: "/dashboard/kemenko-pangan", roles: ["kemenko-pangan"] },
    { name: "Cooperative Master", icon: FaUsers, href: "/dashboard/kemenko-pangan/cooperative-master", roles: ["kemenko-pangan"] },
    { name: "Analytics", icon: FaChartPie, href: "/dashboard/kemenko-pangan/analytics", roles: ["kemenko-pangan"] },
    { name: "System Settings", icon: FaCogs, href: "/dashboard/kemenko-pangan/settings", roles: ["kemenko-pangan"] },

    // --- MENU PETUGAS KOPERASI ---
    { name: "Dashboard", icon: FaChartPie, href: "/dashboard/admin-koprasi", roles: ["petugas-koperasi"] },
    { name: "Stok & Inventaris", icon: FaBoxes, href: "/dashboard/admin-koprasi/stok-inventaris", roles: ["petugas-koperasi"] },
    { name: "Distribusi", icon: FaTruckLoading, href: "/dashboard/admin-koprasi/riwayat-distribusi", roles: ["petugas-koperasi"] },
    { name: "Prediksi Kebutuhan", icon: FaBrain, href: "/dashboard/admin-koprasi/prediksi", roles: ["petugas-koperasi"] },
    { name: "Petani & Lahan", icon: FaUserFriends, href: "/dashboard/admin-koprasi/petani-lahan", roles: ["petugas-koperasi"] },
    { name: "Transaksi", icon: FaExchangeAlt, href: "/dashboard/admin-koprasi/transaksi", roles: ["petugas-koperasi"] },
    { name: "Kalender Tanam", icon: FaCalendarAlt, href: "/dashboard/admin-koprasi/kalender", roles: ["petugas-koperasi"] },
    { name: "Laporan", icon: FaFileInvoiceDollar, href: "/dashboard/admin-koprasi/laporan", roles: ["petugas-koperasi"] },
    { name: "Pengaturan", icon: FaCogs, href: "/dashboard/admin-koprasi/pengaturan", roles: ["petugas-koperasi"] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside 
      style={{
        background: "linear-gradient(to bottom, #094D30 22%, #0F7B4A 51%, #195873 71%)"
      }}
      className={`${
        isOpen ? "w-64" : "w-20"
      } min-h-screen text-white flex flex-col justify-between sticky top-0 h-screen shrink-0 font-sans shadow-2xl transition-all duration-300 ease-in-out overflow-x-hidden`}
    >
      <div>
        {/* Header Sidebar */}
        <div className={`p-5 flex items-center ${isOpen ? "px-6" : "justify-center px-0 ml-5.5"} border-b border-white/5 h-18 transition-all duration-300`}>
          <div className="h-14 w-14 flex items-center justify-center p-1.5 ">
            <img
              src="/logonobg.png"
              alt="Logo"
              className="h-full w-full -ml-5.5 object-contain brightness-0 invert"
            />
          </div>
          
          {isOpen && (
            <div className="leading-tight animate-in fade-in duration-200">
              <h2 className="font-bold text-base text-[20px] tracking-wider block uppercase whitespace-nowrap text-white">
                COOP <span className="text-[#04C070]">FLOW</span>
              </h2>
            </div>
          )}
        </div>

        {/* Menu Navigasi Tengah */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-240px)] scrollbar-none">
          {filteredMenuItems.map((item, idx) => {
            const Icon = item.icon;
            let isActive = pathname === item.href;

            if (item.href === "/dashboard/admin-koprasi/stok-inventaris") {
              isActive = pathname.startsWith("/dashboard/admin-koprasi/stok-inventaris");
            } else if (item.href === "/dashboard/admin-koprasi" || item.href === "/dashboard/kemenko-pangan") {
              isActive = pathname === item.href;
            }

            return (
              <Link
                key={idx}
                href={item.href}
                title={!isOpen ? item.name : undefined}
                className={`flex items-center ${
                  isOpen ? "justify-between px-4" : "justify-center p-2.5"
                } py-2.5 rounded-xl font-bold text-[15px] transition-all duration-150 group ${
                  isActive
                    ? "bg-[#3BFF00]/30 text-white shadow-md shadow-black/15 font-semibold " 
                    : "text-white hover:bg-[#3BFF00]/10 hover:text-white "
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <Icon
                    className={`text-base shrink-0 transition-colors text-[20px] ${
                      isActive ? "text-white" : "text-white group-hover:text-white"
                    }`}
                  />
                  {isOpen && (
                    <span className="animate-in fade-in duration-150 whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bagian Bawah: Ilustrasi Persawahan */}
      <div className="w-full mt-auto shrink-0 relative overflow-hidden">
        <img 
          src="/sid.png" 
          alt="Landscape" 
          className={`w-full object-cover object-top transition-all duration-300 ${
            isOpen ? "h-50 opacity-100" : "h-25 opacity-40"
          }`} 
        />
      </div>
    </aside>
  );
}