"use client";

import React from "react";

interface EventPageCardTagProps {
  label: string;
  innerColor?: string; // Default center color
  outerColor?: string; // Default border color
  textColor?: string; // Text color
}

const EventPageCardTag: React.FC<EventPageCardTagProps> = ({
  label,
  innerColor = "#DD00FF",
  outerColor = "#570065",
  textColor, // Added textColor prop
}) => {
  // Default text color is white unless specified
  const calculatedTextColor = textColor || "#FFFFFF";
  
  return (
    <div className="flex items-center justify-center">
      <div
        className="relative px-4 py-2 flex items-center justify-center font-bold text-sm"
        style={{
          background: `radial-gradient(circle, ${innerColor} 40%, ${outerColor} 100%)`,
          borderRadius: "12px", // Slightly higher corner radius
          boxShadow: `0 0 12px ${outerColor}`,
          color: calculatedTextColor, // Apply text color
          fontFamily: 'Inter, sans-serif', // Use Inter font
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default EventPageCardTag;