"use client";

import React, { useState, useMemo } from "react";
import EventPageCard from "@/components/EventPageCard";
import SearchBar from "@/components/SearchBar";

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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Event Card Gallery</h1>
      
      {/* Search and Filter Component */}
      <div className="flex justify-center mb-8">
        <SearchBar 
          onSearch={setSearchQuery} 
          onFilterChange={setFilter} 
        />
      </div>
      
      {/* Events Grid */}
      <div className="flex flex-wrap justify-center gap-8">
        {filteredEvents.map((event, index) => (
          <EventPageCard
            key={index}
            title={event.title}
            date={event.date}
            image={event.image}
            status={event.status}
            categories={event.categories}
          />
        ))}
      </div>
    </div>
  );
}