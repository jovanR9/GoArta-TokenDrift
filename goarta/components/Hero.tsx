import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 mt-12 sm:mt-16 md:mt-24">

            {/* Left Tree */}
            <div className="absolute left-0 top-[60%] sm:top-[30%] md:top-[220px] lg:top-[90%] -translate-y-1/2">
                <Image
                    src="/tree1.png"
                    alt="Tree Left"
                    width={398}
                    height={700}
                    className="
            w-[85px]  sm:w-[140px] md:w-[180px] lg:w-[318px] 
            h-[150px] sm:h-[450px] md:h-[300px] lg:h-[550px]
        "
                    priority
                />
            </div>

            {/* Right Tree */}
            <div className="absolute right-0 top-[55%] sm:top-[30%] md:top-[220px] lg:top-[90%] -translate-y-1/2">
                <Image
                    src="/tree2.png"
                    alt="Tree Right"
                    width={360}
               height={690}
                    className="
            w-[80px]  sm:w-[140px] md:w-auto lg:w-[280px]
            h-[160px] sm:h-[450px] md:h-[300px] lg:h-[550px]
        "
                    priority
                />
            </div>
            

            {/* Center Content */}
            <div className="text-center z-10">

                {/* Logo Text */}
                <Image
                    src="/GoArta_text.png"
                    alt="GoArta Logo"
                    width={750}
                    height={300}
                    className="
                        -mt-[41%] sm:-mt-8 md:-mt-6 lg:-mt-3
                        mx-auto 
                        w-[220px] sm:w-[250px] md:w-[425px] lg:w-[860px] 
                        h-[95px]               md:h-[190px]         lg:h-[350px]
                                                            
                    "
                    priority
                />

                {/* Tagline */}
                <p
                    className="
                    -mt-2 
                    text-[16px] sm:text-sm md:text-lg lg:text-[53px]
                                           md:text-[35px]          lg:-mt-12
                                           md:-mt-3 font-bold text-gray-800
                  "
                    style={{ fontFamily: 'Playfair Display' }}
                >
                    Discover Goa beyond the beaches
                </p>
            </div>
        </section>
    );
}
