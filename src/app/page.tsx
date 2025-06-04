"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
          <div className="relative w-60 h-60 rounded-full overflow-hidden">
            <Image 
              src="/images/logoalirsyad.png" 
              alt="Logo Al Irsyad"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
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
        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400 text-sm">atau</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          type="button"
          onClick={async () => {
            try {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/dashboard`
                }
              });
              if (error) throw error;
            } catch (err: unknown) {
              if (err instanceof Error) {
                setError(err.message || 'Gagal login dengan Google');
              } else {
                setError('Gagal login dengan Google');
              }
            }
          }}
          className="bg-white border border-gray-400 text-gray-800 rounded-md px-4 py-2 font-bold hover:bg-gray-100 transition text-base shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.53 7.83 2.82l5.77-5.77C34.36 3.17 29.67 1 24 1 14.61 1 6.44 6.96 2.69 15.14l6.71 5.21C11.04 13.41 16.02 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.54c0-1.64-.15-3.2-.43-4.68H24v9.18h12.36c-.53 2.78-2.16 5.13-4.6 6.71l7.1 5.51c4.15-3.83 6.24-9.47 6.24-16.72z"/><path fill="#FBBC05" d="M9.4 28.89c-1.1-3.25-1.1-6.73 0-9.98l-6.71-5.21C.99 18.08 0 20.94 0 24c0 3.06.99 5.92 2.69 8.3l6.71-5.21z"/><path fill="#EA4335" d="M24 46.5c5.67 0 10.36-1.87 13.8-5.09l-7.1-5.51c-1.98 1.33-4.52 2.13-6.7 2.13-5.98 0-10.96-3.91-12.79-9.29l-6.71 5.21C6.44 41.04 14.61 46.5 24 46.5z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Login dengan Google
        </button>
      </form>
    </div>
  );
}
