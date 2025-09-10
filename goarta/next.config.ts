import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.56.1'],
  images: {
    domains: ['images.unsplash.com', 'incrediblegoa.org', 'www.tourmyindia.com', 'assets-in.bmscdn.com', 'avidlearning.in', 'blog.lemontreehotels.com', 'www.bestgoadeals.com','encrypted-tbn0.gstatic.com','pcsqsppnjgupgbwrpyti.supabase.co','storage.googleapis.com', 'www.tusktravel.com'],
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
      {
        protocol: 'https',
        hostname: 'www.tusktravel.com',
      },
    ],
  },
  turbopack: {
    root: path.join(__dirname, './'),
  },
};

export default nextConfig;
