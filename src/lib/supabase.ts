import { createClient } from '@supabase/supabase-js'

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (isBrowser) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
  }
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
