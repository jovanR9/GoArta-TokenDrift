'use client';

import React, { useEffect, useRef } from 'react';

// Extend Window interface to include rive
declare global {
  interface Window {
    rive: any;
  }
}

interface BackgroundProps {
  className?: string;
}

const Background: React.FC<BackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load Rive script dynamically
    const loadRiveScript = async () => {
      if (typeof window === 'undefined') return;

      // Check if Rive is already loaded
      if (window.rive) {
        initializeRive();
        return;
      }

      // Load Rive script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@rive-app/canvas';
      script.onload = () => {
        console.log('Rive script loaded');
        initializeRive();
      };
      script.onerror = (error) => {
        console.error('Failed to load Rive script:', error);
      };
      document.head.appendChild(script);
    };

    const initializeRive = () => {
      if (!canvasRef.current || !window.rive) return;

      console.log("Attempting to start Rive...");

      // Define a function to handle resizing and layout changes
      const handleResize = () => {
        if (!riveInstanceRef.current) return;

        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
          console.log("Applying Mobile Layout (LeftCenter)");
          riveInstanceRef.current.layout = new window.rive.Layout({
            fit: window.rive.Fit.Cover,
            alignment: window.rive.Alignment.CenterLeft
          });
        } else {
          console.log("Applying Desktop Layout (Center)");
          riveInstanceRef.current.layout = new window.rive.Layout({
            fit: window.rive.Fit.Cover,
            alignment: window.rive.Alignment.Center
          });
        }

        riveInstanceRef.current.resizeDrawingSurfaceToCanvas();
      };

      try {
        riveInstanceRef.current = new window.rive.Rive({
          src: "/animations/beach.riv",
          canvas: canvasRef.current,
          autoplay: true,
          onLoad: () => {
            console.log("Rive loaded successfully!");
            // Set the initial layout and start listening for resize events
            handleResize();
            window.addEventListener('resize', handleResize);
          },
          onError: (error: any) => {
            console.error("Rive Error:", error);
          }
        });
        console.log("Rive constructor called.");
      } catch (e) {
        console.error("Error creating Rive instance:", e);
      }
    };

    loadRiveScript();

    // Cleanup function
    return () => {
      if (riveInstanceRef.current) {
        try {
          riveInstanceRef.current.cleanup();
        } catch (e) {
          console.error("Error cleaning up Rive instance:", e);
        }
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
      
      {/* Circular Send Button with Wave Animation */}
      <button 
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl transition-all duration-300 cursor-pointer overflow-hidden hover:text-cyan-400 z-50"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
        onClick={() => {
          console.log('Send button clicked!');
          // Add your send functionality here
        }}
      >
        {/* Wave Animation */}
        <div 
          className="absolute inset-0 rounded-full bg-white opacity-20"
          style={{
            animation: 'wave 5s infinite linear',
            transform: 'translateX(-50%) rotate(0deg)',
            left: '50%',
            top: '90%',
            width: '180px',
            height: '180px',
            borderRadius: '79px',
          }}
        />
        
        {/* Send Icon */}
        <svg 
          className="relative z-10" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ width: '20px', height: '20px' }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
          />
        </svg>
      </button>

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
        
        button:hover .absolute {
          top: 50% !important;
        }
      `}</style>
    </div>
  );
};

export default Background;
