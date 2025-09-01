'use client';

import React, { useState } from 'react';

interface TextInputAreaProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  className?: string;
}

const TextInputArea: React.FC<TextInputAreaProps> = ({ 
  placeholder = "Ask me about Goa travel plans...",
  onSend,
  className = ""
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && onSend) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full bg-white/20 text-white placeholder-white/70 px-4 py-3 rounded-xl border border-white/30 focus:outline-none focus:border-white/50 transition-colors"
          />
        </div>
        <button 
          onClick={handleSend}
          className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors relative overflow-hidden group"
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
          <svg className="w-6 h-6 relative z-10 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
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
};

export default TextInputArea; 