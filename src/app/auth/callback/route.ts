import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Error in auth callback:', error);
    }
  }

  // Redirect ke dashboard setelah login berhasil
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
