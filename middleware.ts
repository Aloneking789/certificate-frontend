import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only handle admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const token = req.cookies.get('certiflow_token')?.value;

  // If user is visiting the login page but already has a token, redirect to dashboard
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // For other admin pages, require token; otherwise redirect to login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
