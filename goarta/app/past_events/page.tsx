"use client";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/Filter"; // Updated import
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabaseClient } from "@/lib/supabaseClient";
import Modal from "@/components/Modal"; // Updated import

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  thumbnail: string;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "Not specified";
  const [year, month, day] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // Month is 0-indexed
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNum = date.getDate();
  const suffix = (dayNum % 10 === 1 && dayNum !== 11) ? "st" :
    (dayNum % 10 === 2 && dayNum !== 12) ? "nd" :
      (dayNum % 10 === 3 && dayNum !== 13) ? "rd" : "th";
  return `${dayNum}${suffix} ${months[date.getMonth()]} ${year}`;
};

export default function PastEvents() {
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    month: "",
    year: "",
    location: "",
    category: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabaseClient
        .from("past_events")
        .select("id, title, date, location, thumbnail");

      if (error) {
        console.error("Error fetching events:", error.message);
        setError("Failed to load past events. Please try again later.");
      } else {
        console.log("Fetched events:", data);
        let filteredData = data as Event[];
        if (filters.search || filters.month || filters.year || filters.location || filters.category) {
          filteredData = filteredData.filter((event) => {
            const formattedDate = formatDate(event.date).toLowerCase();
            const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
              event.location.toLowerCase().includes(filters.search.toLowerCase()) ||
              formattedDate.includes(filters.search.toLowerCase());
            const matchesMonth = !filters.month || formattedDate.includes(filters.month.toLowerCase());
            const matchesYear = !filters.year || event.date.includes(filters.year);
            const matchesLocation = !filters.location || event.location.toLowerCase() === filters.location.toLowerCase();
            const matchesCategory = !filters.category || event.title.toLowerCase().includes(filters.category.toLowerCase()); // Assuming category is in title for simplicity
            return matchesSearch && matchesMonth && matchesYear && matchesLocation && matchesCategory;
          });
        }
        setEventsData(filteredData);
      }
    };

    fetchEvents();
  }, [filters]);

  if (error) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center text-red-500">
          {error}
        </div>
      </section>
    );
  }

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const eventsToShow = eventsData.slice(0, 8);
  const hasMoreEvents = eventsData.length > 8;

  return (
    <>
      <div className="">
        <Navbar />
      </div>

      <div className="mt-16">
        <FilterBar
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />
      </div>

      <div className="w-full px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <motion.h2
            className="text-center text-2xl md:text-5xl font-bold text-black mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Past Cultural Events
          </motion.h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {eventsToShow.map((event, index) => (
              <motion.div
                key={event.id}
                className="rounded-3xl bg-white border border-blue-600 shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                onClick={() => openModal(event)}
                style={{ cursor: "pointer" }}
              >
                <div className="h-44 w-full overflow-hidden">
                  <motion.img
                    src={event.thumbnail || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                  <div className="mt-2 space-y-1 text-gray-700">
                    <p className="text-sm">Date : {formatDate(event.date)}</p>
                    <p className="text-sm">Location : {event.location}</p>
                  </div>

                  <div className="mt-5">
                    <div className="rounded-xl p-0.5 bg-gradient-to-r from-purple-300/40 to-indigo-300/40">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(event);
                        }}
                        className="w-full rounded-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 text-sm font-semibold shadow hover:from-indigo-600 hover:to-purple-600 transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        Read more <span aria-hidden>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More Events Button */}
          {hasMoreEvents && (
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  const nextEvent = eventsData[8]; // Get the next event after the first 8
                  openModal(nextEvent || { id: 0, title: "No More Events", date: "", location: "", thumbnail: "" });
                }}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
              >
                View More Events
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedEvent?.title}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="relative w-full h-64">
              <motion.img
                src={selectedEvent.thumbnail || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop"}
                alt={selectedEvent.title}
                className="w-full h-full object-cover rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p><strong>Date:</strong> {formatDate(selectedEvent.date)}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Description:</strong> No description available.</p>
          </div>
        )}
      </Modal>
    </>
  );
}