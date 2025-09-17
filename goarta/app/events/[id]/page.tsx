import React from "react";
import EventCard from "@/components/Event_card_hero";
import QuickActions from "@/components/QuickActions";
import About from "@/components/About";

// Since this is a server component by default in App Router, we can make it async
const EventDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  // Unwrap the params Promise
  const { id } = await params;
  
  // Mock event data - in a real app, you would fetch this based on the ID
  // For now, I'll use data from the events page
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
  
  // Find the event that matches the ID (for demo purposes, we'll match by title)
  // In a real app, you would match by ID
  const event = events.find(e => e.title.toLowerCase().replace(/\s+/g, '-') === id) || events[1]; // Default to Goa Carnival if not found

  return (
    <div className="relative">
      <div
        className="fixed inset-0 bg-center z-0 bg-repeat"
        style={{
          backgroundImage: `url('/grid_bg.jpg')`,
          opacity: "0.4",
          backgroundSize: "30%"
        }}
      />
      <div
        className="fixed inset-0 bg-center z-0"
        style={{
          background: "linear-gradient(90deg, #FFFFFF, #F5F5F5, #E0E0E0)",
          opacity: "0.5",
        }}
      />

      {/* Content container */}
      <div className="relative z-10">
        <div className="min-h-screen p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section with EventCard */}
            <div className="flex justify-center">
              <EventCard 
                title={event.title}
                image={event.image}
                status={event.status}
                categories={event.categories}
              />
            </div>
            <div className="mt-8 flex justify-center">
              <QuickActions />
            </div>
            <div className="mt-8 flex justify-center">
              <About />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;