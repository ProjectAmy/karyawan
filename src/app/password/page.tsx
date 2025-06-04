"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="grow bg-white flex items-center justify-center p-6">
          <div className="w-full max-w-md mx-auto">
            <div className="bg-green-700 p-6 rounded-t-lg text-white text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold tracking-wide">Ubah Password</h1>
            </div>
            <div className="bg-white rounded-b-lg shadow p-6 text-gray-800">
              <form className="space-y-6">
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">Password Lama</label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-1">Password Baru</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="reenterPassword" className="block text-sm font-medium mb-1">Re-enter Password</label>
                  <input
                    type="password"
                    id="reenterPassword"
                    name="reenterPassword"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded transition-colors mt-4"
                >
                  Ubah
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
