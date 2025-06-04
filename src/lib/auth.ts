import { supabase } from './supabase';

export const getAuthRedirectUrl = () => {
  // Selalu gunakan window.location.origin di browser
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  
  // Fallback untuk SSR (tidak akan pernah terjadi di browser)
  return '/auth/callback';
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
