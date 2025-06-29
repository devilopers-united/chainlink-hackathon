import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Disable Image Optimization API warnings
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
