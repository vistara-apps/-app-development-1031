/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'randomuser.me',
      'images.unsplash.com',
      'via.placeholder.com',
    ],
  },
};

module.exports = nextConfig;

