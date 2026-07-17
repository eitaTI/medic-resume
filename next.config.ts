import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return [
      { source: "/api/branding/v:version/:path*", destination: "/api/branding/:path*" },
    ];
  },
};

export default nextConfig;
