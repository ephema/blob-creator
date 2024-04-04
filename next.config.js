/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
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
