"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

interface FormData {
  nama: string;
  wa: string;
  tanggal_lahir: string;
  alamat: string;
  email: string;
  no_kk?: string;
  no_ktp: string;
  jabatan: 'kepala sekolah' | 'waka kurikulum' | 'waka kesiswaan' | 'wali kelas';
  posisi: 'guru' | 'tendik';
  keterangan: 'guru kelas' | 'guru mapel' | 'bendahara' | 'TU' | 'OB' | 'Yayasan' | 'kasir';
  status: 'tetap' | 'tidak tetap' | 'percobaan' | 'honorer';
  awal_masuk: string;
  unit: 'TK' | 'SD' | 'SMP';
  foto_ktp: File | null;
  foto_kk: File | null;
  foto_buku_nikah: File | null;
  foto_akte_anak: File | null;
}

export default function KaryawanBaruPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    nama: '',
    wa: '',
    tanggal_lahir: '',
    alamat: '',
    email: '',
    no_ktp: '',
    jabatan: 'wali kelas',
    posisi: 'guru',
    keterangan: 'guru kelas',
    status: 'tetap',
    awal_masuk: new Date().toISOString().split('T')[0],
    unit: 'SD',
    foto_ktp: null,
    foto_kk: null,
    foto_buku_nikah: null,
    foto_akte_anak: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
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
  const [preview, setPreview] = useState<{[key:string]: string | null}>({});

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setForm((f) => ({ ...f, [name]: file }));
      setPreview((p) => ({ ...p, [name]: URL.createObjectURL(file) }));
    } else {
      // Handle case when file is cleared
      setForm((f) => ({ ...f, [name]: null }));
      setPreview((p) => ({ ...p, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Upload files to Supabase Storage and get their URLs
      const uploadFile = async (file: File | null, path: string): Promise<string | null> => {
        if (!file) return null;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${path}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('karyawan')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('karyawan')
          .getPublicUrl(filePath);
        
        return publicUrl;
      };
      
      // Upload files if they exist
      const [fotoKtpUrl, fotoKkUrl, fotoBukuNikahUrl, fotoAkteAnakUrl] = await Promise.all([
        uploadFile(form.foto_ktp, 'ktp'),
        uploadFile(form.foto_kk, 'kk'),
        uploadFile(form.foto_buku_nikah, 'buku-nikah'),
        uploadFile(form.foto_akte_anak, 'akte-anak')
      ]);
      
      // Prepare employee data
      const employeeData = {
        ...form,
        foto_ktp: fotoKtpUrl,
        foto_kk: fotoKkUrl,
        foto_buku_nikah: fotoBukuNikahUrl,
        foto_akte_anak: fotoAkteAnakUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Destructure to remove file objects before inserting to database
      // Using _ prefix to indicate intentionally unused variables
      const { 
        foto_ktp: _fotoKtp, 
        foto_kk: _fotoKk, 
        foto_buku_nikah: _fotoBukuNikah, 
        foto_akte_anak: _fotoAkteAnak, 
        ...dbData 
      } = employeeData;
      
      // Insert employee data into the database
      const { error } = await supabase
        .from('karyawan')
        .insert([dbData]);
      
      if (error) throw error;
      
      setSuccess(true);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Error saving data:', err);
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data karyawan');
    } finally {
      setLoading(false);
    }
  };


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 relative bg-gray-100">
        <Sidebar
          onLogout={handleLogout}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 flex flex-col items-center justify-center py-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              <p>Data karyawan berhasil disimpan! Mengalihkan ke dashboard...</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Nama Lengkap *</label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleInput}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInput}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Nomor WA *</label>
                <input
                  type="tel"
                  name="wa"
                  value={form.wa}
                  onChange={handleInput}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Tanggal Lahir *</label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={form.tanggal_lahir}
                  onChange={handleInput}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">No. KTP *</label>
                <input
                  type="text"
                  name="no_ktp"
                  value={form.no_ktp}
                  onChange={handleInput}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">No. KK</label>
                <input
                  type="text"
                  name="no_kk"
                  value={form.no_kk}
                  onChange={handleInput}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Status *</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value as 'tetap' | 'tidak tetap' | 'percobaan' | 'honorer'})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 bg-white"
                  required
                >
                  <option value="tetap">Tetap</option>
                  <option value="tidak tetap">Tidak Tetap</option>
                  <option value="percobaan">Percobaan</option>
                  <option value="honorer">Honorer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Posisi *</label>
                <select
                  name="posisi"
                  value={form.posisi}
                  onChange={(e) => setForm({...form, posisi: e.target.value as 'guru' | 'tendik'})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 bg-white"
                  required
                >
                  <option value="guru">Guru</option>
                  <option value="tendik">Tenaga Kependidikan</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Keterangan *</label>
                <select
                  name="keterangan"
                  value={form.keterangan}
                  onChange={(e) => setForm({...form, keterangan: e.target.value as 'guru kelas' | 'guru mapel' | 'bendahara' | 'TU' | 'OB' | 'Yayasan' | 'kasir'})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 bg-white"
                  required
                >
                  <option value="guru kelas">Guru Kelas</option>
                  <option value="guru mapel">Guru Mapel</option>
                  <option value="bendahara">Bendahara</option>
                  <option value="TU">Tata Usaha</option>
                  <option value="OB">OB</option>
                  <option value="Yayasan">Yayasan</option>
                  <option value="kasir">Kasir</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Unit *</label>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={(e) => setForm({...form, unit: e.target.value as 'TK' | 'SD' | 'SMP'})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 bg-white"
                  required
                >
                  <option value="TK">TK</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Jabatan *</label>
                <select
                  name="jabatan"
                  value={form.jabatan}
                  onChange={(e) => setForm({...form, jabatan: e.target.value as 'kepala sekolah' | 'waka kurikulum' | 'waka kesiswaan' | 'wali kelas'})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 bg-white"
                  required
                >
                  <option value="kepala sekolah">Kepala Sekolah</option>
                  <option value="waka kurikulum">Waka Kurikulum</option>
                  <option value="waka kesiswaan">Waka Kesiswaan</option>
                  <option value="wali kelas">Wali Kelas</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Awal Masuk *</label>
                <input
                  type="date"
                  name="awal_masuk"
                  value={form.awal_masuk}
                  onChange={handleInput}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-800">Alamat</label>
                <textarea
                  name="alamat"
                  value={form.alamat}
                  onChange={(e) => setForm({...form, alamat: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                />
              </div>
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Upload Foto KTP</label>
                  <input 
                    type="file" 
                    name="foto_ktp" 
                    accept="image/*" 
                    onChange={handleFile} 
                    className="w-full text-gray-800" 
                    style={{color:'#1e293b'}}
                  />
                  {preview.foto_ktp && <Image src={preview.foto_ktp} alt="Preview KTP" width={120} height={80} className="mt-2 h-20 rounded object-cover" />}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Upload Foto KK</label>
                  <input 
                    type="file" 
                    name="foto_kk" 
                    accept="image/*" 
                    onChange={handleFile} 
                    className="w-full text-gray-800" 
                    style={{color:'#1e293b'}}
                  />
                  {preview.foto_kk && <Image src={preview.foto_kk} alt="Preview KK" width={120} height={80} className="mt-2 h-20 rounded object-cover" />}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Upload Foto Buku Nikah</label>
                  <input 
                    type="file" 
                    name="foto_buku_nikah" 
                    accept="image/*" 
                    onChange={handleFile} 
                    className="w-full text-gray-800" 
                    style={{color:'#1e293b'}}
                  />
                  {preview.foto_buku_nikah && <Image src={preview.foto_buku_nikah} alt="Preview Buku Nikah" width={120} height={80} className="mt-2 h-20 rounded object-cover" />}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">Upload Foto Akte Anak</label>
                  <input 
                    type="file" 
                    name="foto_akte_anak" 
                    accept="image/*" 
                    onChange={handleFile} 
                    className="w-full text-gray-800" 
                    style={{color:'#1e293b'}}
                  />
                  {preview.foto_akte_anak && <Image src={preview.foto_akte_anak} alt="Preview Akte Anak" width={120} height={80} className="mt-2 h-20 rounded object-cover" />}
                </div>
              </div>
              
              <div className="md:col-span-2 flex justify-end pt-4">
                <button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white rounded px-6 py-2 font-bold flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : 'Simpan Data'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
