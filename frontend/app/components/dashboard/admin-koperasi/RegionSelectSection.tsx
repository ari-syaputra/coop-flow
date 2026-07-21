"use client";

import React, { useState, useEffect } from "react";
import api from "../../../lib/axios";

interface RegionItem {
  id: number | string;
  code?: string;
  name: string;
}

interface RegionSelectSectionProps {
  provinceId: string | number;
  cityId: string | number;
  districtId: string | number;
  villageId: string | number;
  onChange: (field: string, value: string) => void;
  title?: string;
}

export default function RegionSelectSection({
  provinceId,
  cityId,
  districtId,
  villageId,
  onChange,
  title = "Wilayah Administratif Rumah Petani",
}: RegionSelectSectionProps) {
  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [cities, setCities] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);
  const [villages, setVillages] = useState<RegionItem[]>([]);

  const [loading, setLoading] = useState({
    province: false,
    city: false,
    district: false,
    village: false,
  });

  // Konversi semua ID ke String agar konsisten saat comparison
  const strProvinceId = provinceId ? String(provinceId) : "";
  const strCityId = cityId ? String(cityId) : "";
  const strDistrictId = districtId ? String(districtId) : "";
  const strVillageId = villageId ? String(villageId) : "";

  const parseList = (res: any): RegionItem[] => {
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res;
    return [];
  };

  // 1. Fetch Provinsi saat Mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading((p) => ({ ...p, province: true }));
      try {
        const response = await api.get("/regional/provinces");
        setProvinces(parseList(response));
      } catch (err) {
        console.error("Gagal mengambil data provinsi:", err);
      } finally {
        setLoading((p) => ({ ...p, province: false }));
      }
    };
    fetchProvinces();
  }, []);

  // 2. Fetch Cities jika strProvinceId berubah
  useEffect(() => {
    if (!strProvinceId) {
      setCities([]);
      setDistricts([]);
      setVillages([]);
      return;
    }

    const fetchCities = async () => {
      setLoading((p) => ({ ...p, city: true }));
      try {
        const response = await api.get(`/regional/provinces/${strProvinceId}/cities`);
        setCities(parseList(response));
      } catch (err) {
        console.error("Gagal mengambil data kota:", err);
        setCities([]);
      } finally {
        setLoading((p) => ({ ...p, city: false }));
      }
    };

    fetchCities();
  }, [strProvinceId]);

  // 3. Fetch Districts jika strCityId berubah
  useEffect(() => {
    if (!strCityId) {
      setDistricts([]);
      setVillages([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoading((p) => ({ ...p, district: true }));
      try {
        const response = await api.get(`/regional/cities/${strCityId}/districts`);
        setDistricts(parseList(response));
      } catch (err) {
        console.error("Gagal mengambil data kecamatan:", err);
        setDistricts([]);
      } finally {
        setLoading((p) => ({ ...p, district: false }));
      }
    };

    fetchDistricts();
  }, [strCityId]);

  // 4. Fetch Villages jika strDistrictId berubah
  useEffect(() => {
    if (!strDistrictId) {
      setVillages([]);
      return;
    }

    const fetchVillages = async () => {
      setLoading((p) => ({ ...p, village: true }));
      try {
        const response = await api.get(`/regional/districts/${strDistrictId}/villages`);
        setVillages(parseList(response));
      } catch (err) {
        console.error("Gagal mengambil data desa:", err);
        setVillages([]);
      } finally {
        setLoading((p) => ({ ...p, village: false }));
      }
    };

    fetchVillages();
  }, [strDistrictId]);

  return (
    <div className="mt-4">
      {title && <h4 className="text-xs font-bold text-gray-500 mb-2">{title}</h4>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Provinsi */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Provinsi *</label>
          <select
            name="province_id"
            required
            value={strProvinceId}
            onChange={(e) => onChange("province_id", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
          >
            <option value="">{loading.province ? "Memuat..." : "-- Pilih Provinsi --"}</option>
            {provinces.map((p) => {
              const val = String(p.code ?? p.id);
              return (
                <option key={p.id} value={val}>
                  {p.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Kabupaten / Kota */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Kabupaten / Kota *</label>
          <select
            name="city_id"
            required
            disabled={!strProvinceId || loading.city}
            value={strCityId}
            onChange={(e) => onChange("city_id", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none"
          >
            <option value="">{loading.city ? "Memuat..." : "-- Pilih Kota/Kab --"}</option>
            {cities.map((c) => {
              const val = String(c.code ?? c.id);
              return (
                <option key={c.id} value={val}>
                  {c.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Kecamatan */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Kecamatan *</label>
          <select
            name="district_id"
            required
            disabled={!strCityId || loading.district}
            value={strDistrictId}
            onChange={(e) => onChange("district_id", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none"
          >
            <option value="">{loading.district ? "Memuat..." : "-- Pilih Kecamatan --"}</option>
            {districts.map((d) => {
              const val = String(d.code ?? d.id);
              return (
                <option key={d.id} value={val}>
                  {d.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Desa / Kelurahan */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Desa / Kelurahan *</label>
          <select
            name="village_id"
            required
            disabled={!strDistrictId || loading.village}
            value={strVillageId}
            onChange={(e) => onChange("village_id", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none"
          >
            <option value="">{loading.village ? "Memuat..." : "-- Pilih Desa --"}</option>
            {villages.map((v) => {
              const val = String(v.code ?? v.id);
              return (
                <option key={v.id} value={val}>
                  {v.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}