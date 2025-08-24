"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import EventModal from "./EventModal";

export default function EventCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="bg-gradient-to-br from-[#0a0836] via-[#1a1a4a] to-[#0a0836] rounded-3xl p-14 w-full text-white shadow-2xl flex flex-col lg:flex-row gap-14 relative overflow-hidden min-h-[700px] font-['DM_Sans']"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: isHovered
            ? "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)"
            : "radial-gradient(circle at 70% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)"
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Left Content */}
      <motion.div
        className="flex-1 space-y-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.h2
          className="text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent lg:text-[40px]"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          Upcoming Events:
        </motion.h2>

        <motion.p
          className="text-3xl text-gray-300 leading-relaxed lg:text-[20px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Immerse yourself in Goa&apos;s vibrant cultural tapestry through our curated calendar of extraordinary events. From traditional festivals celebrating our rich heritage to contemporary art exhibitions, food festivals, and live music performances that showcase the best of Goan culture.
        </motion.p>

        {/* Additional Event Information */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Event Categories */}
          <div className="space-y-6">
            <motion.h3
              className="text-3xl font-semibold text-orange-300 lg:text-[25px]"
              whileHover={{ scale: 1.05, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              Event Categories
            </motion.h3>
            <ul className="space-y-4 text-gray-300">
              <motion.li
                className="flex items-center gap-3 text-xl"
                whileHover={{ x: 15, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="w-3 h-3 bg-orange-400 rounded-full lg:text-[25px]"
                  whileHover={{ scale: 1.5, rotate: 180 }}
                  transition={{ duration: 0.4 }}
                ></motion.span>
                Traditional Festivals
              </motion.li>
              <motion.li
                className="flex items-center gap-3 text-xl"
                whileHover={{ x: 15, scale: 1.02 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.span
                  className="w-3 h-3 bg-yellow-400 rounded-full lg:text-[25px]"
                  whileHover={{ scale: 1.5, rotate: 180 }}
                  transition={{ duration: 0.4 }}
                ></motion.span>
                Art Exhibitions
              </motion.li>
              <motion.li
                className="flex items-center gap-3 text-xl"
                whileHover={{ x: 15, scale: 1.02 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.span
                  className="w-3 h-3 bg-orange-400 rounded-full lg:text-[25px]"
                  whileHover={{ scale: 1.5, rotate: 180 }}
                  transition={{ duration: 0.4 }}
                ></motion.span>
                Food & Wine Events
              </motion.li>
              <motion.li
                className="flex items-center gap-3 text-xl"
                whileHover={{ x: 15, scale: 1.02 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.span
                  className="w-3 h-3 bg-yellow-400 rounded-full lg:text-[25px]"
                  whileHover={{ scale: 1.5, rotate: 180 }}
                  transition={{ duration: 0.4 }}
                ></motion.span>
                Music & Dance Shows
              </motion.li>
            </ul>
          </div>
        </motion.div>

        {/* Enhanced Button with better animations */}
        <motion.button
          onClick={openModal}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(251, 146, 60, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          className="group relative bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 text-white px-16 py-6 rounded-2xl font-bold text-2xl shadow-lg overflow-hidden"
        >
          <motion.span
            className="relative z-10 lg:text-[20px]"
            initial={{ color: "#ffffff" }}
            whileHover={{ color: "#ffffff" }}
          >
            Catch a Glimpse
          </motion.span>

          {/* Button shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      </motion.div>

      {/* Right Image with enhanced animations and layered effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.6
        }}
        whileHover={{
          scale: 1.05,
          rotate: 2,
          transition: { duration: 0.3 }
        }}
        className="relative flex-shrink-0 w-[400px] h-[400px] lg:w-[650px] lg:h-[650px]"
      >
        {/* First layer - outer frame */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-4 border-white/20 shadow-2xl"
          animate={{
            boxShadow: isHovered
              ? "0 25px 50px rgba(255,255,255,0.2), 0 0 0 1px rgba(255,255,255,0.1)"
              : "0 15px 30px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.05)"
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Second layer - inner frame */}
        <motion.div
          className="absolute inset-2 rounded-2xl border-2 border-white/30 shadow-xl"
          animate={{
            boxShadow: isHovered
              ? "0 15px 30px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
              : "0 8px 16px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Image container */}
        <motion.div
          className="absolute inset-4 rounded-xl overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Goa Cultural Festival - Vibrant celebration with colorful decorations, traditional music, and joyful crowds"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            whileHover={{ scale: 1.1 }}
          />

          {/* Image overlay for better text contrast */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          />
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full"
          animate={{
            y: [0, 8, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </motion.div>

      {/* Event Modal */}
      <EventModal isOpen={isModalOpen} onClose={closeModal} />
    </motion.div>
  );
} 