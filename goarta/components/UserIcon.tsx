// components/UserIcon.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface UserIconProps {
  initials: string; // Prop to pass initials
}

export default function UserIcon({ initials }: UserIconProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard"); // Redirect to profile page on click
  };

  return (
    <>
      <div className="flex gap-8">
        <div
          className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-gray-700 dark:ring-gray-100 flex items-center justify-center bg-blue-600 text-white text-sm font-semibold cursor-pointer"
          onClick={handleClick}
        >
          {initials} {/* Display initials */}
        </div>
      </div>
    </>
  );
}