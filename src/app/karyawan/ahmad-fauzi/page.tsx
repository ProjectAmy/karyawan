"use client";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { useState } from "react";

export default function AhmadFauziDetail() {
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
        <main className="flex-1 flex flex-col items-center justify-center py-10">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
            <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">Data Diri Karyawan</h1>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <dt className="font-semibold text-gray-700">Nama Lengkap:</dt>
              <dd className="text-gray-800">Ahmad Fauzi</dd>
              <dt className="font-semibold text-gray-700">Nomor WA:</dt>
              <dd className="text-gray-800">081234567890</dd>
              <dt className="font-semibold text-gray-700">Status:</dt>
              <dd className="text-gray-800">Tetap</dd>
              <dt className="font-semibold text-gray-700">Posisi:</dt>
              <dd className="text-gray-800">Guru</dd>
              <dt className="font-semibold text-gray-700">Keterangan:</dt>
              <dd className="text-gray-800">Guru Mapel</dd>
              <dt className="font-semibold text-gray-700">Jabatan:</dt>
              <dd className="text-gray-800">Wali Kelas</dd>
              <dt className="font-semibold text-gray-700">Awal Masuk:</dt>
              <dd className="text-gray-800">01 Januari 2020</dd>
              <dt className="font-semibold text-gray-700">Masa Kerja:</dt>
              <dd className="text-gray-800">5 tahun</dd>
              <dt className="font-semibold text-gray-700">Umur:</dt>
              <dd className="text-gray-800">30 tahun</dd>
              <dt className="font-semibold text-gray-700">Email:</dt>
              <dd className="text-gray-800">ahmad.fauzi@email.com</dd>
              <dt className="font-semibold text-gray-700">Alamat:</dt>
              <dd className="text-gray-800">Jl. Merdeka No. 123, Jakarta</dd>
            </dl>
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4 text-blue-700 text-center">Dokumen Foto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <img src="https://dummyimage.com/200x120/cccccc/444444&text=KTP" alt="Foto KTP" className="rounded shadow mb-2 w-48 h-28 object-cover" />
                  <span className="text-gray-700 text-sm">Foto KTP</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="https://dummyimage.com/200x120/cccccc/444444&text=KK" alt="Foto KK" className="rounded shadow mb-2 w-48 h-28 object-cover" />
                  <span className="text-gray-700 text-sm">Foto KK</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="https://dummyimage.com/200x120/cccccc/444444&text=Buku+Nikah" alt="Foto Buku Nikah" className="rounded shadow mb-2 w-48 h-28 object-cover" />
                  <span className="text-gray-700 text-sm">Foto Buku Nikah</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="https://dummyimage.com/200x120/cccccc/444444&text=Akte+Anak" alt="Foto Akte Anak" className="rounded shadow mb-2 w-48 h-28 object-cover" />
                  <span className="text-gray-700 text-sm">Foto Akte Anak</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
