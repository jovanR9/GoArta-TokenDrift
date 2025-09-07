"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabaseClient } from "@/app/api/supabaselogin/supabase";
import Link from "next/link";

type Event = {
  id: number;
  title: string;
  event_date: string;
  location: string;
  thumbnail: string;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "Not specified";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return "Invalid date";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("useEffect running");
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("past_events")
          .select("id, title, event_date, location, thumbnail");

        if (error) {
          console.error("Supabase error:", error.message);
          setError("Failed to load past events. Please try again later.");
        } else if (!Array.isArray(data)) {
          console.error("Data is not an array:", data);
          setError("Invalid data format received.");
        } else {
          console.log("Fetched events:", data);
          setEventsData(data as Event[]);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          Loading events...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center text-red-500">
          {error}
        </div>
      </section>
    );
  }

  const scrollBy = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    } else {
      console.warn("Scroll container ref is not available");
    }
  };

  return (
    <div key="past-events" className="w-full px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-center text-2xl md:text-5xl font-bold text-black mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Past Cultural Events
        </motion.h2>

        <div className="relative">
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
            {eventsData.length > 0 ? (
              eventsData.map((event, index) => (
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
                      src={event.thumbnail || "/placeholder-event.jpg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    <div className="mt-2 space-y-1 text-gray-700">
                      <p className="text-sm">Date: {formatDate(event.event_date)}</p>
                      <p className="text-sm">Location: {event.location}</p>
                    </div>

                    <div className="mt-5">
                      <div className="rounded-xl p-0.5 bg-gradient-to-r from-purple-300/40 to-indigo-300/40">
                        <Link
                          href={`/past_events/${event.id}`}
                          className="w-full rounded-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 text-sm font-semibold shadow hover:from-indigo-600 hover:to-purple-600 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          Read more <span aria-hidden>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="w-full text-center text-gray-500">
                No past events available.
              </div>
            )}
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
}