"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="grow bg-white flex items-center justify-center p-6">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-green-700 p-6 rounded-t-lg text-white text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold tracking-wide">Tentang Kami</h1>
            </div>
            <div className="bg-white rounded-b-lg shadow p-6 text-gray-800 space-y-4">
              <p className="text-lg font-semibold text-green-700">Aplikasi Dashboard HRD</p>
              <p>
                <strong>Versi:</strong> 1.0.0
              </p>
              <p>
                Dashboard HRD ini adalah aplikasi modern yang dirancang untuk memudahkan pengelolaan data karyawan di perusahaan Anda. Dengan tampilan yang intuitif dan responsif, aplikasi ini memberikan pengalaman pengguna yang nyaman baik di desktop maupun perangkat mobile.
              </p>
              <p className="font-semibold">Fitur-fitur utama:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Manajemen data karyawan (tambah, edit, hapus, detail)</li>
                <li>Pengelolaan status kehadiran (coming soon)</li>
                <li>Fitur pencarian dan filter data (coming soon)</li>
                <li>Keamanan login dan logout</li>
                <li>Ubah password secara mandiri</li>
                <li>Dashboard dengan statistik dan informasi penting (coming soon)</li>
              </ul>
              <p>
                Aplikasi ini dikembangkan dengan tujuan memberikan kemudahan bagi tim HRD dalam mengelola data secara efisien, aman, dan terpusat. Semua fitur dapat diakses dengan mudah melalui sidebar, dan setiap halaman dilengkapi dengan navigasi yang jelas.
              </p>
              <p className="font-semibold text-green-700">Aplikasi ini dibuat dan dikembangkan oleh <span className="font-bold">Project Amy</span>.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
