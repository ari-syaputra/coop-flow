"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import { useAuthAction } from "@/app/hooks/useAuthAction";

const getCookie = (name: string) => {
  if (typeof window === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
};

export default function AdminKoperasiLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuthAction();
  const [role, setRole] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [profile, setProfile] = useState({ adminName: "Pengurus Koperasi", roleName: "Admin Koperasi" });

  useEffect(() => {
    const currentRole = getCookie("user_role");
    setRole(currentRole);

    let realName = "";
    const storedProfile = localStorage.getItem("user_profile");
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        if (parsed.name) realName = parsed.name;
      } catch (e) {
        console.error("Gagal membaca user_profile dari localStorage", e);
      }
    }

    if (currentRole === "kemenko-pangan") {
      setProfile({ 
        adminName: realName || "Dr. Hendra Wijaya", 
        roleName: "Kemenko Pangan" 
      });
    } else if (currentRole === "petugas-koperasi") {
      setProfile({ 
        adminName: realName || "Siti Aminah", 
        roleName: "Petugas Koperasi" 
      });
    } else if (currentRole === "dinas-pertanian") {
      setProfile({ 
        adminName: realName || "Ir. Ahmad Subarjo", 
        roleName: "Dinas Pertanian" 
      });
    } else if (currentRole === "admin-lapangan") {
      setProfile({ 
        adminName: realName || "Budi Santoso", 
        roleName: "Admin Lapangan" 
      });
    } else if (currentRole === "petani") {
      setProfile({ 
        adminName: realName || "Slamet Riyadi", 
        roleName: "Petani" 
      });
    }

    // Membersihkan sisa elemen widget bawaan UserWay jika user berpindah halaman layout
    return () => {
      const userWayWidget = document.getElementById("accessibilityWidget");
      if (userWayWidget) userWayWidget.remove();
      
      const userWayEmbed = document.querySelector('script[src*="userway.org"]');
      if (userWayEmbed) userWayEmbed.remove();
    };
  }, []);

  if (!role) {
    return <div className="min-h-screen bg-[#f8fafc]" />;
  }

  // Tambahkan role "petani" di sini agar sidebar di-hide
  const hideSidebar =
    role === "admin-lapangan" ||
    role === "dinas-pertanian" ||
    role === "kemenko-pangan" ||
    role === "petani";

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-zinc-800 antialiased font-sans">
      {/* ID akun UserWay Anda telah diterapkan di bawah ini */}
      <Script
        src="https://cdn.userway.org/widget.js"
        data-account="m6NNwifJHR"
        strategy="afterInteractive"
      />

      {!hideSidebar && (
        <Sidebar handleLogout={logout} role={role} isOpen={isSidebarOpen} />
      )}

      <div className="flex-1 flex flex-col pb-12 transition-all duration-300">
        <Navbar
          adminName={profile.adminName}
          roleName={profile.roleName}
          handleLogout={logout}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className={`w-full mt-8 ${hideSidebar ? "px-4 md:px-12" : "px-6 md:px-10"}`}>
          <div className={`w-full mx-auto ${hideSidebar ? "max-w-none" : "max-w-[1600px]"}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}