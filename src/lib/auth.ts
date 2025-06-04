import { supabase } from './supabase';

export const getAuthRedirectUrl = () => {
  // Gunakan URL dari environment variable jika tersedia
  if (process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL) {
    return process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;
  }
  
  // Gunakan window.location.origin di browser
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  
  // Fallback ke localhost
  return 'http://localhost:3000/auth/callback';
};

export const signInWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthRedirectUrl(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};
