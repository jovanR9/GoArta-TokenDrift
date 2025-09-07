import React, { useRef, useState } from "react";
import { X } from 'lucide-react';

const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not specified";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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

export default function BookedEventsCards() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelEventId, setCancelEventId] = useState<number | null>(null);
    const [cancelEventTitle, setCancelEventTitle] = useState('');

    // Sample booked events data
    const bookedEvents = [
        {
            id: 1,
            title: "Traditional Goan Cooking Workshop",
            event_date: "2024-12-15",
            location: "Panaji Heritage Kitchen",
            thumbnail: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=250&fit=crop",
            price: "₹2,500"
        },
        {
            id: 2,
            title: "Fado Music Evening Experience",
            event_date: "2024-12-22",
            location: "Fontainhas Cultural Center",
            thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
            price: "₹1,800"
        },
        {
            id: 3,
            title: "Portuguese Heritage Walking Tour",
            event_date: "2024-12-28",
            location: "Old Goa Churches",
            thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
            price: "₹1,200"
        },
        {
            id: 4,
            title: "Traditional Kunbi Dance Workshop",
            event_date: "2025-01-05",
            location: "Margao Cultural Hall",
            thumbnail: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=400&h=250&fit=crop",
            price: "₹2,000"
        },
        {
            id: 5,
            title: "Goan Carnival Mask Making",
            event_date: "2025-01-12",
            location: "Mapusa Art Studio",
            thumbnail: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=250&fit=crop",
            price: "₹1,500"
        }
    ];

    const scrollBy = (offset: number) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
        }
    };

    const handleCancelClick = (eventId: number, eventTitle: string) => {
        setCancelEventId(eventId);
        setCancelEventTitle(eventTitle);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        // Handle cancellation logic here
        console.log(`Cancelled event with ID: ${cancelEventId}`);
        setShowCancelModal(false);
        setCancelEventId(null);
        setCancelEventTitle('');
    };

    const handleCancelModal = () => {
        setShowCancelModal(false);
        setCancelEventId(null);
        setCancelEventTitle('');
    };

    return (
        <div className="w-full px-6 py-20">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <h2 className="md:text-5xl lg:text-3xl font-bold text-black mb-16">
                    My Booked Cultural Events
                </h2>

                {/* Cards Container */}
                <div className="relative">
                    {/* Scroll buttons */}
                    <button
                        onClick={() => scrollBy(-400)}
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-600 items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white transition-all duration-300 hover:scale-105"
                        aria-label="Scroll left"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => scrollBy(400)}
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-600 items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white transition-all duration-300 hover:scale-105"
                        aria-label="Scroll right"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-8 overflow-x-auto scrollbar-hide px-2 py-4"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {bookedEvents.map((event, index) => (
                            <div
                                key={event.id}
                                className="flex-shrink-0 w-[320px] rounded-3xl bg-white border border-blue-600 shadow-md overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="h-44 w-full overflow-hidden relative">
                                    <img
                                        src={event.thumbnail}
                                        alt={event.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                                        {event.price}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                    <div className="space-y-1 text-gray-700 mb-5">
                                        <p className="text-sm">Date: {formatDate(event.event_date)}</p>
                                        <p className="text-sm">Location: {event.location}</p>
                                    </div>

                                    <div className="space-y-3">
                                        {/* View Details Button */}
                                        <div className="rounded-xl p-0.5 bg-gradient-to-r from-purple-300/40 to-indigo-300/40">
                                            <button className="w-full rounded-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 text-sm font-semibold shadow hover:from-indigo-600 hover:to-purple-600 transition-colors duration-200 flex items-center justify-center gap-2">
                                                View Details <span aria-hidden>→</span>
                                            </button>
                                        </div>

                                        {/* Cancel Registration Button */}
                                        <button
                                            onClick={() => handleCancelClick(event.id, event.title)}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
                                        >
                                            Cancel Registration
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <div className="px-4 py-1 text-gray-600 text-sm bg-gray-100 rounded-full border border-blue-600">
                        Swipe left to see more
                    </div>
                </div>

                {/* Cancel Confirmation Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Cancel Registration</h3>
                                <button
                                    onClick={handleCancelModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-700 mb-2">Are you sure you want to cancel your registration for:</p>
                                <p className="font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                                    {cancelEventTitle}
                                </p>
                                <p className="text-sm text-red-600 mt-2">
                                    This action cannot be undone and you may lose your booking.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancelModal}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg transition-colors font-medium"
                                >
                                    Keep Booking
                                </button>
                                <button
                                    onClick={handleConfirmCancel}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}