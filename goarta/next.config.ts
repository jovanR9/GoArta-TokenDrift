import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.56.1'],
  images: {
    domains: ['images.unsplash.com', 'incrediblegoa.org', 'www.tourmyindia.com', 'assets-in.bmscdn.com', 'avidlearning.in', 'blog.lemontreehotels.com', 'www.bestgoadeals.com','encrypted-tbn0.gstatic.com','pcsqsppnjgupgbwrpyti.supabase.co'],
  },
};

export default nextConfig;
