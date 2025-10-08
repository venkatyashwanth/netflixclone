import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { cookies } from 'next/headers';

const intlMiddleware = createMiddleware(routing);
const authRoutes = ['/login', '/signup'];
const protectedRoutes = ['/home', '/dashboard', '/profile']; // All protected routes

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
    console.log("Middleware - Auth:", isAuthenticated, "Path:", pathnameWithoutLocale);

    // If user is authenticated
    if (isAuthenticated) {
      // ONLY redirect from auth pages (login/signup) to home
      if (authRoutes.some(route => pathnameWithoutLocale.startsWith(route))) {
        console.log("Redirecting from auth page to home");
        const redirectUrl = new URL(`/${currentLocale}/home`, req.url);
        return NextResponse.redirect(redirectUrl);
      }
      
      // ALLOW access to all protected routes (home, dashboard, profile, etc.)
      // No redirect needed - user can access any protected route
      console.log("Allowing access to protected route:", pathnameWithoutLocale);
      return intlMiddleware(req);
    }
    
    // If user is NOT authenticated
    if (!isAuthenticated) {
      // Redirect from protected routes to login
      if (protectedRoutes.some(route => pathnameWithoutLocale.startsWith(route))) {
        console.log("Redirecting from protected route to login");
        const redirectUrl = new URL(`/login`, req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }
  catch (error) {
    console.error("Middleware auth error:", error);
    // On error, redirect protected routes to login
    const pathnameWithoutLocale = pathname.replace(/^\/(en|hi|te)/, '') || '/';
    if (protectedRoutes.some(route => pathnameWithoutLocale.startsWith(route))) {
      const redirectUrl = new URL(`/login`, req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};