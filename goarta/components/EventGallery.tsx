"use client";

import Image from "next/image";

interface EventGalleryProps {
  gallery: string[];
  title: string;
}

export default function EventGallery({ gallery, title }: EventGalleryProps) {
  return (
    <>
      {/* Banner */}
      {gallery.length > 0 && (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
          <Image
            src={gallery[0]}
            alt={title || "Event banner"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => (e.currentTarget.style.display = "none")} // Handled client-side
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
              onError={(e) => (e.currentTarget.style.display = "none")}
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
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
      </div>

      {/* Gallery Carousel */}
      {gallery.length > 3 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">Event Highlights</h2>
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
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}