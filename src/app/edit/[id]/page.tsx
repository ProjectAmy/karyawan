'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/app/components/Header';
import Sidebar from '@/app/components/Sidebar';
import Footer from '@/app/components/Footer';

interface Karyawan {
  id: string;
  nama: string;
  wa: string | null;
  tanggal_lahir: string | null;
  alamat: string | null;
  email: string | null;
  no_kk: string | null;
  no_ktp: string | null;
  jabatan: string | null;
  posisi: string | null;
  divisi: string | null;
  status: string | null;
  status_kehadiran: string | null;
  awal_masuk: string | null;
  foto: string | null;
  unit: string | null;
  keterangan: string | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at: string | null;
}

export default function EditEmployee() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [employee, setEmployee] = useState<Karyawan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employee) return;
    
    try {
      setIsLoading(true);
      
      // Get form data
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Prepare update payload
      const updatePayload = {
        nama: formData.get('nama'),
        email: formData.get('email'),
        wa: formData.get('wa'),
        tanggal_lahir: formData.get('tanggal_lahir'),
        alamat: formData.get('alamat'),
        no_ktp: formData.get('no_ktp') || null,
        no_kk: formData.get('no_kk') || null,
        posisi: formData.get('posisi') || null,
        keterangan: formData.get('keterangan') || null,
        unit: formData.get('unit') || null,
        status: formData.get('status') || null,
        jabatan: formData.get('jabatan') || null,
        awal_masuk: formData.get('awal_masuk') || null,
        updated_at: new Date().toISOString()
      };

      // Update data in Supabase
      const { error } = await supabase
        .from('karyawan')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        setErrorMessage('Gagal memperbarui data karyawan');
        return;
      }
      
      // Show success message and redirect to employee detail page
      alert('Data karyawan berhasil diperbarui');
      router.push(`/karyawan/${id}`);
      
    } catch (err) {
      console.error('Error updating employee:', err);
      setErrorMessage('Gagal memperbarui data karyawan');
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication and fetch data
  const fetchEmployee = useCallback(async () => {
    if (!id) {
      router.push('/dashboard');
      return;
    }

    try {
      // Check if Supabase is properly initialized
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Supabase is not properly configured');
        setErrorMessage('Konfigurasi sistem tidak valid');
        setIsLoading(false);
        return;
      }

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setErrorMessage('Anda harus login untuk mengakses halaman ini');
        setIsLoading(false);
        return;
      }

      console.log('Fetching employee data for ID:', id);
      const { data, error: fetchError } = await supabase
        .from('karyawan')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (fetchError) {
        console.error('Error fetching employee:', fetchError);
        setErrorMessage(fetchError.message);
        setIsLoading(false);
        return;
      }
      
      if (!data) {
        console.log('No employee found with ID:', id);
        setErrorMessage('Data karyawan tidak ditemukan');
        setIsLoading(false);
        return;
      }

      console.log('Employee data loaded:', data);
      setEmployee(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      console.error('Error in fetchEmployee:', { error: err, message: errorMessage });
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => {
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="grow bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-lg">Loading employee data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (errorMessage) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="grow bg-white flex items-center justify-center p-4">
            <div className="bg-red-50 p-6 rounded-lg max-w-2xl w-full">
              <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
              <p className="text-red-600">{errorMessage}</p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main Content */}
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

            {/* Header Edit */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-green-700 p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2 md:space-y-3">
                    <h1 className="text-2xl md:text-3xl font-bold">Edit Data Karyawan</h1>
                    {employee?.nama && (
                      <p className="text-green-100 font-medium text-base md:text-lg">
                        {employee.nama.charAt(0).toUpperCase() + employee.nama.slice(1).toLowerCase()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : errorMessage ? (
                  <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <p>{errorMessage}</p>
                  </div>
                ) : employee ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Pribadi */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="bg-blue-700 p-4 text-white">
                        <h3 className="text-lg font-medium">Informasi Pribadi</h3>
                      </div>
                      <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                          <input
                            type="text"
                            id="nama"
                            name="nama"
                            defaultValue={employee.nama || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue={employee.email || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="wa" className="block text-sm font-medium text-gray-700 mb-1">Nomor HP/WA</label>
                          <input
                            type="tel"
                            id="wa"
                            name="wa"
                            defaultValue={employee.wa || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                          <input
                            type="date"
                            id="tanggal_lahir"
                            name="tanggal_lahir"
                            defaultValue={employee.tanggal_lahir?.split('T')[0] || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="no_ktp" className="block text-sm font-medium text-gray-700 mb-1">No. KTP</label>
                          <input
                            type="text"
                            id="no_ktp"
                            name="no_ktp"
                            defaultValue={employee.no_ktp || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="no_kk" className="block text-sm font-medium text-gray-700 mb-1">No. KK</label>
                          <input
                            type="text"
                            id="no_kk"
                            name="no_kk"
                            defaultValue={employee.no_kk || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                          <textarea
                            id="alamat"
                            name="alamat"
                            rows={3}
                            defaultValue={employee.alamat || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      </div>
                    </div>

                    {/* Informasi Pekerjaan */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="bg-blue-700 p-4 text-white">
                        <h3 className="text-lg font-medium">Informasi Pekerjaan</h3>
                      </div>
                      <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="posisi" className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
                          <select
                            id="posisi"
                            name="posisi"
                            defaultValue={employee.posisi || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Pilih Posisi</option>
                            <option value="guru">Guru</option>
                            <option value="tendik">Tenaga Kependidikan</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                          <select
                            id="keterangan"
                            name="keterangan"
                            defaultValue={employee.keterangan || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Pilih Keterangan</option>
                            <option value="guru kelas">Guru Kelas</option>
                            <option value="guru mapel">Guru Mapel</option>
                            <option value="guru tahfidz">Guru Tahfidz</option>
                            <option value="bendahara">Bendahara</option>
                            <option value="TU">Tata Usaha</option>
                            <option value="OB">Office Boy</option>
                            <option value="Yayasan">Yayasan</option>
                            <option value="kasir">Kasir</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                          <select
                            id="unit"
                            name="unit"
                            defaultValue={employee.unit || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Pilih Unit</option>
                            <option value="TK">TK</option>
                            <option value="SD">SD</option>
                            <option value="SMP">SMP</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            id="status"
                            name="status"
                            defaultValue={employee.status || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Pilih Status</option>
                            <option value="tetap">Tetap</option>
                            <option value="tidak tetap">Tidak Tetap</option>
                            <option value="percobaan">Percobaan</option>
                            <option value="honorer">Honorer</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                          <select
                            id="jabatan"
                            name="jabatan"
                            defaultValue={employee.jabatan || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Pilih Jabatan</option>
                            <option value="kepala sekolah">Kepala Sekolah</option>
                            <option value="waka kurikulum">Waka Kurikulum</option>
                            <option value="waka kesiswaan">Waka Kesiswaan</option>
                            <option value="wali kelas">Wali Kelas</option>
                            <option value="tidak menjabat">Tidak Menjabat</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="awal_masuk" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
                          <input
                            type="date"
                            id="awal_masuk"
                            name="awal_masuk"
                            defaultValue={employee.awal_masuk?.split('T')[0] || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center min-w-[120px]`}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menyimpan...
                          </>
                        ) : (
                          'Simpan Perubahan'
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada data karyawan yang ditemukan</p>
                  </div>
                )}
                
                {errorMessage && (
                  <div className="mt-8 p-4 bg-red-50 rounded-lg">
                    <h3 className="font-medium text-red-800 mb-2">Detail Error</h3>
                    <p className="font-medium">Error:</p>
                    <p>{errorMessage}</p>
                    {id && (
                      <p className="text-sm text-red-700 mt-2">
                        ID Karyawan: {id}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
