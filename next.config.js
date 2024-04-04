/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com'],
    minimumCacheTTL: 30,
  },
}

module.exports = nextConfig
