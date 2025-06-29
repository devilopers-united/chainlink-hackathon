// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  // Optional: Add specific rule overrides if you want to keep ESLint but ignore certain rules
  typescript: {
    // Ignore type errors during builds (e.g., 'any' type usage)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
