import type { NextConfig } from "next";
import { MAX_SUBMISSAO_MB } from "./lib/limites";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: `${MAX_SUBMISSAO_MB}mb`,
    },
  },
  async rewrites() {
    return [
      { source: "/api/branding/v:version/:path*", destination: "/api/branding/:path*" },
    ];
  },
};

export default nextConfig;
