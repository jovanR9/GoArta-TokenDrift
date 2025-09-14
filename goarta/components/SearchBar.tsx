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
    <div className="flex flex-col gap-2">
      <label className="text-lg font-bold">Browse through events:</label>
      <div className="flex items-center border rounded-lg px-2 py-1 bg-white shadow-sm w-full max-w-md">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search event"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
          className="flex-1 outline-none px-2 py-1 text-sm"
        />

        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="mx-1 p-1 rounded-full bg-yellow-300 hover:bg-yellow-400"
          >
            <X size={14} />
          </button>
        )}

        {/* Dropdown */}
        <select
          value={filter}
          onChange={handleFilterChange}
          className="border-l pl-2 ml-2 text-sm outline-none bg-transparent"
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