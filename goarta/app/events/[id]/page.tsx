import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from "next/link";
import EventCard from "@/components/Event_card_hero";
import QuickActions from "@/components/QuickActions";
import About from "@/components/About";
import EventHighlights from "@/components/EventHighlights";
import EntryAndAccess from "@/components/EntryAndAccess";
import EventsNavbar from "@/components/EventsNavbar";
import EventPageCard from "@/components/EventPageCard";
import { supabase } from '@/lib/supabaseClient';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const EventDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  console.log('Fetching event with ID (slug):', id);

  const slugify = (text: string) => {
    return text.toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w-]+/g, '')       // Remove all non-word chars
      .replace(/--+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')            // Trim - from start of text
      .replace(/-+$/, '');           // Trim - from end of text
  };

  const { data: allEventsData, error: fetchAllError } = await supabase
    .from('new_events')
    .select('*');

  if (fetchAllError) {
    console.error('Error fetching all events:', fetchAllError.message);
    return <div>Error loading events.</div>;
  }

  const event = allEventsData?.find(e => slugify(e.title) === id);

  if (!event) {
    return <div>Event not found.</div>;
  }

  // Fetch all events for related events, excluding the current one
  const relatedEvents = allEventsData?.filter(e => e.id !== event.id) || [];

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
            <EventsNavbar />
          </div>
          <div className="max-w-6xl mx-auto">
            {/* Hero Section with EventCard */}
            <div className="flex justify-center">
              <EventCard 
                title={event.title}
                image={event.image_url}
                status={event.status}
                categories={event.categories}
              />
            </div>

            <div className="mt-8 flex justify-center">
              <QuickActions />
            </div>

            <div className="mt-8 flex justify-center">
              <About description={event.description} />
            </div>

            <div className="mt-8 flex justify-center">
              <EventHighlights 
                djLineup={event.dj_lineup}
                fireworksCountdown={event.fireworks_countdown}
                foodBeverageStalls={event.food_beverage_stalls}
              />
            </div>

            <div className="mt-8 flex justify-center">
              <EntryAndAccess 
                entryType={event.entry_type}
                ticketOptions={event.ticket_options}
              />
            </div>

            {/* Related Events Heading */}
            <div className="mt-8">
              <h3 className="text-4xl font-playfair font-bold mb-4">Related Events</h3>
            </div>

            {/* Horizontally Scrollable Event Cards */}
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {relatedEvents.map((relatedEvent) => (
                <div key={relatedEvent.id} className="flex-none w-80">
                  <EventPageCard
                    title={relatedEvent.title}
                    date={relatedEvent.date_range}
                    image={relatedEvent.image_url}
                    status={relatedEvent.status}
                    categories={relatedEvent.categories}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;