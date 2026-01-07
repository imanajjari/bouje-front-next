const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
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
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '188.121.100.227',
        port: '8000',
        pathname: '/media/**',
      },
// DEBOG : FOR CONNECT TO SERVER
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ⬇️ این قسمت رو اضافه کن
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("canvas"); // ⬅️ بگو canvas رو نادیده بگیره
    }
    return config;
  },
});

module.exports = nextConfig;
