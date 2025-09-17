import React from "react";

const EntryAndAccess: React.FC = () => {
  return (
    <div className="w-full p-4 bg-[#F4EEFC] rounded-xl border border-black mt-8">
      <h3 className="text-2xl font-playfair font-bold mb-3">Entry and Access</h3>

      <div className="mb-4">
        <h4 className="text-xl font-semibold mb-2">Entry Type: <span className="font-normal">Paid event</span></h4>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-2">Ticket Options:</h4>
        <ul className="list-disc list-inside ml-4 text-gray-700">
          <li><span className="font-medium">General Pass</span> – ₹2000 🎶 Entry + Access to dance floor + 1 complimentary drink</li>
          <li><span className="font-medium">VIP Pass</span> – ₹5000 🥂 Exclusive lounge + Premium bar + Snacks + Priority seating</li>
        </ul>
      </div>
    </div>
  );
};

export default EntryAndAccess;