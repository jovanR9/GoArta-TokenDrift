'use client';

import React from 'react';

interface BlurOverlayProps {
  className?: string;
}

const BlurOverlay: React.FC<BlurOverlayProps> = ({ className = '' }) => {
  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm ${className}`}
      style={{
        zIndex: 35,
        transition: 'backdrop-filter 0.3s ease-in-out',
      }}
    />
  );
};

export default BlurOverlay;
