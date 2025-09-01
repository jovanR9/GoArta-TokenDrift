'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    rive: any;
  }
}

const PastHistoryButton: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<any>(null);
  const numberInputRef = useRef<any>(null);

  useEffect(() => {
    let riveInstance: any;
    let handleResize: () => void;

    const loadRiveScript = () => {
      if (typeof window === 'undefined') return;
      if (window.rive) {
        initializeRive();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@rive-app/canvas@2.7.0';
      script.onload = () => {
        console.log('Rive script loaded (version 2.7.0)');
        initializeRive();
      };
      document.head.appendChild(script);
    };

    const initializeRive = () => {
      if (!canvasRef.current || !window.rive) return;

      riveInstance = new window.rive.Rive({
        src: '/animations/bottle_hover.riv',
        canvas: canvasRef.current,
                artboard: 'Desktop - 1',
        stateMachines: ['bottle hover'],
        autoplay: true,
        layout: new window.rive.Layout({
          fit: window.rive.Fit.Contain,
          alignment: window.rive.Alignment.BottomCenter
        }),
        onLoad: () => {
          console.log('Rive loaded');
          riveInstance.resizeDrawingSurfaceToCanvas();
          const inputs = riveInstance.stateMachineInputs('bottle hover');
          console.log("Inputs found:", inputs.map((i: any) => ({ name: i.name, type: i.type })));
          numberInputRef.current = inputs.find((i: any) => i.name === 'Number 1');
          if (numberInputRef.current) {
            console.log("✅ Found Number 1 input");
          } else {
            console.error("❌ Could not find 'Number 1'");
          }
        },
      });

      riveRef.current = riveInstance;

      handleResize = () => riveInstance.resizeDrawingSurfaceToCanvas();
      window.addEventListener('resize', handleResize);
    };

    loadRiveScript();

    return () => {
      if (riveInstance) {
        riveInstance.cleanup();
      }
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const handleClick = () => {
    if (numberInputRef.current) {
      if (numberInputRef.current.value === 1) {
        numberInputRef.current.value = 2;
      } else {
        numberInputRef.current.value = 1;
      }
      console.log("Number 1 toggled to:", numberInputRef.current.value);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width="97"
      height="71"
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 0,
        left: '20px',
        width: '110px',
        height: '80px',
        cursor: 'pointer',
        zIndex: 31
      }}
      className=""
    />
  );
};

export default PastHistoryButton;
