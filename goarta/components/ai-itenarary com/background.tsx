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
          artboard: "Desktop - 1",
          autoplay: true,
          animations: ["clouds animation", "palm tree timeline", "stars animation"],
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
      
      {/* Components will be rendered here by parent component */}
    </div>
  );
};

export default Background;
