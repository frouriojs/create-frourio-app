import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.resolve.symlinks = false;

    return config;
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        rewrites: async () => [
          { source: '/api/:path*', destination: 'http://localhost:31577/api/:path*' },
        ],
      }
    : { output: 'export' }),
};

export default nextConfig;
