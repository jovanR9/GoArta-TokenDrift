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
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const chatInputRef = useRef<ChatInputRef>(null);
  const fullGreeting = "Hi, How Can I Help?";
  const [displayedGreeting, setDisplayedGreeting] = useState("");

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

  // Typing effect for greeting
  useEffect(() => {
    let index = 0;

    const typeCharacter = () => {
      if (index <= fullGreeting.length) {
        setDisplayedGreeting(fullGreeting.slice(0, index));
        index++;
        setTimeout(typeCharacter, 50); // Typing speed
      }
    };

    typeCharacter();

    return () => {
      // no cleanup needed for simple timeout chain
    };
  }, [fullGreeting]);

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
    }, 800);
  };

  // Initialize bottle hover animation
  useEffect(() => {
    if (!isMounted) return;

    const initializeBottleAnimation = () => {
      if (typeof window === 'undefined' || !bottleCanvasRef.current) {
        return;
      }

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
              },
              onError: (error: Error) => {
                console.error("Bottle animation error:", error);
              }
            });
          } catch (e: unknown) {
            console.error("Error creating bottle Rive instance:", e);
          }
        } else {
          setTimeout(checkRive, 100);
        }
      };

      checkRive();
    };

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

      {/* Back to Home Button - Top Right */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={handleBack}
          className="bg-[rgba(217,217,217,0.1)] backdrop-blur-[60px] border border-white/20 text-white px-4 py-3 rounded-xl hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg group"
        >
          <span className="transition-all duration-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#54529E] group-hover:via-[#824A97] group-hover:to-[#AB398E]">
            ← Back to Home
          </span>
        </button>
      </div>

      {/* Main UI Content - Centered */}
      <div className="relative z-20 flex-grow flex items-center justify-center px-6 overflow-hidden">
        <div className="text-center text-white max-w-2xl w-full">
          {/* Greeting */}
          <h1 className="text-4xl md:text-5xl font-bold mb-8">{displayedGreeting}</h1>

          {/* Input Area */}
          <div className="w-full max-w-4xl mx-auto mt-4 flex items-center gap-4">
            <div className="flex-grow">
              <ChatInput onSendMessage={handleChatInputSend} ref={chatInputRef} />
            </div>
            <SendButton onClick={() => chatInputRef.current?.handleSend()} />
          </div>

          {/* Suggestion Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 mb-8">
            <div className="flex gap-3">
              {getNextSuggestions().map((suggestion, index) => (
                <button
                  key={`${currentSuggestionIndex}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-[rgba(217,217,217,0.1)] backdrop-blur-[60px] border border-white/20 text-white px-4 py-3 rounded-xl hover:bg-white transition-all duration-200 transform hover:scale-105 animate-in fade-in duration-300 shadow-lg group"
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
