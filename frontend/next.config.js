/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'via.placeholder.com',
      'web3apis-backend.up.railway.app'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:5000/api/:path*', // Docker ortamında backend servisi
      },
      {
        source: '/no-image.png',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') + '/no-image.png'
          : '/no-image.png',
      },
      {
        source: '/uploads/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') + '/uploads/:path*'
          : 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig
