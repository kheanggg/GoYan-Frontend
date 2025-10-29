'use client';

import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder}) {
  return (
    <div className="w-full relative">
      {/* Input with icon inside */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm focus:outline-none text-gray-500 text-md"
      />
      
      {/* Search icon */}
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

    </div>
  );
}