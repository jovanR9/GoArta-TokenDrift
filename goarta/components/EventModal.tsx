"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface EventData {
  id: number;
  title: string;
  date: string;
  places: string;
  description: string;
  image: string;
  alt: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ isOpen, onClose }: EventModalProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const eventCards: EventData[] = [
    {
      id: 1,
      title: "Carnival Parade",
      date: "February 22-25, 2025",
      places: "Panjim • Margao • Vasco • Mapusa",
      description: "A four-day spectacle of music, dance, and vibrant floats, celebrating Goa's Portuguese heritage and festive spirit.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Goa Carnival Parade with colorful floats, masks, and vibrant celebrations"
    },
    {
      id: 2,
      title: "Shigmo Festival",
      date: "March 15-20, 2025",
      places: "Panjim • Old Goa • Ponda",
      description: "Traditional spring festival featuring folk dances, colorful processions, and ancient rituals celebrating the harvest season.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Shigmo Festival with traditional folk dances and spring celebrations"
    },
    {
      id: 3,
      title: "Goa Food & Wine Festival",
      date: "April 10-15, 2025",
      places: "Panjim • Calangute • Margao",
      description: "Culinary extravaganza showcasing Goan delicacies, international cuisines, and the finest wines from around the world.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Goa Food Festival with delicious cuisines and wine tasting"
    },
    {
      id: 4,
      title: "Monsoon Music Festival",
      date: "July 5-10, 2025",
      places: "Panjim • Vagator • Anjuna",
      description: "Rain-soaked melodies featuring local bands, international artists, and the magical atmosphere of Goa's monsoon season.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Monsoon Music Festival with live performances and rain atmosphere"
    }
  ];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % eventCards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + eventCards.length) % eventCards.length);
  };

  const currentCard = eventCards[currentCardIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#0a0836] via-[#1a1a4a] to-[#0a0836] rounded-3xl p-8 max-w-4xl w-full text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </motion.button>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Content */}
              <div className="flex-1 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCard.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      {currentCard.title}
                    </h2>
                    
                    <div className="space-y-3">
                      <p className="text-xl text-gray-300">
                        <span className="text-orange-300 font-semibold">Date:</span> {currentCard.date}
                      </p>
                      <p className="text-xl text-gray-300">
                        <span className="text-yellow-300 font-semibold">Places:</span> {currentCard.places}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white">Description:</h3>
                      <p className="text-lg text-gray-300 leading-relaxed italic">
                        &ldquo;{currentCard.description}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    onClick={prevCard}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-colors duration-300"
                  >
                    ← Prev.
                  </motion.button>
                  
                  <motion.button
                    onClick={nextCard}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-colors duration-300"
                  >
                    Next →
                  </motion.button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative flex-shrink-0 w-64 h-64 lg:w-80 lg:h-80">
                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 shadow-xl"></div>
                <div className="absolute inset-2 rounded-xl overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentCard.id}
                      src={currentCard.image}
                      alt={currentCard.alt}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 