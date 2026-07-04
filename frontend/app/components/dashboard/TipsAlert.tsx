'use client';

import React, { useState } from 'react';
import { FaLightbulb, FaTimes } from 'react-icons/fa';

export default function TipsAlert() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#f4faf6] border border-green-100 p-3.5 rounded-2xl flex items-center justify-between text-zinc-700 transition duration-150">
      <div className="flex items-center space-x-3">
        <div className="text-green-600 bg-white p-1.5 rounded-lg border border-green-100 flex items-center justify-center">
          <FaLightbulb className="text-sm" />
        </div>
        <p className="text-xs font-medium">
          <span className="font-bold text-green-800">Tips Hari Ini:</span> Pastikan titik batas lahan mengikuti bentuk asli di lapangan untuk akurasi data yang lebih baik.
        </p>
      </div>
      <button onClick={() => setVisible(false)} className="text-zinc-400 hover:text-zinc-600 transition p-1">
        <FaTimes className="text-xs" />
      </button>
    </div>
  );
}