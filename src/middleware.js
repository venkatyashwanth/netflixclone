import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { cookies } from 'next/headers';

const intlMiddleware = createMiddleware(routing);
const authRoutes = ['/login', '/signup'];
const protectedRoutes = ['/dashboard'];

export async function getAuthToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    return token?.value;
  } catch (error) {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Get the pathname without locale
  const pathnameWithoutLocale = pathname.replace(/^\/(en|hi|te)/, '') || '/';

  // Check if the current locale is in the pathname
  const locale = pathname.split('/')[1] || 'en';
  const supportedLocales = ['en', 'hi', 'te'];
  const currentLocale = supportedLocales.includes(locale) ? locale : 'en';

  try {
    const token = await getAuthToken();
    const isAuthenticated = !!token;
    console.log("Auth Status: ", isAuthenticated);

    if (isAuthenticated) {
      if (authRoutes.some(route => pathnameWithoutLocale.startsWith(route))) {
        const redirectUrl = new URL(`/${currentLocale}/dashboard`, req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
    if (!isAuthenticated) {
      if (protectedRoutes.some(route => pathnameWithoutLocale.startsWith(route))) {
        const redirectUrl = new URL(`/login`, req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }
  catch (error) {
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      const redirectUrl = new URL(`/login`, req.url);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};