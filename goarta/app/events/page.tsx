"use client";

import React, { useState, useMemo } from "react";
import EventsHeader from "@/components/EventsHeader";
import EventPageCard from "@/components/EventPageCard";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";

export default function EventCardGallery() {
  const events = [
    {
      title: "SHIGMO",
      date: "10 - 12 FEB 2025",
      image: "https://www.tusktravel.com/blog/wp-content/uploads/2025/03/Shigmo-Festival-Goa.jpg",
      status: "Past",
      categories: ["Festival"]
    },
    {
      title: "Goa Carnival",
      date: "20 - 22 DEC 2024",
      image: "https://www.tusktravel.com/blog/wp-content/uploads/2025/03/Shigmo-Festival-Goa.jpg",
      status: "Upcoming",
      categories: ["Carnival", "Parade"]
    },
    {
      title: "Sunburn Festival",
      date: "5 - 7 JAN 2025",
      image: "https://www.tusktravel.com/blog/wp-content/uploads/2025/03/Shigmo-Festival-Goa.jpg",
      status: "Upcoming",
      categories: ["Music", "EDM"]
    },
    {
      title: "Tropical Beats",
      date: "15 - 16 NOV 2024",
      image: "https://www.tusktravel.com/blog/wp-content/uploads/2025/03/Shigmo-Festival-Goa.jpg",
      status: "Past",
      categories: ["Music", "Beach"]
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All events");

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Apply search filter
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply status filter
      let matchesFilter = true;
      if (filter === "Upcoming") {
        matchesFilter = event.status === "Upcoming";
      } else if (filter === "Past") {
        matchesFilter = event.status === "Past";
      }
      // For "All events" and "Online", we show all events (you can modify "Online" logic as needed)
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <EventsHeader />
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
                  date={event.date}
                  image={event.image}
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