"use client";

import { IconArrowLeft, IconArrowRight, IconStarFilled, IconStar } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion"; // Changed from "motion/react" to "framer-motion"

import { useEffect, useState } from "react";
import Image from "next/image";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  rating?: number; // New property for rating
  companyLogo?: string; // Added company logo
};
export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imageRotations, setImageRotations] = useState<number[]>([]); // New state for image rotations

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    setMounted(true);
    // Generate random rotations for each image only on the client side
    setImageRotations(testimonials.map(() => Math.floor(Math.random() * 21) - 10));

    if (autoplay) {
      const interval = setInterval(handleNext, 3000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials, handleNext]); // Add testimonials to dependency array

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 font-sans antialiased md:max-w-7xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-[24rem] w-full md:h-[28rem] lg:h-[32rem]">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src + (mounted ? "mounted" : "server")} // Add key to force re-evaluation on client
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                    style={{ transform: `rotate(${imageRotations[index] || 0}deg)` }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-2xl font-bold text-black dark:text-white">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-neutral-500">
              {testimonials[active].designation}
            </p>
            {testimonials[active].companyLogo && (
              <Image
                src={testimonials[active].companyLogo}
                alt={`${testimonials[active].name}'s company logo`}
                width={48} // Assuming h-12 is 48px
                height={48} // Assuming h-12 is 48px
                className="h-12 w-auto mt-2" // Adjust size as needed
              />
            )}
            {/* Star Rating */}
            {testimonials[active].rating !== undefined && (
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < testimonials[active].rating! ? (
                      <IconStarFilled className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <IconStar className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    )}
                  </span>
                ))}
              </div>
            )}
            <motion.p className="mt-8 text-xl text-gray-500 dark:text-neutral-300">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <IconArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <IconArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
