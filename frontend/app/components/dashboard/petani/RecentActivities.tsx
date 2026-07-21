'use client';

import React from 'react';
import { FaBoxOpen, FaChevronRight, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
}

interface RecentActivitiesProps {
  activities: ActivityItem[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaBoxOpen className="text-emerald-600 text-lg" />
          <h3 className="font-black text-slate-800 text-base">Aktivitas Terbaru</h3>
        </div>
        <button className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer">
          Riwayat <FaChevronRight className="text-[10px]" />
        </button>
      </div>

      <div className="space-y-3">
        {activities && activities.length > 0 ? (
          activities.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                {item.type === 'land' ? (
                  <FaCheckCircle className="text-emerald-600 text-xl" />
                ) : (
                  <FaExclamationCircle className="text-amber-600 text-xl" />
                )}
                <div>
                  <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.description} • <span className="text-slate-400">{item.date}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 text-center py-4 italic">Belum ada aktivitas transaksi atau pendaftaran lahan.</p>
        )}
      </div>
    </div>
  );
}