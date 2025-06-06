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
  const [karyawanData, setKaryawanData] = useState<Karyawan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();



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
        .eq('id', id)
        .is('deleted_at', null);

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

  const handleDeleteClick = (id: string, name: string) => {
    setSelectedKaryawan({ id, name });
    setShowDeleteDialog(true);
  };

  const handleDelete = useCallback(async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!selectedKaryawan) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('karyawan')
        .update({ 
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedKaryawan.id);

      if (error) {
        console.error('Error:', error);
        return;
      }
      
      setKaryawanData(prevData => prevData.filter(k => k.id !== selectedKaryawan.id));
      setShowDeleteDialog(false);
      setSelectedKaryawan(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedKaryawan]);
  
  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedKaryawan(null);
  };

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="grow bg-white">
          {/* Delete Confirmation Dialog */}
          {showDeleteDialog && selectedKaryawan && (
            <div 
              className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
              onClick={closeDeleteDialog}
            >
              <div 
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Hapus</h3>
                <p className="mb-6 text-gray-800">
                  Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-900">{selectedKaryawan.name}</span>? 
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeDeleteDialog}
                    disabled={isDeleting}
                    className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menghapus...
                      </>
                    ) : 'Hapus'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard HRD</h2>
            <p className="text-gray-600 mb-8">Selamat datang, <span className="font-medium">{userName}</span>. Berikut adalah ringkasan data karyawan.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-4">
              {[
                { title: 'Guru', count: karyawanData.filter(k => k.posisi === 'guru').length, icon: '👨‍🏫' },
                { title: 'Tendik', count: karyawanData.filter(k => k.posisi === 'tendik').length, icon: '👨‍💼' },
                { title: 'Total Karyawan', count: karyawanData.length, icon: '👥' },
                { title: 'Percobaan', count: karyawanData.filter(k => k.status === 'percobaan').length, icon: '⏳' },
                { title: 'Tidak Tetap', count: karyawanData.filter(k => k.status === 'tidak_tetap').length, icon: '📝' },
                { title: 'Tetap', count: karyawanData.filter(k => k.status === 'tetap').length, icon: '✅' }
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
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
                            href={`/edit/${karyawan.id}`} 
                            className="flex-1 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white text-center text-sm"
                          >
                            Edit
                          </a>
                          <button 
                            onClick={() => handleDeleteClick(karyawan.id, karyawan.nama)}
                            className="flex-1 bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white text-sm disabled:opacity-50"
                            disabled={isDeleting}
                          >
                            {isDeleting && selectedKaryawan?.id === karyawan.id ? 'Menghapus...' : 'Hapus'}
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
                              href={`/edit/${karyawan.id}`} 
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm transition-colors"
                            >
                              Edit
                            </a>
                            <button 
                              onClick={() => handleDeleteClick(karyawan.id, karyawan.nama)}
                              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm transition-colors"
                              disabled={isDeleting}
                            >
                              {isDeleting && selectedKaryawan?.id === karyawan.id ? 'Menghapus...' : 'Hapus'}
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
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
