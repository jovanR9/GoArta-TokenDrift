import React, { useEffect, useRef } from 'react';

interface MusicNoteProps {
  onAnimationComplete: () => void;
}

const MusicNote: React.FC<MusicNoteProps> = ({ onAnimationComplete }) => {
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const note = noteRef.current;
    if (!note) return;

    // Random starting position near the cursor
    const startX = Math.random() * 20 - 10; // -10 to 10 pixels
    const startY = 0;
    
    // Random movement parameters
    const amplitude = 10 + Math.random() * 10; // 10-20 pixels
    const frequency = 0.02 + Math.random() * 0.03; // 0.02-0.05
    const speed = 1 + Math.random() * 2; // 1-3 pixels per frame
    const rotation = Math.random() * 360; // Random initial rotation
    
    let posY = startY;
    let frame = 0;
    let opacity = 1;
    
    const animate = () => {
      if (!note) return;
      
      // Move upward
      posY -= speed;
      
      // Horizontal sway
      const posX = startX + amplitude * Math.sin(frame * frequency);
      
      // Fade out as it moves up
      opacity = Math.max(0, 1 - Math.abs(posY) / 100);
      
      // Apply transformations
      note.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotation + frame * 2}deg)`;
      note.style.opacity = opacity.toString();
      
      frame++;
      
      // Continue animation or clean up
      if (opacity > 0 && posY > -100) {
        requestAnimationFrame(animate);
      } else {
        onAnimationComplete();
      }
    };
    
    requestAnimationFrame(animate);
  }, [onAnimationComplete]);

  return (
    <div
      ref={noteRef}
      className="absolute pointer-events-none text-2xl select-none"
      style={{ 
        left: 0, 
        top: 0,
        zIndex: 1000,
        transform: 'translate(0, 0)',
        opacity: 1
      }}
    >
      ♪
    </div>
  );
};

export default MusicNote;