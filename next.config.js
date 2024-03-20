/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return {
      ...config,

      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          module: false,
          fs: false,
          path: false,
        },
      },
    };
  },
};

module.exports = nextConfig;
