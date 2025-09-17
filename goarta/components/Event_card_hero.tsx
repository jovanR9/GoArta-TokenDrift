import React from "react";
import Image from "next/image";
import EventPageCardTag from "@/components/EventPageCardTag";

interface EventCardProps {
  title: string;
  image: string;
  status: string;
  categories: string[];
}

const EventCard: React.FC<EventCardProps> = ({ title, image, status, categories }) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
      {/* Background Image */}
      <div className="w-full h-[70vh]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Bottom Overlay Block */}
      <div className="absolute bottom-0 left-0 bg-white rounded-tr-2xl px-10 py-8 shadow-md w-2/3 flex flex-col">
        {/* Title */}
        <div>
          <h2 className="text-4xl font-playfair font-bold text-black">
            {title}
          </h2>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3 self-end">
          <EventPageCardTag
            label={status}
            innerColor={status === "Upcoming" ? "#00FF09" : "#FF1500"}
            outerColor={status === "Upcoming" ? "#398324" : "#710506"}
            textColor={status === "Upcoming" ? "#398324" : "#FFFFFF"}
          />
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

export default EventCard;