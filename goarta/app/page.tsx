import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Wave from "@/components/Wave";
import Info from "@/components/Info";
import Past_events from "@/components/Past_events";
import AIGeneratedItineraryCard from "@/components/AIGeneratedItineraryCard";
import AnimatedTestimonialsDemo from "@/components/animated-testimonials-demo";
import Footer from "@/components/Footer";
import VideoSection from "@/components/Video";
import UpcomingEventsCarousel from "@/components/TravelCarousel";

import EventCard from "@/components/EventCard";

export default function Home() {
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
        <div>
          <Navbar />
        </div>

        <div className="mt-[66px] w-full lg:-mt-8 md:-mt-7">
          <Hero />
        </div>

        <div className=" -mt-7 lg:mt-[150px] md:-mt-20">
          <Wave />
        </div>

        <div className="">
          <Info />
        </div>

        {/* Adding the UpcomingEventsCarousel component here */}
        <div className="flex justify-center items-center min-h-screen">
          <UpcomingEventsCarousel />
        </div>

        <div className="flex justify-center items-center min-h-screen  ">
          <Past_events />
        </div>

        <div className="flex justify-center items-center min-h-screen">
          <AIGeneratedItineraryCard />
        </div>

        <div className="-mt-12">
          <VideoSection />
        </div>

        <div className="flex justify-center items-center min-h-screen ">
          <AnimatedTestimonialsDemo />
        </div>

        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
