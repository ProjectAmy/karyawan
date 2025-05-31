import { createClient } from '@supabase/supabase-js';

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Define the Karyawan type
export interface Karyawan {
  id: string;
  nama: string;
  wa?: string | null;
  tanggal_lahir?: string | null;
  alamat?: string | null;
  email?: string | null;
  no_kk?: string | null;
  no_ktp?: string | null;
  jabatan: string;
  posisi?: string | null;
  divisi: string;
  status: string;
  status_kehadiran?: string | null;
  awal_masuk?: string | null;
  foto?: string | null;
  unit?: string | null;
  keterangan?: string | null;
  created_at: string;
  deleted_at?: string | null;
}

// Create and export the Supabase client
const supabase = isBrowser && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : {
      auth: {
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ error: null, data: { user: null } }),
        getUser: async () => ({ data: { user: null }, error: null })
      },
      from: () => ({
        select: () => ({
          data: [],
          error: null
        }),
        update: () => ({
          data: [],
          error: null
        }),
        insert: () => ({
          data: [],
          error: null
        }),
        delete: () => ({
          data: [],
          error: null
        }),
        eq: () => ({
          data: [],
          error: null
        }),
        or: () => ({
          data: [],
          error: null
        }),
        single: async () => ({
          data: null,
          error: null
        })
      })
    } as any; // Use type assertion here to avoid complex type definitions

export { supabase };
