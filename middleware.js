// middleware.js
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fa','ar'],
  defaultLocale: 'fa',
});

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
