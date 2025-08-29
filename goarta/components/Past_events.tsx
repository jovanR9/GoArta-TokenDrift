"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setEventsData(data as Event[]);
      }
    };

    fetchEvents();
  }, []);

  if (error) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center text-red-500">
          {error}
        </div>
      </section>
    );
  }

  // const scrollToLeft = () => {
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
  //   }
  // };

  // const scrollToRight = () => {
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
  //   }
  // };

  return (
    <div className="w-full px-6 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-2xl md:text-2xl lg:text-4xl font-bold text-black mb-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Past Cultural Events
        </motion.h2>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide px-20 py-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {eventsData.map((event, index) => (
              <motion.div
                key={event.id}
                className={`flex-shrink-0 w-[350px] h-[450px] rounded-3xl shadow-2xl overflow-hidden group cursor-pointer relative ${index % 2 === 0 ? "bg-gray-900" : "bg-white"
                  }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                onHoverStart={() => setIsHovered(event.id)}
                onHoverEnd={() => setIsHovered(null)}
              >
                <div className="relative h-1/2 overflow-hidden">
                  <motion.img
                    src={event.thumbnail || "/placeholder.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${index % 2 === 0
                      ? "bg-gradient-to-t from-black/30 to-transparent"
                      : "bg-gradient-to-t from-white/30 to-transparent"
                      }`}
                  ></div>
                </div>

                <div
                  className={`h-1/2 p-6 flex flex-col justify-between ${index % 2 === 0 ? "bg-gray-900" : "bg-white"
                    }`}
                >
                  <div>
                    <motion.h3
                      className={`text-center text-2xl md:text-3xl lg:text-2xl font-bold mb-4 leading-tight ${index % 2 === 0 ? "text-white" : "text-gray-900"
                        }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      {event.title}
                    </motion.h3>
                    <motion.p
                      className={`lg:text-[16px] text-center text-base leading-relaxed font-medium ${index % 2 === 0 ? "text-gray-300" : "text-gray-700"
                        }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                    >
                      <b>Date:</b> {formatDate(event.date)} <br />
                      <b>Location:</b> {event.location}
                    </motion.p>
                  </div>
                  <motion.div
                    className="pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                  >
                    <div className="w-12 h-1 bg-purple-500 rounded-full shadow-lg"></div>
                    <Link
                      href={`/past_events/${event.id}`}
                      className={`text-sm font-medium mt-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300 ${index % 2 === 0 ? "text-purple-300" : "text-purple-600"
                        }`}
                    >
                      Read More
                    </Link>
                  </motion.div>
                </div>

                <motion.div
                  className={`absolute inset-0 rounded-3xl transition-opacity duration-700 pointer-events-none ${index % 2 === 0
                    ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30"
                    : "bg-gradient-to-r from-purple-500/20 to-blue-500/20"
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
}