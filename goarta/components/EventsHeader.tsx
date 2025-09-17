"use client";

import Image from "next/image";
import Link from "next/link";

export default function EventsHeader() {
  return (
    <>
      {/* Combined Navbar and Hero Section */}
      <div
        className="w-full"
        style={{
          background: 'linear-gradient(180deg, #85A8EE70 0%, #2AFF007D 100%)'
        }}
      >
        {/* Navbar Section */}
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

        {/* Hero Section */}
        <section className="relative w-full py-8 md:py-12 px-4">
          {/* Container for responsive grid layout */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Left Content - Text Block */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                  Goa comes alive here.
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-800 mb-8 max-w-2xl">
                  Discover Goa&#39;s rhythm — festivals, parades, concerts, and celebrations, all in one place.
                </p>
                <Link 
                  href="/events" 
                  className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-300"
                >
                  View events
                  <svg 
                    className="ml-2 w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </Link>
              </div>
              
              {/* Right Content - Image Block */}
              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg self-end">
                  <Image
                    src="/carnival festival.png"
                    alt="Carnival Festival Float"
                    width={500}
                    height={500}
                    className="object-contain w-full h-auto scale-x-[-1]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}