import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    localPatterns: [
      { pathname: "/**", search: "/.*/" },
    ],
  },
};

export default nextConfig;
