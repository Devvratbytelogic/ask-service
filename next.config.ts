import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,

    formats: ["image/webp"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;