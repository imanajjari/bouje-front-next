// src/middleware.js
import { NextResponse } from "next/server";
import { supportedLocales, defaultLocale } from "./i18n/settings";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // اجازه بده این‌ها رد بشن
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  // آیا مسیر با locale شروع میشه؟
  const hasLocale = supportedLocales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

  // اگر locale نداشت:
  if (!hasLocale) {
    // روت سایت بره روی /fa
    if (pathname === "/") {
      return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
    }
    // بقیه مسیرها: 404 فارسی
    return NextResponse.redirect(
      new URL(`/${defaultLocale}/404?original=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};


