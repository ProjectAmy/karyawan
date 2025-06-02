"use client";
import React from "react";
import Image from "next/image";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-green-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Tombol menu untuk mobile */}
        <button
          className="md:hidden focus:outline-none"
          aria-label="Buka menu"
          onClick={onMenuClick}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Logo dan Judul */}
        <div className="flex-1 flex items-center justify-center md:justify-start md:pl-12">
          <div className="flex items-center space-x-3">
            <Image 
              src="/images/logoalirsyad.png" 
              alt="Logo Al Irsyad" 
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <h1 className="font-bold text-xl">Dashboard HRD</h1>
          </div>
        </div>
        
        {/* Spacer untuk menyeimbangkan layout di mobile */}
        <span className="w-7 h-7 md:hidden" />
      </div>
    </header>
  );
}
