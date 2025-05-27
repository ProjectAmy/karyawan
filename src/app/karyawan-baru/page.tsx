"use client";
import React, { useState } from "react";
import Image from "next/image";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function KaryawanBaruPage() {
  const [form, setForm] = useState({
    nama: "",
    tanggalLahir: "",
    alamat: "",
    noKTP: "",
    noKK: "",
    email: "",
    noWA: "",
    fotoKTP: null as File | null,
    fotoKK: null as File | null,
    fotoBukuNikah: null as File | null,
    fotoAkteAnak: null as File | null,
  });
  const [preview, setPreview] = useState<{[key:string]: string | null}>({});

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm((f) => ({ ...f, [name]: files[0] }));
      setPreview((p) => ({ ...p, [name]: URL.createObjectURL(files[0]) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard";
    // Di sini bisa ditambahkan logic submit ke backend
  };


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 relative bg-gray-100">
        <Sidebar
          onLogout={handleLogout}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 flex flex-col items-center justify-center py-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded shadow-md w-full max-w-lg flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-2 text-blue-800 text-center">Input Karyawan Baru</h1>
        <input type="text" name="nama" value={form.nama} onChange={handleInput} placeholder="Nama Lengkap" className="border rounded px-3 py-2 w-full text-gray-800 placeholder:text-gray-500" />
        <input type="date" name="tanggalLahir" value={form.tanggalLahir} onChange={handleInput} placeholder="Tanggal Lahir" className="border rounded px-3 py-2 w-full text-gray-800 placeholder:text-gray-500" />
        <textarea name="alamat" value={form.alamat} onChange={handleInput} placeholder="Alamat" className="border rounded px-3 py-2 w-full text-gray-800 placeholder:text-gray-500" />
        <input type="text" name="noKTP" value={form.noKTP} onChange={handleInput} placeholder="No KTP" className="border rounded px-3 py-2 w-full text-gray-800 placeholder:text-gray-500" />
        <input type="text" name="noKK" value={form.noKK} onChange={handleInput} placeholder="No KK" className="border rounded px-3 py-2 w-full text-gray-800 placeholder:text-gray-500" />
        <input type="email" name="email" value={form.email} onChange={handleInput} placeholder="Email" className="border rounded px-3 py-2 w-full text-gray-800 placeholder:text-gray-500" />
        <input type="text" name="noWA" value={form.noWA} onChange={handleInput} placeholder="Nomor WA" className="border rounded px-3 py-2 w-full text-gray-800 placeholder:text-gray-500" />
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">Upload Foto KTP</label>
          <input type="file" name="fotoKTP" accept="image/*" onChange={handleFile} className="w-full text-gray-800" style={{color:'#1e293b'}} />
          {preview.fotoKTP && <Image src={preview.fotoKTP} alt="Preview KTP" width={120} height={80} className="mt-2 h-20 rounded" />}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">Upload Foto KK</label>
          <input type="file" name="fotoKK" accept="image/*" onChange={handleFile} className="w-full text-gray-800" style={{color:'#1e293b'}} />
          {preview.fotoKK && <Image src={preview.fotoKK} alt="Preview KK" width={120} height={80} className="mt-2 h-20 rounded" />}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">Upload Foto Buku Nikah</label>
          <input type="file" name="fotoBukuNikah" accept="image/*" onChange={handleFile} className="w-full text-gray-800" style={{color:'#1e293b'}} />
          {preview.fotoBukuNikah && <Image src={preview.fotoBukuNikah} alt="Preview Buku Nikah" width={120} height={80} className="mt-2 h-20 rounded" />}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">Upload Foto Akte Anak</label>
          <input type="file" name="fotoAkteAnak" accept="image/*" onChange={handleFile} className="w-full text-gray-800" style={{color:'#1e293b'}} />
          {preview.fotoAkteAnak && <Image src={preview.fotoAkteAnak} alt="Preview Akte Anak" width={120} height={80} className="mt-2 h-20 rounded" />}
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-bold mt-2">Simpan</button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
