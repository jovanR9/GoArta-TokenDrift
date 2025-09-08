'use client';

import React from 'react';
import Image from 'next/image';

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute z-50 cursor-pointer"
      style={{ top: '6vh', right: '14vw' }}
    >
      <Image
        src="/ai_itinerary_images/close_past_chats_button_image.png" // Correct image path
        alt="Close"
        width={60}
        height={32}
        className="min-w-[60px] min-h-[32px]" // Adjust size as needed
        style={{ width: '5vw', height: '6vh' }} // Adjust size as needed
      />
    </button>
  );
};

export default CloseButton;
