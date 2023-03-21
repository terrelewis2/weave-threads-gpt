/** @type {import('next').NextConfig} */
require('dotenv').config({ path: '.env.local' });

const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
}

module.exports = nextConfig
