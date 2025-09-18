"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All events");

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilter(value);
    onFilterChange(value);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-3xl font-bold">Browse through events:</label>
      <div className="flex items-center border rounded-lg px-4 py-2 bg-white shadow-md w-full">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search event"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
          className="flex-1 outline-none px-3 py-2 text-base"
        />

        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="mx-2 p-2 rounded-full bg-yellow-300 hover:bg-yellow-400"
          >
            <X size={18} />
          </button>
        )}

        {/* Dropdown */}
        <select
          value={filter}
          onChange={handleFilterChange}
          className="border-l pl-4 ml-2 text-base outline-none bg-transparent py-2"
        >
          <option value="All events">All events</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Past">Past</option>
          <option value="Online">Online</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;