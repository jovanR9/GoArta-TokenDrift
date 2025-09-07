"use client";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/Filter";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { supabaseClient } from "@/lib/supabaseClient";
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
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    search: "",
    month: "",
    year: "",
    location: "",
    category: "",
  });

  useEffect(() => {
    console.log("useEffect running for PastEvents");
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("past_events")
          .select("id, title, event_date, location, thumbnail");

        console.log("Supabase response:", { data, error });

        if (error) {
          console.error("Supabase error:", error.message);
          setError(`Failed to load past events: ${error.message}`);
        } else if (data === null || data === undefined || !Array.isArray(data)) {
          console.warn("Invalid data returned from Supabase:", data);
          setError("No valid events found in the database.");
        } else {
          console.log("Fetched events:", data);
          setEventsData(data as Event[]);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred while fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleFilterChange = debounce((newFilters: typeof filters) => {
    console.log("Filters updated:", newFilters);
    setFilters(newFilters);
  }, 300);

  const filteredEvents = useMemo(() => {
    console.log("Applying filters:", filters);
    return eventsData.filter((event) => {
      const formattedDate = formatDate(event.event_date).toLowerCase();
      const matchesSearch = !filters.search ||
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        formattedDate.includes(filters.search.toLowerCase());
      const matchesMonth = !filters.month || formattedDate.includes(filters.month.toLowerCase());
      const matchesYear = !filters.year || event.event_date.includes(filters.year);
      const matchesLocation = !filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCategory = !filters.category || event.title.toLowerCase().includes(filters.category.toLowerCase());
      return matchesSearch && matchesMonth && matchesYear && matchesLocation && matchesCategory;
    });
  }, [eventsData, filters]);

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

  const eventsToShow = filteredEvents.slice(0, 8);
  const hasMoreEvents = filteredEvents.length > 8;

  return (
    <>
      <div className="">
        <Navbar />
      </div>

      <div className="mt-16">
        <FilterBar
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="w-full px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-center text-2xl md:text-5xl font-bold text-black mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Past Cultural Events
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {eventsToShow.length > 0 ? (
              eventsToShow.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="rounded-3xl bg-white border border-blue-600 shadow-md overflow-hidden"
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
              <div className="w-full text-center text-gray-500 col-span-full">
                No past events match the current filters.
              </div>
            )}
          </div>

          {hasMoreEvents && (
            <div className="mt-8 text-center">
              <Link
                href="/past_events/more"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
              >
                View More Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}