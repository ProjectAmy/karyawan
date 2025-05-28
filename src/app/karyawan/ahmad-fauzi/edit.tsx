"use client";
import React, { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

export default function EditAhmadFauzi() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => {
    window.location.href = "/";
  };
  // State untuk field data karyawan
  const [form, setForm] = useState({
    nama: "Ahmad Fauzi",
    wa: "081234567890",
    status: "Tetap",
    posisi: "Guru",
    keterangan: "Guru Mapel",
    jabatan: "Wali Kelas",
    awalMasuk: "2020-01-01",
    masaKerja: "5 tahun",
    umur: "30 tahun",
    email: "ahmad.fauzi@email.com",
    alamat: "Jl. Merdeka No. 123, Jakarta"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Data berhasil disimpan! (simulasi)");
    // Implementasi penyimpanan data ke backend bisa ditambahkan di sini
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
        <main className="flex-1 flex flex-col items-center justify-center py-10">
          <form onSubmit={handleSave} className="bg-white p-8 rounded shadow-md w-full max-w-xl">
            <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">Edit Data Karyawan</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <label className="font-semibold text-gray-700">Nama Lengkap:
                <input type="text" name="nama" value={form.nama} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
              <label className="font-semibold text-gray-700">Nomor WA:
                <input type="text" name="wa" value={form.wa} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
              <label className="font-semibold text-gray-700">Status:
                <input type="text" name="status" value={form.status} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
              <label className="font-semibold text-gray-700">Posisi:
                <input type="text" name="posisi" value={form.posisi} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
              <label className="font-semibold text-gray-700">Keterangan:
                <input type="text" name="keterangan" value={form.keterangan} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
              <label className="font-semibold text-gray-700">Jabatan:
                <input type="text" name="jabatan" value={form.jabatan} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
              <label className="font-semibold text-gray-700">Awal Masuk:
                <input type="date" name="awalMasuk" value={form.awalMasuk} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
              <label className="font-semibold text-gray-700">Masa Kerja:
                <input type="text" name="masaKerja" value={form.masaKerja} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
              <label className="font-semibold text-gray-700">Umur:
                <input type="text" name="umur" value={form.umur} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
              <label className="font-semibold text-gray-700">Email:
                <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
              <label className="font-semibold text-gray-700">Alamat:
                <input type="text" name="alamat" value={form.alamat} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
              </label>
            </div>
            <div className="flex justify-center mt-8">
              <button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded transition-colors text-white font-semibold">Save</button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
