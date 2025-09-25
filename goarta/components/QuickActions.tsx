"use client";

import React, { useState } from "react";
import Razorpay from "razorpay";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const QuickActions: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Event Name",
          text: "Check out this event!",
          url: window.location.href,
        })
        .then(() => console.log("Event shared successfully"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: 1, userId: "demo-user" }), // replace with real data
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "GoArta",
        description: "Test Transaction",
        order_id: data.orderId,
        handler: function (response: any) {
          console.log("Payment successful:", response);
          // TODO: send response.razorpay_payment_id to your backend for verification
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#0099ff",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to start payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Event Name");
    const details = encodeURIComponent("Event description goes here");
    const location = encodeURIComponent("Event location");

    // Start and end time in format: YYYYMMDDTHHmmssZ (UTC)
    const start = "20250925T180000Z"; // Example start date
    const end = "20250925T200000Z"; // Example end date

    const url = `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;

    window.open(url, "_blank");
  };

  return (
    <div className="w-full border border-black rounded-xl p-4 bg-white">
      {/* Heading */}
      <h3 className="text-2xl font-playfair font-bold mb-3">Quick actions</h3>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Book tickets */}
        <button
          className="px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold w-full text-lg hover:scale-102 transition-transform duration-200 disabled:opacity-50"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Book tickets"}
        </button>

        {/* Plan with AI Itinerary */}
        <button className="px-4 py-2 rounded-lg bg-purple-400 text-white font-semibold w-full text-lg hover:scale-102 transition-transform duration-200">
          Plan with AI Itinerary
        </button>

        {/* Share event */}
        <button
          onClick={handleShare}
          className="px-4 py-2 rounded-lg bg-green-700 text-white font-semibold w-full text-lg hover:scale-102 transition-transform duration-200"
        >
          Share event
        </button>

        {/* Add to calendar */}
        <button
          onClick={handleAddToCalendar}
          className="px-4 py-2 rounded-lg border-2 border-sky-400 text-sky-500 font-semibold w-full text-lg hover:scale-102 transition-transform duration-200"
        >
          + Add to calendar
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
