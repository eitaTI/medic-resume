import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "35mb",
    },
  },
  async rewrites() {
    return [
      { source: "/api/branding/v:version/:path*", destination: "/api/branding/:path*" },
    ];
  },
};

export default nextConfig;
