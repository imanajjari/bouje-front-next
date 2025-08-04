// src/app/[locale]/layout.js

import '../../styles/globals.css';
import { notFound, redirect } from 'next/navigation';
import ClientProviders from './ClientProviders';
import IntlProviderWrapper from '../../components/IntlProviderWrapper';
import { supportedLocales } from '../../i18n/settings';
import { getDefaultMetadata } from '../../lib/seo';

/* ----------  SEO Metadata ---------- */
export async function generateMetadata(context) {
  const { locale } = await context.params;

  if (!supportedLocales.includes(locale)) {
    return {
      title: '404 - Page Not Found',
      description: 'The page you requested could not be found.',
    };
  }

  const { title, description } = getDefaultMetadata(locale);

  // ساخت hreflang و alternates
  const baseUrl = 'https://bouje.ir';
  const hreflangs = Object.fromEntries(
    supportedLocales.map((loc) => [loc, `${baseUrl}/${loc}`])
  );

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: hreflangs, // hreflang: برای سئو چندزبانه
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: 'Bouje',
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@bouje', // اگه داری، هندل توییتر رو بذار
    },
    icons: {
      icon: '/favicon.ico', // ✅ این خط favicon را اضافه می‌کند
    },
  };
}

/* ----------  Static Params for SSG ---------- */
export async function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

/* ----------  Root Layout ---------- */
export default async function RootLayout(props) {
  const { params, children } = props;
  const { locale } = await params;

  if (!supportedLocales.includes(locale)) {
    redirect(`/fa/404?original=${encodeURIComponent(`/${locale}`)}`);
  }

  const dir = ['fa', 'ar'].includes(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className="antialiased">
        <ClientProviders>
          <IntlProviderWrapper locale={locale}>
            {children}
          </IntlProviderWrapper>
        </ClientProviders>
      </body>
    </html>
  );
}
