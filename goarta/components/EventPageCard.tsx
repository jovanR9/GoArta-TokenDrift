"use client";

import React from "react";
import Image from "next/image";
import EventPageCardTag from "@/components/EventPageCardTag";

interface EventPageCardProps {
  title: string;
  date: string;
  image: string;
  status: "Upcoming" | "Past";
  categories: string[]; // e.g. ["Festival", "Concert"]
}

const EventPageCard: React.FC<EventPageCardProps> = ({
  title,
  date,
  image,
  status,
  categories,
}) => {
  return (
    <div className="relative w-80 h-[360px] rounded-2xl overflow-hidden shadow-lg">
      {/* Event image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {/* Darker half-card shadow overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/70 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-white text-lg font-bold drop-shadow" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{title}</h3>
        <p className="text-white text-lg font-bold mb-3 drop-shadow" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{date}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {/* Status */}
          <EventPageCardTag 
            label={status} 
            innerColor={status === "Upcoming" ? "#00FF09" : "#FF1500"} 
            outerColor={status === "Upcoming" ? "#398324" : "#710506"} 
            textColor={status === "Upcoming" ? "#398324" : "#FFFFFF"} 
          />

          {/* Categories */}
          {categories.map((cat, i) => (
            <EventPageCardTag 
              key={i} 
              label={cat} 
              innerColor="#DD00FF" 
              outerColor="#570065" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventPageCard;