import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  console.log('Auth callback received:', { 
    code: code ? '***' : 'none', 
    error,
    errorDescription,
    origin: requestUrl.origin,
    host: requestUrl.host
  });

  if (error) {
    console.error('Auth error:', { error, errorDescription });
    // Tetap redirect ke halaman utama meskipun ada error
    return NextResponse.redirect(requestUrl.origin);
  }

  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { error: authError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (authError) {
        console.error('Error exchanging code for session:', authError);
      } else {
        console.log('Successfully exchanged code for session');
      }
    } catch (err) {
      console.error('Unexpected error in auth callback:', err);
    }
  }

  // Redirect ke halaman utama setelah login berhasil
  return NextResponse.redirect(requestUrl.origin);
}
