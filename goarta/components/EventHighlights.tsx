import React from "react";

const EventHighlights: React.FC = () => {
  return (
    <div className="w-full p-4 bg-white rounded-xl border border-black mt-8">
      <h3 className="text-2xl font-playfair font-bold mb-3">Event Highlights</h3>

      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-2">DJ Lineup</h4>
        <ul className="list-disc list-inside ml-4 text-gray-700">
          <li><span className="font-medium">DJ Aria</span> — Deep House & Techno</li>
          <li><span className="font-medium">DJ Kairo</span> — Bollywood Remix</li>
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-2">Fireworks Countdown</h4>
        <ul className="list-disc list-inside ml-4 text-gray-700">
          <li><span className="font-medium">Midnight Countdown:</span> 11:59 PM → Grand fireworks show at 12:00 AM</li>
          <li><span className="font-medium">Special Effects:</span> Synchronized lights + beachside fireworks display</li>
          <li><span className="font-medium">Duration:</span> ~15 minutes</li>
        </ul>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-2">Food & Beverage Stalls (On-Site)</h4>
        <ul className="list-disc list-inside ml-4 text-gray-700">
          <li><span className="font-medium">Goan Spice Corner</span> — Authentic Goan snacks (Xacuti rolls, Samosas)</li>
          <li><span className="font-medium">Beach Bites</span> — Grilled seafood & BBQ</li>
          <li><span className="font-medium">Sweet Bliss</span> — Desserts & pastries</li>
          <li><span className="font-medium">Chill Bar</span> — Cocktails, mocktails, and beer</li>
          <li><span className="font-medium">Café Midnight</span> — Coffee & quick bites</li>
        </ul>
      </div>
    </div>
  );
};

export default EventHighlights;