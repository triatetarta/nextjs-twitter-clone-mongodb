/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "i.pravatar.cc",
      "randomuser.me",
      "london.ctvnews.ca",
    ],
  },
};

module.exports = nextConfig;
