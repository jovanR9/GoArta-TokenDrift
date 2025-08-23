"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);
    const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=2900", // longer scroll for smoother animation
                    scrub: true,
                    pin: true,
                },
            });

            // Move text out to left
            tl.to(textRef.current, { x: "-100vw", opacity: 0, duration: 2 });

            // Images: enter from right → scale up → move left
            imagesRef.current.forEach((img, i) => {
                tl.fromTo(
                    img,
                    { x: "100vw", opacity: 0, scale: 0.5 }, // start small
                    { x: "-60vw", opacity: 1, scale: 1, duration: 5 }, // grow to normal
                    i * 1.5 // stagger
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="h-screen bg-gray-100 flex items-center justify-center overflow-hidden relative"
        >
            {/* Text */}
            <div
                ref={textRef}
                className="text-5xl font-bold absolute text-center"
            >
                Your gateway to exploring Goa seamlessly.🚀
            </div>

            {/* Images container */}
            <div className="flex gap-8">
                {[
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjdAPwQ2WqobrFx02TzvxJnDV1yZ5hZi5bTA&s",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjdAPwQ2WqobrFx02TzvxJnDV1yZ5hZi5bTA&s",
                    "/img3.jpg",
                    "/img4.jpg",
                ].map((src, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            imagesRef.current[i] = el;
                        }}
                        className="w-64 h-60 opacity-0 lg:w-[1000px] lg:h-[500px]"
                    >
                        <Image
                            src={src}
                            alt={`Image ${i + 1}`}
                            width={256}
                            height={256}
                            className="w-full h-full object-cover rounded-xl shadow-lg lg:w-[900px]
                                                                         lg:h-[500px]   "
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
