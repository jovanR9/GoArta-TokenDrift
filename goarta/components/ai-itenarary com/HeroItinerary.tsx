'use client';

import Background from '@/components/ai-itenarary com/background';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ChatInput, { ChatInputRef } from '@/components/ChatInput';
import SendButton from '@/components/SendButton';

interface HeroItineraryProps {
  onSendMessage?: (text: string) => void;
  onShowChat?: () => void;
}

export default function HeroItinerary({ onSendMessage, onShowChat }: HeroItineraryProps) {
  const router = useRouter();
  const bottleCanvasRef = useRef<HTMLCanvasElement>(null);
  const bottleRiveRef = useRef<object | null>(null);
  const [bottleAnimationLoaded, setBottleAnimationLoaded] = useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const chatInputRef = useRef<ChatInputRef>(null);

  // Rotating suggestions array
  const suggestions = [
    "Plan my Goa trip",
    "Best beaches to visit",
    "Local food recommendations",
    "Adventure activities",
    "Cultural heritage sites",
    "Budget travel tips",
    "Luxury accommodations",
    "Water sports options",
    "Nightlife recommendations",
    "Family-friendly activities",
    "Romantic getaways",
    "Shopping destinations"
  ];

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-rotate suggestions
  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(() => {
      setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    }, 5000); // Change every 5 seconds for better readability

    return () => clearInterval(interval);
  }, [suggestions.length, isMounted]);

  // Get next suggestions for display
  const getNextSuggestions = () => {
    const nextSuggestions = [];
    for (let i = 1; i <= 3; i++) {
      const index = (currentSuggestionIndex + i) % suggestions.length;
      nextSuggestions.push(suggestions[index]);
    }
    return nextSuggestions;
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleChatInputSend = (text: string) => {
    if (text.trim() === '') return;
    
    if (onSendMessage) {
      onSendMessage(text);
    }
    
    if (onShowChat) {
      onShowChat();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Auto-send suggestion after a brief delay with smooth transition
    setTimeout(() => {
      if (onSendMessage) {
        onSendMessage(suggestion);
      }
      if (onShowChat) {
        onShowChat();
      }
    }, 800); // Slightly longer delay for smooth transition
  };

  // Initialize bottle hover animation
  useEffect(() => {
    if (!isMounted) return;
    
    const initializeBottleAnimation = () => {
      if (typeof window === 'undefined' || !bottleCanvasRef.current) {
        return;
      }

      // Wait for Rive to be available
      const checkRive = () => {
        if (window.rive) {
          try {
            console.log("Initializing bottle animation...");
            
            // Set canvas size explicitly
            bottleCanvasRef.current!.width = 40;
            bottleCanvasRef.current!.height = 40;
            
            bottleRiveRef.current = new window.rive.Rive({
              src: "/animations/bottle_hover.riv",
              canvas: bottleCanvasRef.current!,
              autoplay: true,
              onLoad: () => {
                console.log("Bottle animation loaded successfully!");
                setBottleAnimationLoaded(true);
              },
              onError: (error: Error) => {
                console.error("Bottle animation error:", error);
              }
            });
          } catch (e: unknown) {
            console.error("Error creating bottle Rive instance:", e);
          }
        } else {
          // Retry after a short delay
          setTimeout(checkRive, 100);
        }
      };

      // Start checking for Rive
      checkRive();
    };

    // Initialize after a short delay to let the background animation load first
    const timer = setTimeout(initializeBottleAnimation, 1000);

    return () => {
      clearTimeout(timer);
      if (bottleRiveRef.current) {
        try {
          (bottleRiveRef.current as { cleanup: () => void }).cleanup();
        } catch (e: unknown) {
          console.error("Error cleaning up bottle Rive instance:", e);
        }
      }
    };
  }, [isMounted]);

  return (
    <div className="relative h-screen overflow-hidden flex flex-col">
      {/* Background Animation */}
      <Background className="fixed inset-0" />
      
      {/* Logo in top-left corner */}
      <div className="relative z-30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Animated Bottle Icon */}
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 relative">
              {isMounted && (
                <canvas 
                  ref={bottleCanvasRef}
                  className="w-10 h-10"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Even more visible fallback
                  }}
                />
              )}
              {/* Fallback bottle icon */}
              {(!bottleAnimationLoaded || !isMounted) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-white font-semibold">GoArta AI</span>
          </div>
          
          <button 
            onClick={handleBack}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Main UI Content - Centered */}
      <div className="relative z-20 flex-grow flex items-center justify-center px-6 overflow-hidden">
        <div className="text-center text-white max-w-2xl w-full">
          {/* Greeting */}
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Hi, How Can I Help?</h1>
          
          {/* Input Area */}
          <div className="w-full max-w-4xl mx-auto mt-4 flex items-center gap-4">
            <div className="flex-grow">
              <ChatInput onSendMessage={handleChatInputSend} ref={chatInputRef} />
            </div>
            <SendButton onClick={() => chatInputRef.current?.handleSend()} />
          </div>
          
          {/* Suggestion Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 mb-8">
            {/* Additional suggestion buttons */}
            <div className="flex gap-3">
              {getNextSuggestions().map((suggestion, index) => (
                <button 
                  key={`${currentSuggestionIndex}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 px-4 py-3 rounded-xl hover:bg-white transition-all duration-200 transform hover:scale-105 animate-in fade-in duration-300 shadow-lg group"
                >
                  <span className="transition-all duration-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#54529E] group-hover:via-[#824A97] group-hover:to-[#AB398E]">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Animation Keyframes */}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(-50%) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) rotate(360deg);
          }
        }
        
        .group:hover .absolute {
          top: 50% !important;
        }
      `}</style>
    </div>
  );
}
