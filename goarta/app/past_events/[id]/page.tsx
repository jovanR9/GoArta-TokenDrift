import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  gallery: string[] | null;
  youtube_url: string | null;
}

interface EventPageProps {
  params: { id: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = params;

  // Fetch event data with type safety
  const { data, error } = await supabase
    .from("past_events")
    .select("id, title, description, date, location, gallery, youtube_link")
    .eq("id", id)
    .single();

  // Handle fetch errors
  if (error) {
    console.error("Error fetching event:", error.message);
    return (
      <div className="p-6 text-center text-red-500">
        Error fetching event. Please try again later.
      </div>
    );
  }

  // Handle case where no data is found
  if (!data) {
    return (
      <div className="p-6 text-center text-gray-500">
        Event not found. Check the event ID or try again.
      </div>
    );
  }
  const gallery: string[] = data.gallery || [];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Banner */}
        {gallery.length > 0 && (
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
            <Image
              src={gallery[0]}
              alt={data.title || "Event banner"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Two side images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {gallery[1] && (
            <div className="relative w-full h-[180px] md:h-[220px] rounded-lg overflow-hidden">
              <Image
                src={gallery[1]}
                alt="Event image 1"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
          {gallery[2] && (
            <div className="relative w-full h-[180px] md:h-[220px] rounded-lg overflow-hidden">
              <Image
                src={gallery[2]}
                alt="Event image 2"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>

        {/* About */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold">{data.title}</h2>
          {data.description
            ? data.description
              .split("\n")
              .filter((paragraph: string) => paragraph.trim())
              .map((paragraph: string, index: number) => (
                <p
                  key={index}
                  className="mt-4 text-gray-700 leading-relaxed text-justify"
                >
                  {paragraph}
                </p>
              ))
            : <p className="mt-4 text-gray-700 leading-relaxed text-justify">No description available.</p>}
        </div>

        {/* Date & Location */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between text-gray-900 font-medium">
          <div>
            <p className="uppercase text-sm">Date</p>
            <p>{data.date || "Not specified"}</p>
          </div>
          <div className="sm:text-right mt-2 sm:mt-0">
            <p className="uppercase text-sm">Location</p>
            <p>{data.location || "Not specified"}</p>
          </div>
        </div>

        {/* Gallery Carousel */}
        {gallery.length > 3 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Event Highlights
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.slice(3).map((img, index) => (
                <div
                  key={index}
                  className="relative w-full h-[200px] md:h-[250px] rounded-lg overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">
            Start your Journey with{" "}
            <span className="text-[#6D74FF]">GoArta</span>
            <br />
            so that you don’t miss such Events
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
                title={`${data.title} Video`}
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