import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return [
      { source: "/branding/v:version/:path*", destination: "/branding/:path*" },
    ];
  },
};

export default nextConfig;
