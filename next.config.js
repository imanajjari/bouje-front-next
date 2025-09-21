const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '188.121.100.227',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'bouje.ir',
      },
      {
        protocol: 'https',
        hostname: 'bouje-back.onrender.com',
        pathname: '/media/**', // اگر تصاویر از مسیر media می‌آیند
      },
      {
        protocol: 'http',
        hostname: '188.121.100.227',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});
