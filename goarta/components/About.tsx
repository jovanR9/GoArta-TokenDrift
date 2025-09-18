import React from "react";

interface AboutProps {
  description?: string;
}

const About: React.FC<AboutProps> = ({ description }) => {
  return (
    <div className="w-full p-4 bg-white rounded-xl border border-black mt-8">
      <h3 className="text-2xl font-playfair font-bold mb-3">About this Event</h3>
      <p className="text-gray-700">
        {description || "No description available for this event."}
      </p>
    </div>
  );
};

export default About;