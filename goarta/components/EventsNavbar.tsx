"use client";

import Image from "next/image";
import Link from "next/link";

export default function EventsNavbar() {
  return (
    <nav 
      className="w-full py-4 md:py-5 px-4 md:px-6 lg:px-8 flex items-center justify-between"
      style={{
        background: 'linear-gradient(90deg, white 70%, rgba(255, 0, 0, 0.1) 100%)'
      }}
    >
      {/* Left Section - Logo + Brand */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            src="/Logo.png"
            alt="GoArta Logo"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <span 
          className="text-2xl font-bold"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          GoArta
        </span>
      </div>

      {/* Center Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/events" className="text-gray-800 hover:text-gray-600 transition-colors">
          Events
        </Link>
        <Link href="/ai-itinerary" className="text-gray-800 hover:text-gray-600 transition-colors">
          Itinerary Generator
        </Link>
        <Link href="/dashboard" className="text-gray-800 hover:text-gray-600 transition-colors">
          Profile
        </Link>
      </div>

      {/* Right Section - Profile Indicator */}
      <div className="w-8 h-8 rounded-full bg-red-500"></div>
    </nav>
  );
}