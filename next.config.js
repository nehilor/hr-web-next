/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable middleware
  experimental: {
    middlewareSourceMaps: false,
  },
  // Ensure no middleware is loaded
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
}

module.exports = nextConfig
