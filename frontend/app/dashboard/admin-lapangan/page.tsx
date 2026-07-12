'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/dashboard/Navbar';
import OverviewContent from '@/app/components/dashboard/OverviewContent';

import { useAuthAction } from '@/app/hooks/useAuthAction'; 

export default function AdminLapanganDashboard() {
  const [adminName, setAdminName] = useState('Andi');
  
  const { logout } = useAuthAction(); 

  useEffect(() => {
    const profile = localStorage.getItem('user_profile');
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.name) setAdminName(parsed.name);
    }
  }, []);

  return (

     <div className="w-full font-sans">
        <OverviewContent adminName={adminName} />
      </div>
   
  );
}