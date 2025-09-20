// app/robots.js
export default function robots() {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    return {
      rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/_next/'] }],
      sitemap: `${base}/sitemap.xml`,
      host: base,
    };
  }
  