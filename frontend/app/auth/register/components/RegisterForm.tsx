"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Upload, FolderOpen } from "lucide-react";
import axios from "axios"; // 🟢 Import axios untuk type-guarding error
import api from "../../../lib/axios";
import Swal from "sweetalert2";

// 🟢 1. Definisi Tipe Data (Interface) untuk Wilayah
interface Region {
  code: string;
  name: string;
}

// 🟢 2. Definisi Tipe Data Form Data
interface RegisterFormData {
  cooperative_name: string;
  nib_cooperative: string;
  legal_approval_number: string;
  established_date: string;
  npwp: string;
  address_cooperative: string;
  postal_code: string;
  province_id: string;
  city_id: string;
  district_id: string;
  village_id: string;
  email_cooperative: string;
  phone_cooperative: string;
  capacity_ton: string;
  password: string;
  password_confirmation: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  // 🟢 3. Menghindari tipe implicit 'never[]' pada useState
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState<boolean>(false);

  const [legalFile, setLegalFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    cooperative_name: "",
    nib_cooperative: "",
    legal_approval_number: "",
    established_date: "",
    npwp: "",
    address_cooperative: "",
    postal_code: "",
    province_id: "",
    city_id: "",
    district_id: "",
    village_id: "",
    email_cooperative: "",
    phone_cooperative: "",
    capacity_ton: "",
    password: "",
    password_confirmation: "",
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  useEffect(() => {
    api
      .get<Region[]>("/regional/provinces")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Error Fetching Provinces:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLegalFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setLegalFile(file);

      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRegionChange = async (type: string, code: string) => {
    if (type === "province") {
      setFormData((prev) => ({
        ...prev,
        province_id: code,
        city_id: "",
        district_id: "",
        village_id: "",
      }));
      setCities([]);
      setDistricts([]);
      setVillages([]);
      if (code) {
        const res = await api.get<Region[]>(
          `/regional/provinces/${code}/cities`,
        );
        setCities(res.data);
      }
    } else if (type === "city") {
      setFormData((prev) => ({
        ...prev,
        city_id: code,
        district_id: "",
        village_id: "",
      }));
      setDistricts([]);
      setVillages([]);
      if (code) {
        const res = await api.get<Region[]>(
          `/regional/cities/${code}/districts`,
        );
        setDistricts(res.data);
      }
    } else if (type === "district") {
      setFormData((prev) => ({ ...prev, district_id: code, village_id: "" }));
      setVillages([]);
      if (code) {
        const res = await api.get<Region[]>(
          `/regional/districts/${code}/villages`,
        );
        setVillages(res.data);
      }
    } else if (type === "village") {
      setFormData((prev) => ({ ...prev, village_id: code }));
    }
  };

  const generateCooperativeCode = (name: string): string => {
    const initials = name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 4);

    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900);

    return `KOP-${initials}-${timestamp}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      Toast.fire({
        icon: "warning",
        title: "Konfirmasi password tidak cocok!",
      });
      return;
    }

    if (formData.nib_cooperative.length !== 13) {
      Toast.fire({
        icon: "warning",
        title: "Nomor Induk Berusaha (NIB) harus tepat 13 digit!",
      });
      return;
    }

    if (!legalFile) {
      Toast.fire({
        icon: "warning",
        title: "Dokumen Persetujuan Hukum wajib diunggah!",
      });
      return;
    }

    setLoading(true);

    // 🟢 4. Menggunakan tipe data Region murni (tanpa p: any)
    const provinceName =
      provinces.find((p) => p.code === formData.province_id)?.name || "";
    const cityName =
      cities.find((c) => c.code === formData.city_id)?.name || "";
    const districtName =
      districts.find((d) => d.code === formData.district_id)?.name || "";
    const villageName =
      villages.find((v) => v.code === formData.village_id)?.name || "";

    const formDataPayload = new FormData();

    formDataPayload.append("cooperative_name", formData.cooperative_name);
    formDataPayload.append(
      "cooperative_code",
      generateCooperativeCode(formData.cooperative_name),
    );
    formDataPayload.append("nib_cooperative", formData.nib_cooperative);
    formDataPayload.append("npwp", formData.npwp);
    formDataPayload.append(
      "legal_approval_number",
      formData.legal_approval_number,
    );
    formDataPayload.append("established_date", formData.established_date);
    formDataPayload.append("address_cooperative", formData.address_cooperative);
    formDataPayload.append("email_cooperative", formData.email_cooperative);
    formDataPayload.append("phone_cooperative", formData.phone_cooperative);
    formDataPayload.append("postal_code", formData.postal_code);
    formDataPayload.append("province", provinceName);
    formDataPayload.append("city_koor", cityName);
    formDataPayload.append("district", districtName);
    formDataPayload.append("village", villageName);
    formDataPayload.append("capacity_ton", formData.capacity_ton);
    formDataPayload.append("password", formData.password);

    formDataPayload.append("legal_approval_document", legalFile);

    try {
      const response = await api.post("/cooperative/register", formDataPayload);

      const successMessage =
        response.data?.message || "Registrasi Koperasi sukses diajukan!, Tunggu sampai disetujui Kemenko";

      Toast.fire({
        icon: "success",
        title: successMessage,
      });

      router.push("/auth/login");
    } catch (err: unknown) {
      // 🟢 5. Penanganan Error yang Type-Safe menggunakan Axios Error Guard
      let errorMsg = "Gagal registrasi, periksa kembali input data.";

      if (axios.isAxiosError(err) && err.response) {
        console.error("Full response data:", err.response.data);

        if (err.response.status === 422) {
          const errors = err.response.data as Record<string, string[]>;
          const firstErrorKey = Object.keys(errors)[0];
          if (firstErrorKey && errors[firstErrorKey]) {
            errorMsg = errors[firstErrorKey][0];
          }
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message as string;
        }
      }

      Toast.fire({
        icon: "error",
        title: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      cooperative_name: "",
      nib_cooperative: "",
      legal_approval_number: "",
      established_date: "",
      npwp: "",
      address_cooperative: "",
      postal_code: "",
      province_id: "",
      city_id: "",
      district_id: "",
      village_id: "",
      email_cooperative: "",
      phone_cooperative: "",
      capacity_ton: "",
      password: "",
      password_confirmation: "",
    });
    setLegalFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const inputClass =
    "border border-gray-300 p-3.5 rounded-lg w-full text-base text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "block text-base font-semibold mb-2 text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nama Koperasi & NIB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Nama Koperasi <span className="text-red-500">*</span>
          </label>
          <input
            name="cooperative_name"
            placeholder="Contoh : Koperasi Tani Makmur"
            value={formData.cooperative_name}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>
            Nomor Induk Berusaha (NIB) <span className="text-red-500">*</span>
          </label>
          <input
            name="nib_cooperative"
            placeholder="Masukan 13 digit NIB Koperasi"
            value={formData.nib_cooperative}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 13);
              setFormData((prev) => ({ ...prev, nib_cooperative: val }));
            }}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Upload Berkas Dokumen & Nomor Berkas Dokumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Upload Berkas / SK Pendirian <span className="text-red-500">*</span>
          </label>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center justify-between gap-4 border-2 border-dashed rounded-lg p-4 cursor-pointer transition
              ${
                isDragging
                  ? "border-green-500 bg-green-50/60"
                  : "border-gray-300 bg-gray-50/60 hover:border-green-400"
              }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0 bg-green-50 text-green-600 rounded-lg p-3">
                <Upload size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-base text-black truncate">
                  <span className="font-semibold">Pilih file</span> atau seret
                  &amp; lepas file di sini
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Format dokumen: PDF, JPG, JPEG, PNG
                  <br />
                  Maksimal ukuran file: 2MB
                </p>
                {legalFile && (
                  <p className="text-xs text-green-700 font-medium mt-1 truncate">
                    Berkas dipilih: {legalFile.name}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="shrink-0 flex items-center gap-2 border border-green-200 bg-green-50 text-green-700 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-green-100 transition whitespace-nowrap"
            >
              <FolderOpen size={16} />
              Pilih File
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              required={!legalFile}
            />
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Format dokumen: PDF, JPG, JPEG, PNG (Maksimal ukuran file: 2MB)
          </p>
        </div>
        <div>
          <label className={labelClass}>
            Nomor SK / Pendaftaran Hukum <span className="text-red-500">*</span>
          </label>
          <input
            name="legal_approval_number"
            placeholder="Contoh : AHU-876345S-835 Tahun 2026"
            value={formData.legal_approval_number}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Tanggal Berdiri & NPWP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Tanggal Berdiri <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="established_date"
            value={formData.established_date}
            onChange={handleChange}
            className={`${inputClass} ${formData.established_date ? "text-black" : "text-gray-400"}`}
            required
          />
        </div>
        <div>
          <label className={labelClass}>
            NPWP Koperasi <span className="text-red-500">*</span>
          </label>
          <input
            name="npwp"
            placeholder="Contoh : 6296-8346-93935"
            value={formData.npwp}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Alamat & Kode Pos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Alamat Koperasi <span className="text-red-500">*</span>
          </label>
          <input
            name="address_cooperative"
            placeholder="Masukan Alamat koperasi lengkap"
            value={formData.address_cooperative}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>
            Kode Pos <span className="text-red-500">*</span>
          </label>
          <input
            name="postal_code"
            placeholder="Masukan Kode Pos"
            value={formData.postal_code}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Provinsi & Kabupaten/Kota */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Provinsi <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.province_id}
            onChange={(e) => handleRegionChange("province", e.target.value)}
            className={`${inputClass} ${formData.province_id ? "text-black" : "text-gray-400"}`}
            required
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>
            Kabupaten/Kota <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.city_id}
            onChange={(e) => handleRegionChange("city", e.target.value)}
            className={`${inputClass} ${formData.city_id ? "text-black" : "text-gray-400"}`}
            required
          >
            <option value="">Pilih Kabupaten/Kota</option>
            {cities.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kecamatan & Desa/Kelurahan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Kecamatan <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.district_id}
            onChange={(e) => handleRegionChange("district", e.target.value)}
            className={`${inputClass} ${formData.district_id ? "text-black" : "text-gray-400"}`}
            required
          >
            <option value="">Pilih Kecamatan</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>
            Desa/Kelurahan <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.village_id}
            onChange={(e) => handleRegionChange("village", e.target.value)}
            className={`${inputClass} ${formData.village_id ? "text-black" : "text-gray-400"}`}
            required
          >
            <option value="">Pilih Desa/Kelurahan</option>
            {villages.map((v) => (
              <option key={v.code} value={v.code}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Email, No. Telepon, Kapasitas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>
            Email Koperasi <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email_cooperative"
            placeholder="admin@gmail.com"
            value={formData.email_cooperative}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>
            No. Telepon Koperasi <span className="text-red-500">*</span>
          </label>
          <input
            name="phone_cooperative"
            placeholder="08xxxxxxxxxx"
            value={formData.phone_cooperative}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>
            Kapasitas Penyimpanan Gudang (Ton){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="capacity_ton"
            placeholder="Contoh : 200"
            value={formData.capacity_ton}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Password & Konfirmasi Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Masukan Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Masukan password"
              value={formData.password}
              onChange={handleChange}
              className={`${inputClass} pr-10`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label className={labelClass}>
            Konfirmasi Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswordConfirmation ? "text" : "password"}
              name="password_confirmation"
              placeholder="Konfirmasi password"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`${inputClass} pr-10`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirmation((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPasswordConfirmation ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tombol Batal & Kirim */}
      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-300 transition"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Kirim"}
        </button>
      </div>
    </form>
  );
}
