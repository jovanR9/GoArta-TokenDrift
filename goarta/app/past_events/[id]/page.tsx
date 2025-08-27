// app/past-events/[id]/page.tsx
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface EventPageProps {
  params: { id: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = params;

  // Fetch event data
  const { data, error } = await supabase
    .from("past_events")
    .select("id, title, description, date, location, gallery, youtube_url")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return <div className="p-6 text-red-500">Error fetching event.</div>;
  }

  if (!data) {
    return <div className="p-6">Event not found.</div>;
  }

  // gallery is stored as JSON array in Supabase
  const gallery: string[] = data.gallery || [];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Banner */}
        {gallery[0] && (
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
            <Image
              src={gallery[0]}
              alt={data.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Two side images */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {gallery[1] && (
            <div className="relative w-full h-[180px] md:h-[220px] rounded-lg overflow-hidden">
              <Image
                src={gallery[1]}
                alt="Event image"
                fill
                className="object-cover"
              />
            </div>
          )}
          {gallery[2] && (
            <div className="relative w-full h-[180px] md:h-[220px] rounded-lg overflow-hidden">
              <Image
                src={gallery[2]}
                alt="Event image"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* About */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold">{data.title}</h2>
          <p className="mt-4 text-gray-700 leading-relaxed text-justify">
            {data.description}
          </p>
        </div>

        {/* Date & Location */}
        <div className="mt-8 flex justify-between text-gray-900 font-medium">
          <div>
            <p className="uppercase text-sm">Date</p>
            <p>{data.date}</p>
          </div>
          <div className="text-right">
            <p className="uppercase text-sm">Location</p>
            <p>{data.location}</p>
          </div>
        </div>

        {/* Gallery Carousel */}
        {gallery.length > 3 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Event Highlights
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.slice(3).map((img, index) => (
                <div
                  key={index}
                  className="relative w-full h-[200px] md:h-[250px] rounded-lg overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`Gallery ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">
            Start your Journey with <span className="text-[#6D74FF]">GoArta</span> <br />
            so that you don’t miss such Events
          </h3>
        </div>

        {/* YouTube */}
        {data.youtube_url && (
          <div className="mt-8">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={data.youtube_url.replace("watch?v=", "embed/")}
                title="Event Video"
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
