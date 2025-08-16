"use client";
import React from "react";
import { UserReviews } from "@/components/UserReviews";

interface Review {
  userPhoto: string;
  userName: string;
  reviewText: string;
  rating: number;
  logoSrc: string;
}

export const UserReviewsSection: React.FC = () => {
  const dummyReviews: Review[] = [
    {
      userPhoto: "https://randomuser.me/api/portraits/men/1.jpg",
      userName: "John Doe",
      reviewText: "This is an amazing product! Highly recommended.",
      rating: 5,
      logoSrc: "/Logo.png",
    },
    {
      userPhoto: "https://randomuser.me/api/portraits/women/2.jpg",
      userName: "Jane Smith",
      reviewText: "Great experience, very satisfied with the service.",
      rating: 4,
      logoSrc: "/Logo.png",
    },
    {
      userPhoto: "https://randomuser.me/api/portraits/men/3.jpg",
      userName: "Peter Jones",
      reviewText: "Good value for money, would use again.",
      rating: 4,
      logoSrc: "/Logo.png",
    },
    {
      userPhoto: "https://randomuser.me/api/portraits/women/4.jpg",
      userName: "Alice Brown",
      reviewText: "Excellent support and user-friendly interface.",
      rating: 5,
      logoSrc: "/Logo.png",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyReviews.map((review, index) => (
          <UserReviews
            key={index}
            review={review}
          />
        ))}
      </div>
    </div>
  );
};