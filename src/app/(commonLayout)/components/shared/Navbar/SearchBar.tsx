"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const SearchBar = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden md:flex w-72 relative">
        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white w-full pl-10"
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-[#F85606] px-3 py-1 rounded-lg shadow-md hover:bg-gray-100 transition">
          🔍
        </button>
      </div>

      {/* Mobile Search Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setShowSearch(!showSearch)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
          />
        </svg>
      </button>

      {/* Mobile Search Bar */}
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
            className="px-4 py-2 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#F85606] pl-10"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#F85606] text-white px-3 py-1 rounded-lg shadow-md hover:bg-[#e04d00] transition">
            🔍
          </button>
        </motion.div>
      )}
    </>
  );
};

export default SearchBar;
