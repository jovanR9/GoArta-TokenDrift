"use client";

import Image from "next/image";
import Link from "next/link";

export default function EventsHero() {
  return (
    <section className="relative w-full py-8 px-4 sm:py-10 md:py-12">
      {/* Container for responsive grid layout */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Content - Text Block */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Goa comes alive here.
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 mb-6 sm:mb-8 max-w-2xl">
              Discover Goa&#39;s rhythm — festivals, parades, concerts, and celebrations, all in one place.
            </p>
            <Link 
              href="/events" 
              className="inline-flex items-center justify-center bg-black text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-base sm:text-lg font-medium hover:bg-gray-800 transition-colors duration-300"
            >
              View events
              <svg 
                className="ml-2 w-4 h-4 sm:w-5 sm:h-5" 
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
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-lg">
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
  );
}