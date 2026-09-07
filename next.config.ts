import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['desecrate-distort-divided.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "objectstorage.us-phoenix-1.oraclecloud.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig
