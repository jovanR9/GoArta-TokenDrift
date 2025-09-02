'use client';

import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-50 cursor-pointer"
    >
      <img
        src="/images/close_past_chats_button_image.png" // Placeholder image path
        alt="Close"
        className="w-8 h-8" // Adjust size as needed
      />
    </button>
  );
};

export default CloseButton;
