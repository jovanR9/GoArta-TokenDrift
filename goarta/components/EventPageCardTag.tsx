"use client";

import React from "react";

interface EventPageCardTagProps {
  label: string;
  innerColor?: string; // Default center color
  outerColor?: string; // Default border color
  textColor?: string;  // Text color
}

const EventPageCardTag: React.FC<EventPageCardTagProps> = ({
  label,
  innerColor = "#DD00FF",
  outerColor = "#570065",
  textColor,
}) => {
  const calculatedTextColor = textColor || "#FFFFFF";

  return (
    <div className="flex flex-wrap gap-2 justify-center"> {/* wrapper allows multiple tags in a row */}
      <div
        className="-ml-1 relative px-2 py-1 flex items-center justify-center font-bold text-xs sm:px-3 sm:py-1.5 sm:text-sm rounded-lg"
        style={{
          background: `radial-gradient(circle, ${innerColor} 40%, ${outerColor} 100%)`,
          boxShadow: `0 0 8px ${outerColor}`,
          color: calculatedTextColor,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default EventPageCardTag;
