import Image from "next/image";

export default function Wave() {
    return (
        <section className="relative mt-16 sm:mt-24 md:mt-32 lg:mt-52">
            <div className="relative w-full">
                {/* Wave Image */}
                <Image
                    src="/wave.png"
                    alt="Wave background"
                    width={1400}
                    height={300}
                    className="w-full h-28 sm:h-40 md:h-56 lg:h-64"
                    priority
                />

                <div className="absolute inset-0 flex justify-center items-center px-4
                                -translate-y-4 sm:-translate-y-6 md:-translate-y-8 lg:-translate-y-9">
                    <div className="flex flex-row gap-4 sm:gap-6 text-center">
                        <button className="
  px-2 py-1 sm:px-6 sm:py-3 md:px-8 md:py-4 
  rounded-sm bg-green-600 text-white font-semibold 
  text-[11px] sm:text-[14px] md:text-[18px] 
  hover:bg-green-700 transition
">
                            Explore upcoming festivals
                        </button>

                        <button className="
  px-2 py-1 sm:px-6 sm:py-3 md:px-8 md:py-4 
  rounded-sm bg-gradient-to-r from-purple-700 to-pink-600 
  text-white font-semibold 
  text-[11px] sm:text-[14px] md:text-[18px] 
  hover:opacity-90 transition
">
                            Build my itinerary
                        </button>

                    </div>



                </div>
            </div>
        </section>
    );
}
