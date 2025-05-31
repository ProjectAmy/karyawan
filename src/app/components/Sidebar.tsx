"use client";
import React from "react";

export default function Sidebar({ onLogout, open, onClose }: { onLogout: () => void; open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-40 transition-opacity md:hidden ${open ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed z-40 top-0 left-0 min-h-screen w-64 bg-gray-800 text-white p-6 flex flex-col gap-6 transform transition-transform duration-200 md:static md:translate-x-0 md:flex md:w-60 md:min-h-screen ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button className="md:hidden mb-6 self-end" onClick={onClose} aria-label="Tutup menu">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <nav className="flex flex-col gap-4 mt-2 md:mt-0">
          <a href="/dashboard" className="hover:bg-green-700 px-4 py-2 rounded transition-colors">Home</a>
          <a href="/karyawan-baru" className="hover:bg-green-700 px-4 py-2 rounded transition-colors">Karyawan Baru</a>
          <button onClick={onLogout} className="mt-8 bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors">Log Out</button>
        </nav>
      </aside>
    </>
  );
}
