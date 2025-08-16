"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react"; // Import useEffect

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
  const [eventCards, setEventCards] = useState<EventData[]>([]); // State for fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: EventData[] = await response.json();
        setEventCards(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) { // Fetch data only when modal is open
      fetchEventData();
    }
  }, [isOpen]); // Re-fetch when modal opens

  const nextCard = () => {
    if (eventCards.length === 0) return;
    setCurrentCardIndex((prev) => (prev + 1) % eventCards.length);
  };

  const prevCard = () => {
    if (eventCards.length === 0) return;
    setCurrentCardIndex((prev) => (prev - 1 + eventCards.length) % eventCards.length);
  };

  const currentCard = eventCards[currentCardIndex];

  if (loading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <p className="text-white text-xl">Loading events...</p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (error) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <p className="text-red-500 text-xl">Error: {error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (!currentCard) { // Handle case where data is fetched but currentCard is undefined (e.g., empty array)
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <p className="text-white text-xl">No events available.</p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

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