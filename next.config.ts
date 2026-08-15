import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",
  reactStrictMode: false,
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stickershop.line-scdn.net",
        pathname: "/stickershop/**",
      },
    ],
  },
};

export default nextConfig;
