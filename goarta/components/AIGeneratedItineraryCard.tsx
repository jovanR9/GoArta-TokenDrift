import Image from "next/image";

export default function AIGeneratedItineraryCard() {
  return (
    <div className="w-[95%] sm:h-[40rem] lg:h-[30rem] mx-auto bg-gradient-to-br from-[#F7F4F4] to-[#918F8F] rounded-3xl shadow-inner p-6 flex items-center justify-between gap-6"
         style={{
           boxShadow: "inset 0px 4px 4px rgba(0,0,0,0.25)",
           filter: "blur(0px)" // layer blur disabled for clarity
         }}
    >
      {/* Left Content */}
      <div className="flex-1 max-w-lg">
        <h2 className="text-3xl sm:text-4xl lg:text-7xl font-bold text-gray-900">
          AI-Generated Itinerary
        </h2>
        <p className="text-gray-800 mt-3 text-lg sm:text-xl lg:text-2xl leading-relaxed">
          Let our AI craft your perfect Goa experience — tailored to your interests, time, and vibe.
        </p>
        <button className="mt-6 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition transform hover:scale-105 text-base sm:text-lg lg:text-xl">
          Create my trip
        </button>
      </div>

      {/* Right Illustration */}
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/itinerary.png"
          alt="AI Generated Trip"
          width={500}
          height={500}
          className="max-h-80 sm:max-h-96 lg:max-h-[40rem] animate-slow-bounce"
        />
      </div>
    </div>
  );
}
