import Image from "next/image";

export default function Hero() {
    return (
        <>
        <section className="relative flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 mt-12 sm:mt-16 md:mt-24">
            {/* Left Tree */}
            <div className="absolute left-0 top-[20%] sm:top-[30%] md:top-[420px] -translate-y-1/2">
                <Image
                    src="/tree1.png"
                    alt="Tree Left"
                    width={398} // Intrinsic size for aspect ratio
                    height={700}
                    className="w-[100px] sm:w-[140px] md:w-[180px] lg:w-[318px] h-[550px]"
                    priority
                />
            </div>

            {/* Right Tree */}
            <div className="absolute right-0 top-[20%] sm:top-[30%] md:top-[420px] -translate-y-1/2">
                <Image
                    src="/tree2.png"
                    alt="Tree Right"
                    width={360}
                    height={690}
                    className="w-[100px] sm:w-[140px] md:w-[180px] lg:w-[300px] h-[550px]"
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
                    className="-mt-10 mx-auto w-[150px] sm:w-[250px] md:w-[500px] lg:w-[920px] h-[400px]"
                    priority
                />

                {/* Tagline */}
                <p className=" mt-2 text-sm sm:text-base md:text-lg lg:text-6xl font-bold text-gray-800"
                style={{fontFamily:'Playfair Display'}}>
                    Discover Goa beyond the beaches
                    
                </p>
            </div>
        </section>
        </>
    );
}