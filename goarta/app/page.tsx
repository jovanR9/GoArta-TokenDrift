import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Wave from "@/components/Wave";
import Info from "@/components/Info";
import Pastt_events from "@/components/Past_events";
import AIGeneratedItineraryCard from "@/components/AIGeneratedItineraryCard";
import AnimatedTestimonialsDemo from "@/components/animated-testimonials-demo";



import EventCard from "@/components/EventCard";

export default function Home() {
  return (
    <div className="">
      <div>
        <Navbar />
      </div>

      <div>
        <Hero />
      </div>

      <div className="">
        <Wave />
      </div>

      <div className="">
        <Info />
      </div>

     <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Pastt_events />
      </div>
      
      <div>
        <EventCard />
      </div>
      

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <AIGeneratedItineraryCard />
      </div>

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <AnimatedTestimonialsDemo />
      </div>
   
    </div>
  );
}
