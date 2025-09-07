import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import EventGallery from "@/components/EventGallery";
import { supabaseClient } from "@/lib/supabaseClient"; // Use the same client as PastEvents

// Shared formatDate function to match PastEvents
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

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Validate id
  const eventId = parseInt(id);
  if (isNaN(eventId)) {
    console.error("Invalid event ID:", id);
    return (
      <div className="p-6 text-center text-red-500">
        Invalid event ID.
      </div>
    );
  }

  // Fetch event data
  const { data, error } = await supabaseClient
    .from("past_events")
    .select("id, title, description, event_date, location, gallery, youtube_link")
    .eq("id", eventId)
    .single();

  console.log("Supabase response for event:", { data, error });

  // Handle fetch errors
  if (error) {
    console.error("Error fetching event:", error.message);
    return (
      <div className="p-6 text-center text-red-500">
        Error fetching event: {error.message}
      </div>
    );
  }

  // Handle case where no data is found
  if (!data) {
    console.warn("No event found for ID:", eventId);
    return (
      <div className="p-6 text-center text-gray-500">
        Event not found. Check the event ID or try again.
      </div>
    );
  }

  const gallery: string[] = Array.isArray(data.gallery) ? data.gallery : [];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Gallery Section */}
        <EventGallery gallery={gallery} title={data.title ?? "Untitled Event"} />

        {/* About */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold">{data.title ?? "Untitled Event"}</h2>
          {data.description ? (
            data.description
              .split("\n")
              .filter((paragraph) => paragraph.trim())
              .map((paragraph, index) => (
                <p
                  key={index}
                  className="mt-4 text-gray-700 leading-relaxed text-justify"
                >
                  {paragraph}
                </p>
              ))
          ) : (
            <p className="mt-4 text-gray-700 leading-relaxed text-justify">
              No description available.
            </p>
          )}
        </div>

        {/* Date & Location */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between text-gray-900 font-medium">
          <div>
            <p className="uppercase text-sm">Date</p>
            <p>{formatDate(data.event_date)}</p>
          </div>
          <div className="sm:text-right mt-2 sm:mt-0">
            <p className="uppercase text-sm">Location</p>
            <p>{data.location ?? "Not specified"}</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">
            Start your Journey with{" "}
            <span className="text-[#6D74FF]">GoArta</span>
            <br />
            so that you don&apos;t miss such Events
          </h3>
          <Link
            href="/past_events"
            className="mt-4 inline-block px-6 py-2 rounded-[10px] text-white font-medium bg-gradient-to-r from-[#6D74FF] to-[#414699] hover:opacity-90 transition"
          >
            Back to Events
          </Link>
        </div>

        {/* YouTube */}
        {data.youtube_link && (
          <div className="mt-8">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={data.youtube_link.replace("watch?v=", "embed/")}
                title={`${data.title ?? "Event"} Video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const { data, error } = await supabaseClient
    .from("past_events")
    .select("id");

  if (error) {
    console.error("Error fetching event IDs for static params:", error.message);
    return [];
  }

  if (!data || !Array.isArray(data)) {
    console.warn("No valid event IDs returned:", data);
    return [];
  }

  console.log("Static params generated:", data);
  return data.map((event) => ({ id: event.id.toString() }));
}