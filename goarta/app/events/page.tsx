"use client";

import React, { useState, useMemo, useEffect } from "react";
import EventsNavbar from "@/components/EventsNavbar";
import EventsHero from "@/components/EventsHero";
import EventPageCard from "@/components/EventPageCard";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";

type SupabaseEvent = {
  id: string;
  title: string;
  date_range: string;
  image_url: string;
  status: "Upcoming" | "Past";
  categories: string[];
  description?: string;
  dj_lineup?: Array<{ name: string; genre: string }>;
  fireworks_countdown?: Array<{ description: string }>;
  food_beverage_stalls?: Array<{ name: string; items: string }>;
  entry_type?: string;
  ticket_options?: Array<{ type: string; price: number; description: string }>;
};

export default function EventCardGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All events");
  const [events, setEvents] = useState<SupabaseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: SupabaseEvent[] = await response.json();
        setEvents(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (loading) return [];
    if (error) return [];

    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (filter === "Upcoming") {
        matchesFilter = event.status === "Upcoming";
      } else if (filter === "Past") {
        matchesFilter = event.status === "Past";
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter, events, loading, error]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading events...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div
        style={{
          background: 'linear-gradient(180deg, #85A8EE70 0%, #2AFF007D 100%)'
        }}
        className="w-full"
      >
        <EventsNavbar />
        <EventsHero />
      </div>
      <div className="flex-grow p-8">
        
        {/* Container to align search bar with cards */}
        <div className="max-w-6xl mx-auto">
          {/* Search and Filter Component - Left aligned */}
          <div className="mb-8">
            <SearchBar 
              onSearch={setSearchQuery} 
              onFilterChange={setFilter} 
            />
          </div>
          
          {/* Events Grid - 3 cards per row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div key={index} className="flex justify-center">
                <EventPageCard
                  title={event.title}
                  date={event.date_range}
                  image={event.image_url}
                  status={event.status}
                  categories={event.categories}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}