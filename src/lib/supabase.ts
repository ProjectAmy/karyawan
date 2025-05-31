import { createClient } from '@supabase/supabase-js';

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client that will be replaced with the real one when needed
let supabaseClient: any = {
  auth: {
    signOut: async () => ({}),
    signInWithPassword: async () => ({}),
    getUser: async () => ({ data: { user: null }, error: null })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: new Error('Supabase not initialized') })
      }),
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null })
      })
    })
  })
};

// Only create the real client if we have the required environment variables
if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
} else if (isBrowser) {
  console.warn('Missing Supabase environment variables. Some features may not work correctly.');
}

export const supabase = supabaseClient;
