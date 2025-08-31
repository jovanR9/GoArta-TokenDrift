"use client";
import { motion } from "framer-motion";
import { useRef } from "react";

const PastEvents = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const pastEvents = [
    {
      id: 1,
      title: "Shigmo Festival",
      date: "18 March 2025",
      location: "Panaji",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      alt: "Shigmo Festival with traditional folk dances and spring celebrations",
    },
    {
      id: 2,
      title: "Shigmo Festival",
      date: "18 March 2025",
      location: "Panaji",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      alt: "Shigmo Festival with traditional folk dances and spring celebrations",
    },
    {
      id: 3,
      title: "Shigmo Festival",
      date: "18 March 2025",
      location: "Panaji",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      alt: "Shigmo Festival with traditional folk dances and spring celebrations",
    },
    {
      id: 4,
      title: "Shigmo Festival",
      date: "18 March 2025",
      location: "Panaji",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      alt: "Shigmo Festival with traditional folk dances and spring celebrations",
    },
    {
      id: 5,
      title: "Shigmo Festival",
      date: "18 March 2025",
      location: "Panaji",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      alt: "Shigmo Festival with traditional folk dances and spring celebrations",
    },
    {
      id: 6,
      title: "Shigmo Festival",
      date: "18 March 2025",
      location: "Panaji",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      alt: "Shigmo Festival with traditional folk dances and spring celebrations",
    },
  ];

  const scrollBy = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full px-6 py-20 ">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-black mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Past Cultural events:
        </motion.h2>

        {/* Cards Container */}
        <div className="relative">
          {/* Optional arrows for desktop navigation */}
          <motion.button
            onClick={() => scrollBy(-400)}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-600 items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white transition-all duration-300"
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={() => scrollBy(400)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-600 items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white transition-all duration-300"
            whileHover={{ scale: 1.05, x: 4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide px-2 py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="flex-shrink-0 w-[320px] rounded-3xl bg-white border border-blue-600 shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                <div className="h-44 w-full overflow-hidden">
                  <motion.img
                    src={event.image}
                    alt={event.alt}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                  <div className="mt-2 space-y-1 text-gray-700">
                    <p className="text-sm">Date : {event.date}</p>
                    <p className="text-sm">Location : {event.location}</p>
                  </div>

                  <div className="mt-5">
                    <div className="rounded-xl p-0.5 bg-gradient-to-r from-purple-300/40 to-indigo-300/40">
                      <button
                        className="w-full rounded-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 text-sm font-semibold shadow hover:from-indigo-600 hover:to-purple-600 transition-colors duration-200 flex items-center justify-center gap-2"
                        type="button"
                      >
                        Read more <span aria-hidden>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="px-4 py-1 text-gray-600 text-sm bg-gray-100 rounded-full border border-blue-600">
            Swipe left to see more
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastEvents;
