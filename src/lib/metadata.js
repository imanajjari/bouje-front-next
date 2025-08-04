// lib/metadata.ts

const config = {
  siteName: 'نام شرکت شما',
  siteUrl: 'https://yourwebsite.com',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@yourhandle',
};

export function createMetadata({
  title,
  description,
  path = '',
  locale = 'fa',
  image,
  keywords = [],
  type = 'website',
}) {
  // برای ساختار سه زبانه
  const localizedPath = `/${locale}${path}`;
  const url = `${config.siteUrl}${localizedPath}`;
  const ogImage = image || config.defaultImage;
  
  // تنظیم locale برای OpenGraph
  const getOgLocale = (lang) => {
    switch (lang) {
      case 'fa': return 'fa_IR';
      case 'en': return 'en_US';
      case 'ar': return 'ar_SA';
      default: return 'fa_IR';
    }
  };

  return {
    title: `${title} | ${config.siteName}`,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: config.siteName }],
    metadataBase: new URL(config.siteUrl),
    openGraph: {
      title: `${title} | ${config.siteName}`,
      description,
      type,
      locale: getOgLocale(locale),
      url,
      siteName: config.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${config.siteName}`,
      description,
      images: [ogImage],
      creator: config.twitterHandle,
    },
    alternates: {
      canonical: url,
      languages: {
        'fa-IR': `${config.siteUrl}/fa${path}`,
        'en-US': `${config.siteUrl}/en${path}`,
        'ar-SA': `${config.siteUrl}/ar${path}`,
        'x-default': `${config.siteUrl}/fa${path}`, // زبان پیش‌فرض
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

