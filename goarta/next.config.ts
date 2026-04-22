import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'incrediblegoa.org', 'www.tourmyindia.com', 'assets-in.bmscdn.com', 'avidlearning.in', 'blog.lemontreehotels.com', 'www.bestgoadeals.com', 'encrypted-tbn0.gstatic.com', 'pcsqsppnjgupgbwrpyti.supabase.co', 'storage.googleapis.com', 'www.tusktravel.com', 'goa.pscnotes.com', 'www.dorsetthotels.com', 'static.tripzilla.in', 'variety.com', 'aaniekgoa.com', 'itsgoa.com', 'cdn.thegoavilla.com', 'inngoa.com', 'www.susegadsuitesgoa.com', 'static.wixstatic.com'],
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
      {
        protocol: 'https',
        hostname: 'goa.pscnotes.com',
      },
      {
        protocol: 'https',
        hostname: 'variety.com',
      },
      {
        protocol: 'https',
        hostname: 'pcsqsppnjgupgbwrpyti.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.dorsetthotels.com',
      },
      {
        protocol: 'https',
        hostname: 'static.tripzilla.in',
      },
      {
        protocol: 'https',
        hostname: 'aaniekgoa.com',
      },
      {
        protocol: 'https',
        hostname: 'itsgoa.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.thegoavilla.com',
      },
      {
        protocol: 'https',
        hostname: 'inngoa.com',
      },
      {
        protocol: 'https',
        hostname: 'www.susegadsuitesgoa.com',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
    ],
  },
  // experimental: {
  //   outputFileTracingRoot: path.join(__dirname, "./"),
  // },
};

export default nextConfig;
