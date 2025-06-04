import { supabase } from './supabase';

export const getAuthRedirectUrl = () => {
  // Pastikan kita di browser
  if (typeof window === 'undefined') {
    return '/auth/callback';
  }
  
  // Gunakan URL lengkap dengan protokol, domain, dan path
  const currentUrl = new URL(window.location.href);
  const redirectUrl = `${currentUrl.protocol}//${currentUrl.host}/auth/callback`;
  
  console.log('Redirect URL set to:', redirectUrl);
  return redirectUrl;
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
