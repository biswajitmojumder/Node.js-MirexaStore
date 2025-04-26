"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  // Fetch suggestions when the search term changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim()) {
        try {
          const response = await fetch(
            `https://campus-needs-backend.vercel.app/api/product/search-suggestions?query=${searchTerm}`
          );
          const data = await response.json();
          setSuggestions(data); // Assuming the API returns an array of suggestions
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]); // Clear suggestions when search term is empty
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${searchTerm}`);
    }
  };

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden md:flex w-80 relative">
  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") handleSearch();
    }}
    className="pl-12 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F85606] text-gray-700 placeholder-gray-400 transition"
  />

  <button
    onClick={handleSearch}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#F85606] text-white p-2 rounded-full hover:bg-[#e04d00] transition shadow-md"
  >
    <FaSearch size={18} />
  </button>
</div>



      {/* Mobile Search */}

      <button
        className="md:hidden mr-2 flex items-center justify-center text-white bg-[#F85606] hover:bg-[#e04d00] rounded-full p-2 shadow-lg transition transform hover:scale-105 border border-white"
        onClick={() => setShowSearch(!showSearch)}
      >
        <FaSearch />
      </button>

      {showSearch && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="absolute top-16 left-0 right-0 px-6 z-20" // z-index ektu baralam
  >
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch(); // Enter press handle
        }}
        className="pl-14 pr-4 py-2 rounded-full border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#F85606] text-gray-700 placeholder-gray-400 shadow-sm transition"
      />
      <button
        onClick={handleSearch}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white text-[#F85606] border border-[#F85606] p-1 rounded-full shadow-sm hover:bg-[#F85606] hover:text-white transition-all duration-300 ease-in-out"
      >
        <FaSearch size={14} />
      </button>
    </div>

    {/* Suggestions List */}
    {suggestions.length > 0 && (
      <div className="absolute left-0 right-0 mt-3 bg-white border border-gray-200 rounded-xl shadow-xl z-30">
        <ul className="max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-5 py-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => {
                setSearchTerm(suggestion);
                setSuggestions([]); // suggestion select korle clear
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    )}
  </motion.div>
)}

    </>
  );
};

export default SearchBar;
