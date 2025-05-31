import { createClient } from '@supabase/supabase-js';

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Define the response types
type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

type SupabaseQueryResponse<T> = Promise<SupabaseResponse<T>>;

type SupabaseQueryBuilder = {
  select: (columns?: string) => SupabaseQueryBuilder & { data: any[]; error: Error | null };
  eq: (column: string, value: any) => SupabaseQueryBuilder;
  order: (column: string, options?: { ascending?: boolean }) => SupabaseQueryBuilder;
  limit: (count: number) => SupabaseQueryBuilder & { data: any[]; error: Error | null };
  single: () => SupabaseQueryResponse<any>;
  update: (data: any) => SupabaseQueryBuilder & { data: any; error: Error | null };
  delete: () => SupabaseQueryResponse<void>;
  or: (query: string) => SupabaseQueryBuilder;
  data?: any[];
  error?: Error | null;
};

// Create a minimal Supabase client type
type SafeSupabaseClient = {
  auth: {
    signOut: () => Promise<{ error: Error | null }>;
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<{ error: Error | null }>;
    getUser: () => Promise<{ data: { user: any }, error: Error | null }>;
  };
  from: (table: string) => SupabaseQueryBuilder;
};

// Create a dummy query builder
const createDummyQueryBuilder = (): SupabaseQueryBuilder => {
  const builder: any = {};
  
  // Implement the query builder methods
  const methods = ['select', 'eq', 'order', 'limit', 'single', 'update', 'delete', 'or'];
  
  methods.forEach(method => {
    builder[method] = (...args: any[]) => {
      if (method === 'single') {
        return Promise.resolve({ 
          data: null, 
          error: new Error('Supabase not initialized') 
        });
      }
      if (method === 'limit') {
        return Promise.resolve({
          data: [],
          error: new Error('Supabase not initialized')
        });
      }
      return builder;
    };
  });
  
  return builder as SupabaseQueryBuilder;
};

// Create a dummy client
const createDummyClient = (): SafeSupabaseClient => ({
  auth: {
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ error: new Error('Supabase not initialized') }),
    getUser: async () => ({ data: { user: null }, error: new Error('Supabase not initialized') })
  },
  from: () => createDummyQueryBuilder()
});

// Initialize the client
let supabaseClient: SafeSupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  try {
    // Create the real Supabase client
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    // Cast to our safe type
    supabaseClient = client as unknown as SafeSupabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    supabaseClient = createDummyClient();
  }
} else {
  if (isBrowser) {
    console.warn('Missing Supabase environment variables. Some features may not work correctly.');
  }
  supabaseClient = createDummyClient();
}

export const supabase = supabaseClient;
