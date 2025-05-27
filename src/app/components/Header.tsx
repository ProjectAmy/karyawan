"use client";
import React from "react";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
      <button
        className="md:hidden mr-2 focus:outline-none"
        aria-label="Buka menu"
        onClick={onMenuClick}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span className="font-bold text-xl">Dashboard HRD</span>
      <span className="md:hidden w-7 h-7" /> {/* Spacer */}
    </header>
  );
}
