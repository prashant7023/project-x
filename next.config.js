/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  reactStrictMode: true,
  // Custom webpack config to suppress specific warnings
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Suppress browser extension related warnings in development
      config.stats = {
        ...config.stats,
        warningsFilter: [
          /cz-shortcut-listen/,
          /data-new-gr-c-s-check-loaded/,
          /data-gr-ext-installed/,
          /Extra attributes from the server/
        ]
      };
    }
    return config;
  },
};

module.exports = nextConfig;
