"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-600 text-center py-3 text-sm mt-auto">
      &copy; {new Date().getFullYear()} Dashboard HRD By Project Amy
    </footer>
  );
}
