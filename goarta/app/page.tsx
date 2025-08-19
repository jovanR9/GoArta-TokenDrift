import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Wave from "@/components/Wave";
import Info from "@/components/Info";
import Pastt_events from "@/components/Past_events";
import AIGeneratedItineraryCard from "@/components/AIGeneratedItineraryCard";
import AnimatedTestimonialsDemo from "@/components/animated-testimonials-demo";
import Footer from "@/components/Footer";

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

      {/* Content container */}
      <div className="relative z-10">
        <div>
          <Navbar />
        </div>

        <div className="mt-[66px] w-full lg:-mt-8">
          <Hero />
        </div>

        <div className=" -mt-7 lg:mt-[150px]">
          <Wave />
        </div>

        <div className="">
          <Info />
        </div>

        <div className="flex justify-center items-center min-h-screen ">
          <Pastt_events />
        </div>

        <div>
          <EventCard />
        </div>

        <div className="flex justify-center items-center min-h-screen">
          <AIGeneratedItineraryCard />
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
