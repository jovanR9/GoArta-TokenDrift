import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.56.1'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'incrediblegoa.org',
      },
      {
        protocol: 'https',
        hostname: 'www.tourmyindia.com',
      },
      {
        protocol: 'https',
        hostname: 'assets-in.bmscdn.com',
      },
      {
        protocol: 'https',
        hostname: 'avidlearning.in',
      },
      {
        protocol: 'https',
        hostname: 'blog.lemontreehotels.com',
      },
      {
        protocol: 'https',
        hostname: 'www.bestgoadeals.com',
      },
    ],
  },
  turbopack: {
    root: path.join(__dirname, './'),
  },
};

export default nextConfig;
