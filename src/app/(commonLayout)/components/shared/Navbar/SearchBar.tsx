"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
            `http://localhost:5000/api/product/search-suggestions?query=${searchTerm}`
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
      <div className="hidden md:flex w-72 relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white w-full pl-10"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-[#F85606] px-3 py-1 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          🔍
        </button>
      </div>

      {/* Mobile Search */}
      <button
        className="md:hidden text-white"
        onClick={() => setShowSearch(!showSearch)}
      >
        🔍
      </button>

      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 right-0 px-6 z-10"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#F85606] pl-10"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#F85606] text-white px-3 py-1 rounded-lg shadow-md hover:bg-[#e04d00] transition"
          >
            🔍
          </button>

          {/* Suggestion List */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <ul className="max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSearchTerm(suggestion);
                      setSuggestions([]); // Clear suggestions after selection
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
