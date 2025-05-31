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
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
          router.push('/');
          return;
        }
        
        if (!user) {
          router.push('/');
          return;
        }
        
        const name = user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'User');
        setUserName(name);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

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
  // Note: This function is currently unused but kept for future implementation
  /*
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

      setKaryawanData(prevData =>
        prevData.map(k => (k.id === id ? { ...k, status_kehadiran: status } : k))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }, []);
  */

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

    if (years > 0) return `${years} tahun`;
    if (months > 0) return `${months} bulan`;
    return `${days} hari`;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

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
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gray-800">Ahlan Wa Sahlan, {userName}!</h2>
          <p className="text-sm text-gray-600 mb-4 md:mb-6">{currentDate}</p>
          {karyawanData.length === 0 ? (
            <div className="text-center text-green-500 space-y-2">
              <p>Tidak ada data karyawan yang ditampilkan.</p>
            </div>
          ) : null}
          {/* Kartu Statistik */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-4">
            {[
              { title: 'Guru', count: karyawanData.filter(k => k.posisi === 'guru').length, icon: '👨‍🏫' },
              { title: 'Tendik', count: karyawanData.filter(k => k.posisi === 'tendik').length, icon: '👨‍💼' },
              { title: 'Total Karyawan', count: karyawanData.length, icon: '👥' },
              { title: 'Percobaan', count: karyawanData.filter(k => k.status === 'percobaan').length, icon: '⏳' },
              { title: 'Tidak Tetap', count: karyawanData.filter(k => k.status === 'tidak_tetap').length, icon: '📝' },
              { title: 'Tetap', count: karyawanData.filter(k => k.status === 'tetap').length, icon: '✅' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-2 sm:p-3 text-center border-2 border-green-100 hover:border-green-200 hover:shadow-md transition-all duration-200">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">{item.title}</div>
                <div className="font-extrabold text-base sm:text-lg md:text-xl text-green-700 mt-1">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
          {/* Tabel Responsif */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-full md:w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 sm:hidden">
                  {karyawanData.map((karyawan) => (
                    <div key={karyawan.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-green-600 p-3">
                        <a href={`/karyawan/${karyawan.id}`} className="text-white font-semibold hover:underline block">
                          {karyawan.nama}
                        </a>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-500">No. WA: </span>
                          {karyawan.wa && (
                            <a 
                              href={`https://wa.me/${karyawan.wa.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:underline"
                            >
                              {karyawan.wa}
                            </a>
                          )}
                        </div>
                        <div className="text-sm text-gray-800">
                          <span className="text-gray-500">Umur: </span>
                          <span className="font-medium">{karyawan.tanggal_lahir ? calculateAge(karyawan.tanggal_lahir) : '-'}</span>
                        </div>
                        <div className="text-sm text-gray-800">
                          <span className="text-gray-500">Masa Kerja: </span>
                          <span className="font-medium">{karyawan.awal_masuk ? calculateWorkDuration(karyawan.awal_masuk) : '-'}</span>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <a 
                            href={`/karyawan/${karyawan.id}/edit`} 
                            className="flex-1 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white text-center text-sm"
                          >
                            Edit
                          </a>
                          <button 
                            onClick={() => handleDelete(karyawan.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Tabel untuk layar menengah ke atas */}
                <table className="hidden sm:table w-full border-collapse">
                  <thead>
                    <tr className="bg-green-600">
                      <th className="border-b p-2 text-left text-sm font-medium text-white">No</th>
                      <th className="border-b p-2 text-left text-sm font-medium text-white">Nama Lengkap</th>
                      <th className="border-b p-2 text-left text-sm font-medium text-white">Nomor WA</th>
                      <th className="border-b p-2 text-left text-sm font-medium text-white">Umur</th>
                      <th className="border-b p-2 text-left text-sm font-medium text-white">Masa Kerja</th>
                      <th className="border-b p-2 text-center text-sm font-medium text-white">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {karyawanData.map((karyawan, index) => (
                      <tr key={karyawan.id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-700">{index + 1}</td>
                        <td className="p-3 text-sm">
                          <a 
                            href={`/karyawan/${karyawan.id}`} 
                            className="text-green-700 hover:text-green-900 hover:underline font-medium"
                          >
                            {karyawan.nama}
                          </a>
                        </td>
                        <td className="p-3 text-sm">
                          {karyawan.wa && (
                            <a 
                              href={`https://wa.me/${karyawan.wa.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 hover:underline"
                            >
                              {karyawan.wa}
                            </a>
                          )}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {karyawan.tanggal_lahir ? calculateAge(karyawan.tanggal_lahir) : '-'}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {karyawan.awal_masuk ? calculateWorkDuration(karyawan.awal_masuk) : '-'}
                        </td>
                        <td className="p-3 text-sm text-center">
                          <div className="flex justify-center space-x-2">
                            <a 
                              href={`/karyawan/${karyawan.id}/edit`} 
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm transition-colors"
                            >
                              Edit
                            </a>
                            <button 
                              onClick={() => handleDelete(karyawan.id)}
                              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
