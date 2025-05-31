"use client";
import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Karyawan {
  id: string;
  nama: string;
  wa?: string;
  tanggal_lahir?: string;
  alamat?: string;
  email?: string;
  no_kk?: string;
  no_ktp?: string;
  jabatan: string;
  posisi?: string;
  divisi: string;
  status: string;
  status_kehadiran?: string;
  awal_masuk?: string;
  foto?: string | null;
  unit?: string;
  keterangan?: string;
  created_at: string;
  deleted_at?: string | null;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [karyawanData, setKaryawanData] = useState<Karyawan[]>([]);
  const [searchQuery] = useState('');
  const router = useRouter();

  // Fungsi untuk mendapatkan nama hari dalam bahasa Indonesia
  const getDayName = (date: Date): string => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };

  // Fungsi untuk mendapatkan nama bulan dalam bahasa Indonesia
  const getMonthName = (date: Date): string => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[date.getMonth()];
  };

  // Fetch data karyawan dari Supabase
  const fetchKaryawanData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('karyawan')
        .select()
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      // Filter out any null or undefined data
      const validData = data?.filter(Boolean) || [];
      setKaryawanData(validData);
      
      if (validData.length === 0) {
        console.log('No data received');
      }
    } catch (error) {
      console.error('Error fetching karyawan data:', error);
      setKaryawanData([]);
    }
  }, []);

  // Update tanggal saat komponen dimuat
  useEffect(() => {
    const now = new Date();
    const day = getDayName(now);
    const date = now.getDate();
    const month = getMonthName(now);
    const year = now.getFullYear();
    setCurrentDate(`${day}, ${date} ${month} ${year}`);
    
    // Fetch data saat komponen dimuat
    fetchKaryawanData();
    
    // Set up interval untuk refresh data setiap 30 detik
    const interval = setInterval(fetchKaryawanData, 30000);
    return () => clearInterval(interval);
  }, [fetchKaryawanData]);

  // Handle user authentication state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
          router.push('/login');
          return;
        }
        
        if (!user) {
          router.push('/login');
          return;
        }
        
        const name = user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'User');
        setUserName(name);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      await fetchKaryawanData();
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('karyawan')
        .select('*')
        .or('deleted_at.is.null');

      if (error) {
        console.error('Error searching:', error);
        return;
      }

      setKaryawanData(data || []);
    } catch (error) {
      console.error('Error searching:', error);
    }
  }, [searchQuery, fetchKaryawanData]);

  const handleLogout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Handle update status kehadiran
  const handleUpdateStatus = useCallback(async (id: string, status: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('karyawan')
        .update({ status_kehadiran: status })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      // Update the local state with the updated data
      setKaryawanData(prevData => 
        prevData.map(karyawan => 
          karyawan.id === id ? { ...karyawan, status_kehadiran: status } : karyawan
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }, []);

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('karyawan')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error deleting employee:', error);
        return;
      }
      
      setKaryawanData(prevData => prevData.filter(k => k.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }, []);

  // Helper function to calculate age
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Helper function to calculate work duration
  const calculateWorkDuration = (startDate: string): string => {
    const start = new Date(startDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

    if (years > 0) return `${years} thn`;
    if (months > 0) return `${months} bln`;
    return `${days} hari`;
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
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-gray-800">Ahlan Wa Sahlan, {userName}!</h2>
          <p className="text-sm text-gray-600">{currentDate}</p>
          {karyawanData.length === 0 ? (
            <div className="text-center text-red-500 space-y-2">
              <p>Tidak ada data karyawan yang ditampilkan.</p>
              <p>Hal ini bisa terjadi karena:</p>
              <ul className="list-disc list-inside">
                <li>Belum ada data karyawan yang dimasukkan</li>
                <li>Semua karyawan sudah dihapus (deleted_at tidak null)</li>
                <li>Ada masalah koneksi dengan database</li>
              </ul>
              <p>Silakan cek kembali di Supabase atau coba refresh halaman.</p>
            </div>
          ) : null}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 rounded p-3 text-center">
              <div className="text-xs md:text-sm text-gray-500">Jumlah Guru</div>
              <div className="font-extrabold text-lg md:text-xl text-blue-800">
                {karyawanData.filter(k => k.posisi === 'guru').length}
              </div>
            </div>
            <div className="bg-blue-50 rounded p-3 text-center">
              <div className="text-xs md:text-sm text-gray-500">Jumlah Tendik</div>
              <div className="font-extrabold text-lg md:text-xl text-blue-800">
                {karyawanData.filter(k => k.posisi === 'tendik').length}
              </div>
            </div>
            <div className="bg-blue-50 rounded p-3 text-center">
              <div className="text-xs md:text-sm text-gray-500">Total Karyawan</div>
              <div className="font-extrabold text-lg md:text-xl text-blue-800">
                {karyawanData.length}
              </div>
            </div>
            <div className="bg-blue-50 rounded p-3 text-center">
              <div className="text-xs md:text-sm text-gray-500">Karyawan Percobaan</div>
              <div className="font-extrabold text-lg md:text-xl text-blue-800">
                {karyawanData.filter(k => k.status === 'percobaan').length}
              </div>
            </div>
            <div className="bg-blue-50 rounded p-3 text-center">
              <div className="text-xs md:text-sm text-gray-500">Karyawan Tidak Tetap</div>
              <div className="font-extrabold text-lg md:text-xl text-blue-800">
                {karyawanData.filter(k => k.status === 'tidak_tetap').length}
              </div>
            </div>
            <div className="bg-blue-50 rounded p-3 text-center">
              <div className="text-xs md:text-sm text-gray-500">Karyawan Tetap</div>
              <div className="font-extrabold text-lg md:text-xl text-blue-800">
                {karyawanData.filter(k => k.status === 'tetap').length}
              </div>
            </div>
          </div>
          <div className="bg-white p-2 md:p-6 rounded shadow-md text-gray-700 text-xs md:text-base overflow-x-auto">
            <table className="min-w-[700px] w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border p-2">No</th>
                  <th className="border p-2">Nama Lengkap</th>
                  <th className="border p-2">Nomor WA</th>
                  <th className="border p-2">Umur</th>
                  <th className="border p-2">Masa Kerja</th>
                  <th className="border p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {karyawanData.map((karyawan, index) => (
                  <tr key={karyawan.id}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">
                      <a 
                        href={`/karyawan/${karyawan.id}`} 
                        className="text-blue-700 underline hover:text-blue-900"
                      >
                        {karyawan.nama}
                      </a>
                    </td>
                    <td className="border p-2">
                      {karyawan.wa && (() => {
                        // Hapus semua karakter non-angka
                        const cleanNumber = karyawan.wa.replace(/[^0-9]/g, '');
                        // Jika dimulai dengan 0, ganti dengan 62
                        const formattedNumber = cleanNumber.startsWith('0') 
                          ? '62' + cleanNumber.substring(1) 
                          : cleanNumber;
                        
                        return (
                          <a 
                            href={`https://wa.me/${formattedNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {karyawan.wa}
                          </a>
                        );
                      })()}
                    </td>
                    <td className="border p-2">{karyawan.tanggal_lahir ? calculateAge(karyawan.tanggal_lahir) : '-'}</td>
                    <td className="border p-2">{karyawan.awal_masuk ? calculateWorkDuration(karyawan.awal_masuk) : '-'}</td>
                    <td className="border p-2 text-center">
                      <a 
                        href={`/karyawan/${karyawan.id}/edit`} 
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors text-white mr-2 inline-block text-center"
                      >
                        Edit
                      </a>
                      <button 
                        className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white"
                        onClick={() => handleDelete(karyawan.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
