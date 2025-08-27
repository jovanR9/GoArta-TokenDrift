"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  thumbnail: string;
};

export default function PastEvents() {
  const [eventsData, setEventsData] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabaseClient
        .from("past_events")
        .select("id, title, date, location, thumbnail");

      if (error) {
        console.error("Error fetching events:", error.message);
      } else {
        console.log("Fetched events:", data);
        setEventsData(data as Event[]);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Past Events
        </h2>

        <Swiper
          spaceBetween={20}
          // breakpoints={{
          //   320: { slidesPerView: 1 },
          //   640: { slidesPerView: 2 },
          //   1024: { slidesPerView: 3 },
          // }}
        >
          {eventsData.map((event) => (
            <SwiperSlide key={event.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-2 py-2 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-[#6D74FF] 
             w-full sm:w-[20rem] md:w-[24rem] lg:w-[24rem]"
              >
                <img
                  src={event.thumbnail || "/placeholder.jpg"}
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-6 flex flex-col flex-grow text-center">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm mb-2 lg:text-[20px]">📅 {event.date}</p>
                  <p className="text-sm mb-4 lg:text-[20px]">
                    📍 {event.location}
                  </p>

                  <Link href={`/past_event/${event.id}`} className="mt-4 px-4 py-2 rounded-[10px] text-white font-medium bg-gradient-to-r from-[#6D74FF] to-[#414699] hover:opacity-90 transition lg:text-lg">
                    Read More
                  </Link>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
