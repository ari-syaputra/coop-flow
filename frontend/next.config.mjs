/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },

  turbopack: {},

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, 
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;