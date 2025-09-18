import React from "react";

interface EventHighlightsProps {
  djLineup?: Array<{ name: string; genre: string }>;
  fireworksCountdown?: Array<{ description: string }>;
  foodBeverageStalls?: Array<{ name: string; items: string }>;
}

const EventHighlights: React.FC<EventHighlightsProps> = ({
  djLineup,
  fireworksCountdown,
  foodBeverageStalls,
}) => {
  return (
    <div className="w-full p-4 bg-[#FFF7E6] rounded-xl border border-black mt-8">
      <h3 className="text-2xl font-playfair font-bold mb-3">Event Highlights</h3>

      {djLineup && djLineup.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-2">DJ Lineup</h4>
          <ul className="list-disc list-inside ml-4 text-gray-700">
            {djLineup.map((dj, index) => (
              <li key={index}><span className="font-medium">{dj.name}</span> — {dj.genre}</li>
            ))}
          </ul>
        </div>
      )}

      {fireworksCountdown && fireworksCountdown.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-2">Fireworks Countdown</h4>
          <ul className="list-disc list-inside ml-4 text-gray-700">
            {fireworksCountdown.map((item, index) => (
              <li key={index}><span className="font-medium">{item.description.split(':')[0]}:</span> {item.description.split(':').slice(1).join(':')}</li>
            ))}
          </ul>
        </div>
      )}

      {foodBeverageStalls && foodBeverageStalls.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold mb-2">Food & Beverage Stalls (On-Site)</h4>
          <ul className="list-disc list-inside ml-4 text-gray-700">
            {foodBeverageStalls.map((stall, index) => (
              <li key={index}><span className="font-medium">{stall.name}</span> — {stall.items}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventHighlights;