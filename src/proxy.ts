import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Hanya lindungi rute yang berawalan /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Cek apakah cookie rewang_auth ada
    const authCookie = request.cookies.get('rewang_auth');
    
    if (!authCookie) {
      // Jika tidak ada, tendang kembali ke halaman login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const sessionData = JSON.parse(authCookie.value);
      if (sessionData.role !== 'admin') {
        // Jika bukan admin, tendang ke beranda
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      // Jika parsing gagal (cookie rusak), tendang ke login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Jika aman, biarkan lewat
  return NextResponse.next();
}

// Tentukan rute mana saja yang akan dicegat oleh middleware ini
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
