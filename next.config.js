// next.config.js
const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '188.121.100.227', port: '8000', pathname: '/media/**' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'bouje.ir' },
      { protocol: 'https', hostname: 'bouje-back.onrender.com', pathname: '/media/**' },
    ],
  },

  eslint: { ignoreDuringBuilds: true },

  // ✅ برای dev روی شبکه لازم است تا دسترسی cross-origin به /_next/* مجاز شود
  // فقط hostname/IP را بده (بدون پروتکل/پورت)
  allowedDevOrigins: ['188.121.100.227', 'localhost', '127.0.0.1'],

  // ✅ اختیاری ولی پیشنهادی: حذف CORS در dev با Proxy داخلی Next
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://188.121.100.227:8000/api/:path*' },
    ];
  },
});
