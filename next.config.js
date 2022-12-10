/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
}

module.exports = nextConfig
