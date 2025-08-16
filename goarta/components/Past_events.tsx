"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const PastEvents = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  // Past events data with category labels
  const pastEvents = [
    {
      id: 1,
      category: "FESTIVALS",
      headline: "Celebrate in style",
      description: "Immerse yourself in Goa's vibrant cultural tapestry through traditional celebrations and modern festivities.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Shigmo Festival with traditional folk dances and spring celebrations"
    },
    {
      id: 2,
      category: "CARNIVALS",
      headline: "Parade like a pro",
      description: "Experience the magic of colorful floats, vibrant costumes, and the infectious energy of Goa's carnival spirit.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Goa Carnival Parade with colorful floats, masks, and vibrant celebrations"
    },
    {
      id: 3,
      category: "CULTURE",
      headline: "Heritage feels great",
      description: "Discover ancient traditions, folk arts, and cultural performances that define Goa's rich heritage.",
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Diwali Festival with traditional lamps and celebrations"
    },
    {
      id: 4,
      category: "TRADITIONS",
      headline: "Roots run deep",
      description: "Experience authentic Goan traditions, rituals, and customs passed down through generations.",
      image: "https://images.unsplash.com/photo-1581600140680-d4b47b1f6770?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Holi Festival with colorful powders and celebrations"
    },
    {
      id: 5,
      category: "ARTS",
      headline: "Creativity flows",
      description: "Witness the artistic brilliance of local artisans, musicians, and performers showcasing their talents.",
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Ganesh Chaturthi with traditional idol and celebrations"
    },
    {
      id: 6,
      category: "CELEBRATIONS",
      headline: "Joy knows no bounds",
      description: "Join in the festivities, celebrations, and joyous moments that make Goa a paradise of happiness.",
      image: "https://images.unsplash.com/photo-1543589923-d58f523daa0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Christmas Market with festive decorations and stalls"
    }
  ];

  const scrollToLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full px-6 py-20 ">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.h2 
          className="text-5xl md:text-6xl font-bold text-black mb-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Past Cultural events:
        </motion.h2>

        {/* Scrollable Cards Container */}
        <div className="relative">
          {/* Left Navigation Arrow */}
          <motion.button
            onClick={scrollToLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white transition-all duration-300"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Right Navigation Arrow */}
          <motion.button
            onClick={scrollToRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white transition-all duration-300"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Cards Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-scroll scrollbar-hide px-20 py-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className={`flex-shrink-0 w-[450px] h-[550px] rounded-3xl shadow-md overflow-hidden group cursor-pointer relative ${
                  index === 2 ? 'bg-white' : 'bg-gray-900'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                onHoverStart={() => setIsHovered(event.id)}
                onHoverEnd={() => setIsHovered(null)}
              >
                {/* Image Section - Top Half */}
                <div className="relative h-1/2 overflow-hidden">
                  <motion.img
                    src={event.image}
                    alt={event.alt}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  {/* Category Label - Positioned on Image */}
                  <motion.div
                    className={`absolute top-4 left-4 inline-block px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg ${
                      index === 2 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-600 text-white'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  >
                    {event.category}
                  </motion.div>

                  {/* Subtle overlay for image section */}
                  <div className={`absolute inset-0 transition-all duration-500 ${
                    index === 2 
                      ? 'bg-gradient-to-t from-white/30 to-transparent' 
                      : 'bg-gradient-to-t from-black/30 to-transparent'
                  }`}></div>
                </div>

                {/* Text Section - Bottom Half */}
                <div className={`h-1/2 p-6 flex flex-col justify-between ${
                  index === 2 ? 'bg-white' : 'bg-gray-900'
                }`}>
                  {/* Content */}
                  <div>
                    {/* Headline */}
                    <motion.h3 
                      className={`text-2xl md:text-3xl font-bold mb-4 leading-tight ${
                        index === 2 ? 'text-gray-900' : 'text-white'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      {event.headline}
                    </motion.h3>

                    {/* Description */}
                    <motion.p 
                      className={`text-base leading-relaxed font-medium ${
                        index === 2 ? 'text-gray-700' : 'text-gray-300'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                    >
                      {event.description}
                    </motion.p>
                  </div>

                  {/* Bottom Section - Enhanced CTA */}
                  <motion.div
                    className="pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                  >
                    <div className="w-12 h-1 bg-purple-500 rounded-full shadow-lg"></div>
                    <p className={`text-sm font-medium mt-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300 ${
                      index === 2 ? 'text-purple-600' : 'text-purple-300'
                    }`}>
                      Explore more
                    </p>
                  </motion.div>
                </div>

                {/* Enhanced Hover Glow Effect */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl transition-opacity duration-700 pointer-events-none ${
                    index === 2 
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20' 
                      : 'bg-gradient-to-r from-purple-500/30 to-blue-500/30'
                  } opacity-0 group-hover:opacity-100`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered === event.id ? 1 : 0 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastEvents;
