// proxy.ts
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdmin = req.cookies.get('admin')?.value === '1';

  // Protect settings UI
  if (pathname.startsWith('/internalaitools/settings')) {
    if (!isAdmin) {
      const url = new URL('/admin/login', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect API mutations; allow GETs for everyone
  if (pathname.startsWith('/api/apps')) {
    const method = req.method.toUpperCase();
    if (method !== 'GET' && !isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/internalaitools/settings/:path*', '/api/apps/:path*'],
};