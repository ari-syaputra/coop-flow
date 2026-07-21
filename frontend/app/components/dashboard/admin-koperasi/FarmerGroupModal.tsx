"use client";

import React, { useState } from "react";
import api from "../../../lib/axios";
import Swal from "sweetalert2";

interface FarmerGroupModalProps {
  onClose: () => void;
  onGroupCreated: (createdGroup: any) => void;
}

export default function FarmerGroupModal({ onClose, onGroupCreated }: FarmerGroupModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await api.post("/farmer-groups", { name, description: desc });
      if (response.data?.success) {
        onGroupCreated(response.data.data);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Kelompok tani baru berhasil ditambahkan!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        onClose();
      }
    } catch (err: any) {
      let errorMsg = "Gagal membuat kelompok tani.";
      if (err.response?.data) {
        errorMsg = Object.values(err.response.data).flat().join("\n") || err.response.data.message;
      }
      Swal.fire({ icon: "error", title: "Gagal", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-150">
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xl w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2.5 mb-4">
          <h4 className="text-sm font-bold text-gray-800">Buat Kelompok Tani Baru</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Kelompok Tani *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
              placeholder="Contoh: Tani Makmur Sejahtera"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Deskripsi Keterangan</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
              placeholder="Lokasi wilayah blok atau komoditas utama..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold">
              Batal
            </button>
            <button type="submit" disabled={loading} className="px-4 py-1.5 bg-[#0F7B4A] hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors">
              {loading ? "Menyimpan..." : "Simpan Kelompok"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}