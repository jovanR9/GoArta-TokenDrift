import React from "react";

const QuickActions: React.FC = () => {
  return (
    <div className="inline-block border border-black rounded-xl p-4 bg-white">
      {/* Heading */}
      <h3 className="text-lg font-bold mb-3">Quick actions</h3>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Book tickets */}
        <button className="px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold w-full">
          Book tickets
        </button>

        {/* Plan with AI Itinerary */}
        <button className="px-4 py-2 rounded-lg bg-purple-400 text-white font-semibold w-full">
          Plan with AI Itinerary
        </button>

        {/* Share event */}
        <button className="px-4 py-2 rounded-lg bg-green-700 text-white font-semibold w-full">
          Share event
        </button>

        {/* Add to calendar */}
        <button className="px-4 py-2 rounded-lg border-2 border-sky-400 text-sky-500 font-semibold w-full">
          + Add to calendar
        </button>
      </div>
    </div>
  );
};

export default QuickActions;