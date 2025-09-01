'use client';

import Background from '@/components/ai-itenarary com/background';
import TextInputArea from '@/components/ai-itenarary com/TextInputArea';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function AIItineraryPage() {
  const router = useRouter();
  const bottleCanvasRef = useRef<HTMLCanvasElement>(null);
  const bottleRiveRef = useRef<any>(null);
  const [bottleAnimationLoaded, setBottleAnimationLoaded] = useState(false);

  const handleSendMessage = (message: string) => {
    console.log('Message sent:', message);
    // Add your AI processing logic here
  };

  const handleBack = () => {
    router.push('/');
  };

  // Initialize bottle hover animation
  useEffect(() => {
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
              onError: (error: any) => {
                console.error("Bottle animation error:", error);
              }
            });
          } catch (e) {
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
          bottleRiveRef.current.cleanup();
        } catch (e) {
          console.error("Error cleaning up bottle Rive instance:", e);
        }
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background Animation */}
      <Background className="fixed inset-0" />
      
      {/* Logo in top-left corner */}
      <div className="relative z-30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Animated Bottle Icon */}
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 relative">
              <canvas 
                ref={bottleCanvasRef}
                className="w-10 h-10"
                style={{
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', // Even more visible fallback
                }}
              />
              {/* Fallback bottle icon */}
              {!bottleAnimationLoaded && (
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
      <div className="relative z-20 min-h-screen flex items-center justify-center px-6">
        <div className="text-center text-white max-w-2xl w-full">
          {/* Greeting */}
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Hi, How Can I Help?</h1>
          
          {/* Input Area */}
          <TextInputArea onSend={handleSendMessage} />
          
          {/* Suggestion Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button className="bg-gradient-to-r from-orange-400/70 to-pink-400/70 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:from-orange-400/80 hover:to-pink-400/80 transition-all">
              Plan my Goa trip
            </button>
            <button className="bg-gradient-to-r from-orange-400/70 to-pink-400/70 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:from-orange-400/80 hover:to-pink-400/80 transition-all">
              Best beaches to visit
            </button>
            <button className="bg-gradient-to-r from-orange-400/70 to-pink-400/70 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:from-orange-400/80 hover:to-pink-400/80 transition-all">
              Local food recommendations
            </button>
          </div>
        </div>
      </div>
      

    </div>
  );
}
