const { i18n } = require('./next-i18next.config');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  experimental: {
    scrollRestoration: true,
  },
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['localhost', 'images.ctfassets.net'],
  },
  eslint: {
    dirs: ['pages', 'shared', 'components', 'icons'],
  },
  output: 'standalone',
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
});
