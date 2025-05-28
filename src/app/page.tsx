"use client"
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Sementara langsung redirect ke dashboard
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-5 w-full max-w-sm border border-gray-200"
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">H.R.D</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-400 text-gray-800 placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 text-gray-800 placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md px-4 py-2 font-bold hover:bg-blue-700 transition text-base shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}
