"use client";
import Image from "next/image";

export default function Past_Events() {
  return (
    <div className="min-h-screen bg-white text-black flex justify-center py-8">
      <div className="w-full max-w-4xl px-4">
        {/* Banner Image */}
        <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative rounded-lg overflow-hidden">
          <Image
            src="/saojoa_main.jpg"
            alt="Sao Jao Festival"
            fill
            className="object-cover"
          />
        </div>

        {/* Two Smaller Images */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="relative w-full h-[180px] md:h-[220px] rounded-lg overflow-hidden">
            <Image
              src="/saojoa_1.jpg"
              alt="Sao Jao Celebration"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-[180px] md:h-[220px] rounded-lg overflow-hidden">
            <Image
              src="/saojoa_2.jpg"
              alt="Sao Jao Celebration"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6">
          <h2 className="text-center text-xl font-bold">About Sao Jao</h2>
          <p className="mt-4 text-justify text-gray-800 leading-relaxed">
            The feast of São João is a celebration of the{" "}
            <span className="underline">birth anniversary of Saint John the Baptist</span>.
            Saint John was the son of Saint Elizabeth, a relative of{" "}
            <span className="underline">Mary, mother of Jesus</span>. One day,
            when Mary visited Elizabeth, the baby Saint John 'leapt' in her womb
            upon hearing Mary’s greeting (<span className="underline">Luke 1:44</span>).
            When Jesus was thirty years old, he was baptised by Saint John in the{" "}
            <span className="underline">Jordan River</span>.
          </p>
        </div>

        {/* Date & Location */}
        <div className="mt-8 flex justify-between text-gray-900 font-medium">
          <div>
            <p className="uppercase text-sm">Date</p>
            <p>8-08-25</p>
          </div>
          <div className="text-right">
            <p className="uppercase text-sm">Location</p>
            <p>Fatorda, Goa Margao</p>
          </div>
        </div>
      </div>
    </div>
  );
}
