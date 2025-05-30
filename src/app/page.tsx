"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) throw error;
      
      // Redirect to dashboard if login is successful
      router.push("/dashboard");
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-5 w-full max-w-sm border border-gray-200"
      >
        {/* Logo Al Irsyad */}
        <div className="flex justify-center mb-4">
          <div className="w-60 h-60 rounded-full overflow-hidden">
            <img 
              src="/images/logoalirsyad.png" 
              alt="Logo Al Irsyad" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">HRD Al Irsyad</h1>
        {error && (
          <div className="text-red-500 text-sm mb-3 text-center">
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-400 text-gray-800 placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 text-gray-800 placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="bg-green-600 text-white rounded-md px-4 py-2 font-bold hover:bg-green-700 transition text-base shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}
