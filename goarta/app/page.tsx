import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Wave from "@/components/Wave";
import Info from "@/components/Info";
import Pastt_events from "@/components/Past_events";
import EventCard from "@/components/EventCard";

export default function Home() {
  return (
    <div className="">
      <div>
        <Navbar />
      </div>

      <div className="w-full lg:-mt-8">
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

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <EventCard />
      </div>
    </div>
  );
}
