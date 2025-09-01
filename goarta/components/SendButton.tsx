'use client';

import React from 'react';

const SendButton: React.FC = () => {
  return (
    <button
      id="send-button"
      className="
        w-[60px] h-[60px] 
        rounded-full 
        overflow-hidden 
        transition-all duration-300 
        flex items-center justify-center 
        cursor-pointer
        text-white
        border-[5px] border-white
        font-semibold
        text-xl
        shadow-lg
        backdrop-blur-[10px]
        bg-[rgba(255,255,255,0.1)]
      "
      style={{
        fontFamily: 'Helvetica, sans-serif',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <i className="ri-water-fill"></i>

      
    </button>
  );
};

export default SendButton;
