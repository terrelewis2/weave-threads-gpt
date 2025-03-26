/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '.env.local' });

const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  },
  // Using the new Next.js 13+ features
  experimental: {
    serverActions: true,
  },
  // Optimizing images
  images: {
    domains: ['cdn.example.com'], // Add any image domains you need
    formats: ['image/avif', 'image/webp'],
  },
  // Adding security headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
