"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";


export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 relative">
        <Sidebar
          onLogout={handleLogout}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 md:p-8 bg-gray-50">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Ahlan Wa Sahlan, Kamal!</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
  <div className="bg-blue-50 rounded p-3 text-center">
    <div className="text-xs md:text-sm text-gray-500">Jumlah Guru</div>
    <div className="font-extrabold text-lg md:text-xl text-blue-800">6</div>
  </div>
  <div className="bg-blue-50 rounded p-3 text-center">
    <div className="text-xs md:text-sm text-gray-500">Jumlah Tendik</div>
    <div className="font-extrabold text-lg md:text-xl text-blue-800">4</div>
  </div>
  <div className="bg-blue-50 rounded p-3 text-center">
    <div className="text-xs md:text-sm text-gray-500">Total Karyawan</div>
    <div className="font-extrabold text-lg md:text-xl text-blue-800">10</div>
  </div>
  <div className="bg-blue-50 rounded p-3 text-center">
    <div className="text-xs md:text-sm text-gray-500">Karyawan Percobaan</div>
    <div className="font-extrabold text-lg md:text-xl text-blue-800">2</div>
  </div>
  <div className="bg-blue-50 rounded p-3 text-center">
    <div className="text-xs md:text-sm text-gray-500">Karyawan Tidak Tetap</div>
    <div className="font-extrabold text-lg md:text-xl text-blue-800">2</div>
  </div>
  <div className="bg-blue-50 rounded p-3 text-center">
    <div className="text-xs md:text-sm text-gray-500">Karyawan Tetap</div>
    <div className="font-extrabold text-lg md:text-xl text-blue-800">6</div>
  </div>
</div>
<div className="bg-white p-2 md:p-6 rounded shadow-md text-gray-700 text-xs md:text-base overflow-x-auto">
  <table className="min-w-[700px] w-full border-collapse">
    <thead>
      <tr className="bg-gray-100 text-gray-700">
        <th className="border p-2">No</th>
        <th className="border p-2">Nama Lengkap</th>
        <th className="border p-2">Nomor WA</th>
        <th className="border p-2">Status</th>
        <th className="border p-2">Posisi</th>
        <th className="border p-2">Keterangan</th>
        <th className="border p-2">Jabatan</th>
        <th className="border p-2">Awal Masuk</th>
        <th className="border p-2">Umur</th>
        <th className="border p-2">Masa Kerja</th>
<th className="border p-2">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border p-2 text-center">1</td>
        <td className="border p-2"><a href="/karyawan/ahmad-fauzi" className="text-blue-700 underline hover:text-blue-900">Ahmad Fauzi</a></td>
        <td className="border p-2">081234567890</td>
        <td className="border p-2">Tetap</td>
        <td className="border p-2">Guru</td>
        <td className="border p-2">Guru Mapel</td>
        <td className="border p-2">Wali Kelas</td>
        <td className="border p-2">2018-07-01</td>
        <td className="border p-2">35</td>
        <td className="border p-2">6 thn</td>
        <td className="border p-2 text-center">
          <a href="/karyawan/ahmad-fauzi/edit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2 inline-block text-center">Edit</a>
          <button className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">Delete</button>
        </td>
      </tr>
      <tr>
        <td className="border p-2 text-center">2</td>
        <td className="border p-2">Siti Aminah</td>
        <td className="border p-2">081234567891</td>
        <td className="border p-2">Tetap</td>
        <td className="border p-2">Tendik</td>
        <td className="border p-2">Bendahara</td>
        <td className="border p-2">-</td>
        <td className="border p-2">2017-01-15</td>
        <td className="border p-2">40</td>
        <td className="border p-2">7 thn</td>
<td className="border p-2 text-center">
  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2">Edit</button>
  <button className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">Delete</button>
</td>
      </tr>
      <tr>
        <td className="border p-2 text-center">3</td>
        <td className="border p-2">Budi Santoso</td>
        <td className="border p-2">081234567892</td>
        <td className="border p-2">Percobaan</td>
        <td className="border p-2">Guru</td>
        <td className="border p-2">Guru Kelas</td>
        <td className="border p-2">-</td>
        <td className="border p-2">2025-01-10</td>
        <td className="border p-2">24</td>
        <td className="border p-2">5 bln</td>
<td className="border p-2 text-center">
  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2">Edit</button>
  <button className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">Delete</button>
</td>
      </tr>
      <tr>
        <td className="border p-2 text-center">4</td>
        <td className="border p-2">Dewi Lestari</td>
        <td className="border p-2">081234567893</td>
        <td className="border p-2">Tidak Tetap</td>
        <td className="border p-2">Guru</td>
        <td className="border p-2">Guru Mapel</td>
        <td className="border p-2">Waka Kurikulum</td>
        <td className="border p-2">2020-09-01</td>
        <td className="border p-2">29</td>
        <td className="border p-2">4 thn</td>
<td className="border p-2 text-center">
  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2">Edit</button>
  <button className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">Delete</button>
</td>
      </tr>
      <tr>
        <td className="border p-2 text-center">5</td>
        <td className="border p-2">Eka Pratama</td>
        <td className="border p-2">081234567894</td>
        <td className="border p-2">Tetap</td>
        <td className="border p-2">Tendik</td>
        <td className="border p-2">TU</td>
        <td className="border p-2">-</td>
        <td className="border p-2">2019-03-20</td>
        <td className="border p-2">32</td>
        <td className="border p-2">5 thn</td>
<td className="border p-2 text-center">
  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2">Edit</button>
  <button className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">Delete</button>
</td>
      </tr>
      <tr>
        <td className="border p-2 text-center">6</td>
        <td className="border p-2">Fatimah Zahra</td>
        <td className="border p-2">081234567895</td>
        <td className="border p-2">Tetap</td>
        <td className="border p-2">Guru</td>
        <td className="border p-2">Guru Kelas</td>
        <td className="border p-2">Wali Kelas</td>
        <td className="border p-2">2016-08-10</td>
        <td className="border p-2">36</td>
        <td className="border p-2">8 thn</td>
<td className="border p-2 text-center">
  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2">Edit</button>
  <button className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">Delete</button>
</td>
      </tr>
      <tr>
        <td className="border p-2 text-center">7</td>
        <td className="border p-2">Gilang Ramadhan</td>
        <td className="border p-2">081234567896</td>
        <td className="border p-2">Tidak Tetap</td>
        <td className="border p-2">Tendik</td>
        <td className="border p-2">OB</td>
        <td className="border p-2">-</td>
        <td className="border p-2">2023-02-01</td>
        <td className="border p-2">27</td>
        <td className="border p-2">1 thn</td>
<td className="border p-2 text-center">
  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2">Edit</button>
  <button className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">Delete</button>
</td>
      </tr>
      <tr>
        <td className="border p-2 text-center">8</td>
        <td className="border p-2">Hana Nuraini</td>
        <td className="border p-2">081234567897</td>
        <td className="border p-2">Tetap</td>
        <td className="border p-2">Guru</td>
        <td className="border p-2">Guru Mapel</td>
        <td className="border p-2">-</td>
        <td className="border p-2">2021-11-11</td>
        <td className="border p-2">30</td>
        <td className="border p-2">3 thn</td>
<td className="border p-2 text-center">
  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2">Edit</button>
  <button className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">Delete</button>
</td>
      </tr>
      <tr>
        <td className="border p-2 text-center">9</td>
        <td className="border p-2">Imam Syafii</td>
        <td className="border p-2">081234567898</td>
        <td className="border p-2">Percobaan</td>
        <td className="border p-2">Tendik</td>
        <td className="border p-2">OB</td>
        <td className="border p-2">-</td>
        <td className="border p-2">2025-04-01</td>
        <td className="border p-2">22</td>
        <td className="border p-2">2 bln</td>
<td className="border p-2 text-center">
  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2">Edit</button>
  <button className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">Delete</button>
</td>
      </tr>
      <tr>
        <td className="border p-2 text-center">10</td>
        <td className="border p-2">Joko Susilo</td>
        <td className="border p-2">081234567899</td>
        <td className="border p-2">Tetap</td>
        <td className="border p-2">Guru</td>
        <td className="border p-2">Guru Mapel</td>
        <td className="border p-2">Kepsek</td>
        <td className="border p-2">2010-01-01</td>
        <td className="border p-2">50</td>
        <td className="border p-2">15 thn</td>
<td className="border p-2 text-center">
  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2">Edit</button>
  <button className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">Delete</button>
</td>
      </tr>
    </tbody>
  </table>
</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
