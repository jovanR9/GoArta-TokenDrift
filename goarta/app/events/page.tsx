"use client";

import React from "react";
import EventPageCard from "@/components/EventPageCard";

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Event Card Gallery</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {events.map((event, index) => (
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