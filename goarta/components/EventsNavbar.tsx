"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function EventsNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 md:py-5 px-4 md:px-6 lg:px-8 flex items-center justify-between">
      {/* Left Section - Logo */}
      <div className="flex items-center">
        <div className="w-32 h-12 md:w-40 md:h-16">
          <Image
            src="/goarta logo.png"
            alt="GoArta Logo"
            width={160}
            height={64}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-800 focus:outline-none"
        >
          <svg 
            className="h-6 w-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        {/* Navigation Links */}
        <div className="flex items-center space-x-8 lg:space-x-12">
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white bg-opacity-90 backdrop-blur-sm py-4 px-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/events" 
              className="text-xl py-2 hover:text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              href="/ai-itinerary" 
              className="text-xl py-2 hover:text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Itinerary Generator
            </Link>
            <Link 
              href="/dashboard" 
              className="text-xl py-2 hover:text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}