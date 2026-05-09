import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  experimental: {
    turbo: {
      enabled: false,
    },
  },
};

export default nextConfig;