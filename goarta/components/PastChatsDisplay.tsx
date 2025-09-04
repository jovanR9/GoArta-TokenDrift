'use client';

import React, { useEffect, useRef, useState } from 'react';
import CloseButton from '@/components/CloseButton';

declare global {
  interface Window {
    rive: {
      Rive: new (args: object) => object;
      Layout: new (args: object) => object;
      Fit: { Contain: string };
      Alignment: { Center: string };
    };
  }
}

interface PastChatsDisplayProps {
  className?: string;
  onClose: () => void;
}

const PastChatsDisplay: React.FC<PastChatsDisplayProps> = ({ className = '', onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveInstanceRef = useRef<object | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const loadRiveScript = async () => {
      if (typeof window === 'undefined') return;

      if (window.rive) {
        initializeRive();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@rive-app/canvas';
      script.onload = () => {
        console.log('Rive script loaded for PastChatsDisplay');
        initializeRive();
      };
      script.onerror = (error) => {
        console.error('Failed to load Rive script for PastChatsDisplay:', error);
      };
      document.head.appendChild(script);
    };

    const initializeRive = () => {
      if (!canvasRef.current || !window.rive) return;

      console.log("Attempting to start Rive for PastChatsDisplay...");

      try {
        riveInstanceRef.current = new window.rive.Rive({
          src: "/animations/past_chats.riv", // Assuming this path
          canvas: canvasRef.current,
          stateMachines: ["compass hover state machine", "panjim church hover state machine"],
          animations: ["clouds animation"],
          autoplay: true,
          layout: new window.rive.Layout({
            fit: window.rive.Fit.Contain,
            alignment: window.rive.Alignment.Center
          }),
          onLoad: () => {
            console.log("PastChatsDisplay Rive loaded successfully!");
            (riveInstanceRef.current as { resizeDrawingSurfaceToCanvas: () => void }).resizeDrawingSurfaceToCanvas();
          },
          onError: (error: Error) => {
            console.error("PastChatsDisplay Rive Error:", error);
          }
        });
        console.log("PastChatsDisplay Rive constructor called.");
      } catch (e) {
        console.error("Error creating PastChatsDisplay Rive instance:", e);
      }
    };

    loadRiveScript();

    return () => {
      if (riveInstanceRef.current) {
        try {
          riveInstanceRef.current.cleanup();
        } catch (e) {
          console.error("Error cleaning up PastChatsDisplay Rive instance:", e);
        }
      }
    };
  }, [isMounted]);

  return (
    <div className={`fixed inset-0 z-40 flex items-center justify-center ${className}`}>
      {isMounted && (
        <canvas
          ref={canvasRef}
          className="w-[110vw] h-[110vh]"
          style={{
            position: 'relative',
          }}
        />
      )}
      <CloseButton onClick={onClose} />
    </div>
  );
};

export default PastChatsDisplay;