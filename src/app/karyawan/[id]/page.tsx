'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import Header from '@/app/components/Header';
import Sidebar from '@/app/components/Sidebar';
import Footer from '@/app/components/Footer';

interface Karyawan {
  id: string;
  nama: string;
  wa: string;
  tanggal_lahir: string;
  alamat: string;
  email: string;
  no_kk?: string;
  no_ktp?: string;
  jabatan: string;
  posisi?: string;
  divisi: string;
  status: string;
  awal_masuk: string;
  foto: string | null;
  unit: string;
  keterangan?: string;
  foto_ktp?: string | null;
  foto_kk?: string | null;
  foto_buku_nikah?: string | null;
  foto_akte_anak?: string | null;
}

export default function DetailKaryawan() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Handle soft delete karyawan
  const handleDeleteKaryawan = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('karyawan')
        .update({ 
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error soft deleting employee:', error);
      alert('Gagal menghapus data karyawan');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  const openDeleteDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDeleteDialog(true);
  };
  
  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  const fetchKaryawan = useCallback(async () => {
    if (!id) {
      router.push('/dashboard');
      return;
    }

    try {
      // Check if Supabase is properly initialized
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Supabase is not properly configured');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('karyawan')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) throw error;
      
      if (data) {
        console.log('Data karyawan dari database:', data);
        setKaryawan(data);
      } else {
        console.log('Tidak ada data ditemukan untuk ID:', id);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      // Don't redirect on error to allow static generation
      setKaryawan(null);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchKaryawan();
  }, [fetchKaryawan]);



  // Fungsi untuk format tanggal
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Tanggal tidak valid:', dateString);
        return '-';
      }
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('id-ID', options);
    } catch (error) {
      console.error('Error formatting date:', error, 'Value:', dateString);
      return '-';
    }
  };

  // Fungsi untuk format nomor WA
  const formatWA = (wa: string) => {
    if (!wa) return '';
    const cleanNumber = wa.replace(/[^0-9]/g, '');
    return cleanNumber.startsWith('0') 
      ? '62' + cleanNumber.substring(1) 
      : cleanNumber;
  };

  // Fungsi untuk menghitung umur dari tanggal lahir
  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return '-';
    
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age > 0 ? `${age} Tahun` : '-';
    } catch (error) {
      console.error('Error calculating age:', error);
      return '-';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!karyawan) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <p>Data karyawan tidak ditemukan</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        open={sidebarOpen} 
        onClose={closeSidebar}
        onLogout={handleLogout}
      />
      
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header onMenuClick={toggleSidebar} />
        
        <main className="grow bg-white">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto space-y-6">
            {/* Tombol Kembali */}
            <button 
              onClick={() => router.back()}
              className="flex items-center text-green-600 hover:text-green-800"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Dashboard
            </button>

            {/* Card Profil */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Header Profil */}
              <div className="bg-green-700 p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-4">
                      <h1 className="text-2xl md:text-3xl font-bold">{karyawan.nama}</h1>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => router.push(`/edit-karyawan/${id}`)}
                          className="p-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                          title="Edit Karyawan"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={openDeleteDialog}
                          className="p-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                          title="Hapus Karyawan"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {karyawan.keterangan && (
                      <p className="text-green-100 font-medium text-base md:text-lg">
                        {karyawan.keterangan.charAt(0).toUpperCase() + karyawan.keterangan.slice(1)}
                        {karyawan.unit && ` ${karyawan.unit.charAt(0).toUpperCase() + karyawan.unit.slice(1)}`}
                      </p>
                    )}
                  </div>
                  {karyawan.foto && (
                    <div className="mt-4 md:mt-0">
                      <div className="w-24 h-24 rounded-full bg-white overflow-hidden border-4 border-white">
                        <Image 
                          src={karyawan.foto}
                          alt={karyawan.nama}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          unoptimized={true} // Only if you're using external images that aren't optimized
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Container untuk Informasi Pribadi dan Pekerjaan */}
              <div className="p-10 space-y-6">
                {/* Informasi Pribadi */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b-2 border-black-200 pb-5 mb-10">Informasi Pribadi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tanggal Lahir</p>
                      <p className="font-semibold text-gray-900">{formatDate(karyawan.tanggal_lahir)}</p>
                    </div>
                    <div className="mt-1">
                        <p className="text-sm font-medium text-gray-700">Umur:</p>
                        <p className="font-semibold text-gray-900">{calculateAge(karyawan.tanggal_lahir)}</p>
                      </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">No. KTP</p>
                      <p className="font-semibold text-gray-900">{karyawan.no_ktp || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">No. KK</p>
                      <p className="font-semibold text-gray-900">{karyawan.no_kk || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <a 
                        href={`mailto:${karyawan.email}`}
                        className="text-blue-700 hover:text-blue-900 hover:underline font-medium"
                      >
                        {karyawan.email || '-'}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">No. WhatsApp</p>
                      <a 
                        href={`https://wa.me/${formatWA(karyawan.wa)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 hover:underline font-medium"
                      >
                        {karyawan.wa}
                      </a>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700">Alamat</p>
                      <p className="font-semibold text-gray-900">{karyawan.alamat || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Informasi Pekerjaan */}
                <div className="space-y-4 pt-10 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 border-b-2 border-black-200 pb-5 mb-10">Informasi Pekerjaan</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Posisi</p>
                      <p className="font-semibold text-gray-900">{karyawan.posisi || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Keterangan</p>
                      <p className="font-semibold text-gray-900">{karyawan.keterangan || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Unit</p>
                      <p className="font-semibold text-gray-900">{karyawan.unit || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <p className="font-semibold text-gray-900">{karyawan.status || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Jabatan</p>
                      <p className="font-semibold text-gray-900">{karyawan.jabatan || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Awal Masuk</p>
                      <p className="font-semibold text-gray-900">{karyawan.awal_masuk ? formatDate(karyawan.awal_masuk) : '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700">Masa Kerja</p>
                      <p className="font-semibold text-gray-900">
                        {karyawan.awal_masuk 
                          ? `${new Date().getFullYear() - new Date(karyawan.awal_masuk).getFullYear()} Tahun`
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informasi Berkas */}
                <div className="space-y-4 pt-10 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 border-b-2 border-black-200 pb-5 mb-10">Berkas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {karyawan.foto_ktp && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">KTP</p>
                        <a 
                          href={karyawan.foto_ktp} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <div className="w-32 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                            <Image 
                              src={karyawan.foto_ktp}
                              alt="KTP"
                              width={128}
                              height={80}
                              className="w-full h-full object-cover"
                              unoptimized={true}
                            />
                          </div>
                          <p className="text-xs text-blue-600 hover:underline mt-1">Lihat KTP</p>
                        </a>
                      </div>
                    )}
                    
                    {karyawan.foto_kk && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Kartu Keluarga</p>
                        <a 
                          href={karyawan.foto_kk} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <div className="w-32 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                            <Image 
                              src={karyawan.foto_kk}
                              alt="Kartu Keluarga"
                              width={128}
                              height={80}
                              className="w-full h-full object-cover"
                              unoptimized={true}
                            />
                          </div>
                          <p className="text-xs text-blue-600 hover:underline mt-1">Lihat KK</p>
                        </a>
                      </div>
                    )}
                    
                    {karyawan.foto_buku_nikah && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Buku Nikah</p>
                        <a 
                          href={karyawan.foto_buku_nikah} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <div className="w-32 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                            <Image 
                              src={karyawan.foto_buku_nikah}
                              alt="Buku Nikah"
                              width={128}
                              height={80}
                              className="w-full h-full object-cover"
                              unoptimized={true}
                            />
                          </div>
                          <p className="text-xs text-blue-600 hover:underline mt-1">Lihat Buku Nikah</p>
                        </a>
                      </div>
                    )}
                    
                    {karyawan.foto_akte_anak && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Akte Anak</p>
                        <a 
                          href={karyawan.foto_akte_anak} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <div className="w-32 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                            <Image 
                              src={karyawan.foto_akte_anak}
                              alt="Akte Anak"
                              width={128}
                              height={80}
                              className="w-full h-full object-cover"
                              unoptimized={true}
                            />
                          </div>
                          <p className="text-xs text-blue-600 hover:underline mt-1">Lihat Akte Anak</p>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div 
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
          onClick={closeDeleteDialog}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus data <span className="font-semibold">{karyawan.nama}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteKaryawan}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"
                disabled={isDeleting}
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
    </div>
  );
}
