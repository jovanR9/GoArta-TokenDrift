import Image from "next/image";

export default function Wave() {
    return (
        <section className="relative mt-32 sm:mt-40 lg:mt-64 px-4 sm:px-6 lg:">
            <div className="flex flex-col items-center">
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 text-center">
                    <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm sm:text-base hover:bg-blue-700 transition">
                        Explore upcoming festivals
                    </button>
                    <button className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold text-sm sm:text-base hover:bg-green-700 transition">
                        Build my itinerary
                    </button>
                </div>

                {/* Wave Image */}
                <div className="w-full max-w-[1400px]">
                    <Image
                        src="/wave.png"
                        alt="Wave decoration"
                        width={1400}
                        height={200}
                        className="w-full h-[200px]"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
