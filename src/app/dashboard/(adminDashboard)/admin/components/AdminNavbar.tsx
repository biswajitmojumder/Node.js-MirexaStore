"use client";

import { MoreVertical, Bell, Search } from "lucide-react";

interface AdminNavbarProps {
  onMenuClick: () => void;
}

const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 w-full bg-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* Left: Hamburger + Brand */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Icon */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-[#F6550C] p-2 rounded hover:bg-gray-100 transition"
          aria-label="Toggle sidebar"
        >
          <MoreVertical size={24} />
        </button>

        {/* Brand */}
        <h1 className="text-xl font-extrabold text-[#F6550C] select-none">
          Mirexa Admin
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search (hidden on small screens) */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-md">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm w-36 placeholder-gray-500"
          />
        </div>

        {/* Notification bell */}
        <button
          className="relative text-gray-600 hover:text-[#F6550C] transition"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            3
          </span>
        </button>

        {/* User Avatar */}
        <div
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#F6550C] cursor-pointer hover:opacity-90 transition"
          title="Profile"
        >
          <img
            src="https://i.pravatar.cc/36?img=4"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
