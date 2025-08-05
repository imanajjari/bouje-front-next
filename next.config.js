const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
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
        hostname: '188.213.199.87',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});
