/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'web3apis-backend.up.railway.app' // Railway backend domaini eklendi
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') + '/api/:path*'
          : '/api/:path*', // fallback kaldırıldı
      },
    ];
  },
}

module.exports = nextConfig
