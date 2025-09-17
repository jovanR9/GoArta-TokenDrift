import React from "react";

interface EventCardProps {
  title: string;
  image: string;
  status: string;
  categories: string[];
}

const EventCard: React.FC<EventCardProps> = ({ title, image, status, categories }) => {
  // Determine status color
  const statusColor = status === "Upcoming" ? "bg-green-500" : "bg-red-500";

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-[60vh] object-cover"
      />

      {/* Bottom Overlay Block */}
      <div className="absolute bottom-0 left-0 bg-white rounded-tr-2xl px-10 py-8 shadow-md w-2/3 flex flex-col">
        {/* Title */}
        <div>
          <h2 className="text-4xl font-playfair font-bold text-black">
            {title}
          </h2>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-3 self-end">
          <span className={`px-3 py-1 text-xs font-semibold text-white ${statusColor} rounded-full`}>
            {status}
          </span>
          {categories.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-semibold text-white bg-purple-600 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCard;