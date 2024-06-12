/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/hcmus-alumverse/**',
      },
      {
        protocol: 'https',
        hostname: 'hcmus.edu.vn',
        pathname: '**',
      },
    ],
    minimumCacheTTL: 30,
  },
  async rewrites() {
    return [
      {
        source: '/groups/:id/posts',
        destination: '/groups/:id',
      },
    ]
  },
}

module.exports = nextConfig
