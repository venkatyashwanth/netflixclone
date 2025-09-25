import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function getToken(req) {
  // Read token from cookie
  const cookieHeader = req.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : false;
}

export function middleware(req) {
  const token = getToken(req); // Now reads actual cookie
  const url = req.nextUrl;
  const pathname = url.pathname;
  const locale = pathname.split('/')[1];

  console.log('Middleware - Token exists:', !!token);

  // Protect dashboard routes
  if (!token && pathname.startsWith(`/${locale}/dashboard`)) {
    console.log('Redirecting to login');
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set('alert', 'unauthorized');
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page
  if (token && pathname.startsWith(`/${locale}/login`)) {
    console.log('Redirecting to dashboard');
    const dashboardUrl = new URL(`/${locale}/dashboard`, req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};