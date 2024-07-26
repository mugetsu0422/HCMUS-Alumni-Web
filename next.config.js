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
      {
        source: '/profile/:id/activities/joined-events',
        destination: '/profile/:id/activities',
      },
      {
        source: '/profile/:id',
        destination: '/profile/:id/about',
      },
    ]
  },
}

module.exports = nextConfig
