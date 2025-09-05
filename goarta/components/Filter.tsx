"use client";
import { useState, useEffect } from "react";

interface FilterBarProps {
  onFilterChange?: (filters: {
    search: string;
    month: string;
    year: string;
    location: string;
    category: string;
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Example static years, can make dynamic
  const years = ["2025", "2024", "2023", "2022"];

  // Placeholder locations (later fetch from DB)
  const locations = ["Goa", "Mumbai", "Delhi", "Bangalore"];

  const categories = ["Cultural", "Heritage", "Musical"];

  // Handle filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({ search, month, year, location, category });
    }
  }, [search, month, year, location, category, onFilterChange]);

  return (
    <div className="bg-gray-100 p-4 rounded-2xl shadow-md flex flex-col md:flex-row gap-4 items-center">
      {/* Search */}
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded-lg w-full md:w-1/4"
      />

      {/* Month Dropdown */}
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="p-2 border rounded-lg w-full md:w-1/5"
      >
        <option value="">Month</option>
        {months.map((m, idx) => (
          <option key={idx} value={m}>{m}</option>
        ))}
      </select>

      {/* Year Dropdown */}
      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="p-2 border rounded-lg w-full md:w-1/5"
      >
        <option value="">Year</option>
        {years.map((y, idx) => (
          <option key={idx} value={y}>{y}</option>
        ))}
      </select>

      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded-lg w-full md:w-1/5"
      >
        <option value="">Category</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Location Dropdown */}
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 border rounded-lg w-full md:w-1/5"
      >
        <option value="">Location</option>
        {locations.map((loc, idx) => (
          <option key={idx} value={loc}>{loc}</option>
        ))}
      </select>

      {/* Apply Button */}
      <button
        onClick={() => {
          if (onFilterChange) {
            onFilterChange({ search, month, year, location, category });
          }
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}