import Image from "next/image";

export default function Hero() {
    return (
        <>
        <section className="relative flex items-center justify-center py-12 px-4 mt-24">
            {/* Left Tree */}
            <div className="absolute left-0 top-[420px] -translate-y-1/2">
                <Image
                    src="/tree1.png"
                    alt="Tree Left"
                    width={220}   // 👈 change this width
                    height={700}  // 👈 change this height
                    className="w-[180px] md:w-[220px] lg:w-[398px] h-[700px]"
                    priority
                />
            </div>

            {/* Right Tree */}
            <div className="absolute right-0 top-[420px] -translate-y-1/2">
                <Image
                    src="/tree2.png"
                    alt="Tree Right"
                    width={220}
                    height={500}
                    className="w-[180px] md:w-[220px] lg:w-[360px] h-[690px] "
                    priority
                />
            </div>

            {/* Center Content */}
            <div className="text-center z-10">
                {/* Logo Text */}
                <Image
                    src="/GoArta_text.png"
                    alt="GoArta Logo"
                    width={600}   // 👈 change this width
                    height={300}  // 👈 change this height
                    className="mx-auto w-[300px] md:w-[500px] lg:w-[750px] h-auto"
                    priority
                />

                {/* Tagline */}
                <p className=" tagline mt-2 text-lg md:text-xl lg:text-5xl font-bold text-gray-800">
                    Discover Goa beyond the beaches
                </p>
            </div>
        </section>
</>
    );
}
