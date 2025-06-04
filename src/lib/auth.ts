import { supabase } from './supabase';

export const signInWithGoogle = async () => {
  try {
    // Pastikan kita di browser
    if (typeof window === 'undefined') {
      throw new Error('This function must be called on the client side');
    }

    const redirectUrl = `${window.location.origin}/auth/callback`;
    console.log('Signing in with Google, redirect URL:', redirectUrl);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
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
