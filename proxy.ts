import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, isValidLocale } from '@/lib/i18n/config';

// Paths that should not be localized
const publicPaths = ['/next-proxy', '/_next', '/favicon.ico', '/public'];

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }

  return null;
}

function getPreferredLocale(request: NextRequest): string {
  // Check cookie first
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  if (localeCookie && isValidLocale(localeCookie.value)) {
    return localeCookie.value;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map((lang) => {
      const [code] = lang.trim().split(';');
      return code.split('-')[0].toLowerCase();
    });

    for (const lang of languages) {
      if (isValidLocale(lang)) {
        return lang;
      }
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if path already has a locale
  const pathnameLocale = getLocaleFromPath(pathname);

  if (pathnameLocale) {
    // Valid locale in path, set cookie and continue
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', pathnameLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
    return response;
  }

  // No locale in path, redirect to preferred locale
  const preferredLocale = getPreferredLocale(request);
  const newUrl = new URL(`/${preferredLocale}${pathname}`, request.url);

  // Preserve query string
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  response.cookies.set('NEXT_LOCALE', preferredLocale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!next-proxy|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
