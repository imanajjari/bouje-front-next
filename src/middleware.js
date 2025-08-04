// middleware.js (در root پروژه)
import { NextResponse } from 'next/server';
import { supportedLocales } from './../src/i18n/settings';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // چک کردن اینکه آیا locale در path وجود دارد
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // اگر locale وجود ندارد، به en redirect کن
  if (!pathnameHasLocale) {
    // اگر path فقط / است، به /en redirect کن
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/fa', request.url));
    }
    
    // برای سایر pathهای نامعتبر، به صفحه 404 مربوط به en redirect کن
    return NextResponse.redirect(new URL(`/fa/404?original=${encodeURIComponent(pathname)}`, request.url));
  }

  // استخراج locale از path
  const locale = pathname.split('/')[1];
  
  // چک کردن اینکه آیا locale معتبر است
  if (!supportedLocales.includes(locale)) {
    return NextResponse.redirect(new URL('/fa/404', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*$).*)',
  ],
};