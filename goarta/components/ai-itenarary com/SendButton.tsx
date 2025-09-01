'use client';

import React from 'react';

interface SendButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SendButton: React.FC<SendButtonProps> = ({ 
  onClick, 
  className = '',
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl'
  };

  const iconSizes = {
    sm: '16px',
    md: '20px',
    lg: '24px'
  };

  return (
    <button 
      className={`rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer overflow-hidden hover:text-cyan-400 z-50 ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}
      onClick={onClick}
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
        style={{ width: iconSizes[size], height: iconSizes[size] }}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
        />
      </svg>

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
    </button>
  );
};

export default SendButton; 