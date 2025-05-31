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
}

export default function DetailKaryawan() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Dashboard
            </button>

            {/* Card Profil */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Header Profil */}
              <div className="bg-blue-700 p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{karyawan.nama}</h1>
                    {karyawan.keterangan && (
                      <p className="text-blue-100 font-medium">{karyawan.keterangan} {karyawan.unit}</p>
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
              <div className="p-6 space-y-6">
                {/* Informasi Pribadi */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2">Informasi Pribadi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tanggal Lahir</p>
                      <p className="font-semibold text-gray-900">{formatDate(karyawan.tanggal_lahir)}</p>
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
                      <p className="text-sm font-medium text-gray-700">Alamat</p>
                      <p className="whitespace-pre-line text-gray-900">{karyawan.alamat || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">No. KK</p>
                      <p className="font-semibold text-gray-900">{karyawan.no_kk || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">No. KTP</p>
                      <p className="font-semibold text-gray-900">{karyawan.no_ktp || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Informasi Pekerjaan */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2">Informasi Pekerjaan</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Jabatan</p>
                      <p className="font-semibold text-gray-900">{karyawan.jabatan || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Posisi</p>
                      <p className="font-semibold text-gray-900">{karyawan.posisi || '-'}</p>
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
                      <p className="text-sm font-medium text-gray-700">Awal Masuk</p>
                      <p className="font-semibold text-gray-900">{karyawan.awal_masuk ? formatDate(karyawan.awal_masuk) : '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Masa Kerja</p>
                      <p className="font-semibold text-gray-900">
                        {karyawan.awal_masuk 
                          ? `${new Date().getFullYear() - new Date(karyawan.awal_masuk).getFullYear()} Tahun`
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
