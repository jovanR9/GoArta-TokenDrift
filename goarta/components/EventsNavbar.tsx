"use client";

import Image from "next/image";
import Link from "next/link";

export default function EventsNavbar() {
  return (
    <nav className="w-full py-4 md:py-5 px-4 md:px-6 lg:px-8 flex items-center justify-between">
      {/* Left Section - Logo */}
      <div className="flex items-center">
        <div className="w-40 h-16">
          <Image
            src="/goarta logo.png"
            alt="GoArta Logo"
            width={160}
            height={64}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Right Section - Navigation Links and Profile Indicator */}
      <div className="flex items-center space-x-8">
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-12">
          <Link href="/events" className="text-xl hover:text-gray-600 transition-colors">
            Events
          </Link>
          <Link href="/ai-itinerary" className="text-xl hover:text-gray-600 transition-colors">
            Itinerary Generator
          </Link>
          <Link href="/dashboard" className="text-xl hover:text-gray-600 transition-colors">
            Profile
          </Link>
        </div>
        
        {/* Profile Indicator */}
        <div className="w-10 h-10 rounded-full bg-red-500"></div>
      </div>
    </nav>
  );
}