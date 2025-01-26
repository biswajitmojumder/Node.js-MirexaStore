"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [hydrated, setHydrated] = useState(false); // To prevent hydration issues
  const [showSearch, setShowSearch] = useState(false); // Toggle mobile search

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // Prevent server-side rendering mismatch

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          MyStore
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-primary text-gray-600">
            Home
          </Link>
          <Link href="/products" className="hover:text-primary text-gray-600">
            Products
          </Link>
          <Link href="/cart" className="hover:text-primary text-gray-600">
            Cart
          </Link>
        </nav>

        {/* Search and Profile Section */}
        <div className="flex items-center gap-4">
          {/* Desktop Search Bar */}
          <div className="hidden md:flex w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="input input-bordered w-full"
            />
          </div>

          {/* Mobile Search Icon */}
          <button
            className="btn btn-ghost md:hidden"
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
            <div className="absolute top-16 left-0 right-0 px-4 z-10">
              <input
                type="text"
                placeholder="Search..."
                className="input input-bordered w-full"
              />
            </div>
          )}

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Profile"
                />
              </div>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow-lg mt-3 w-52"
            >
              <li>
                <Link href="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/settings">Settings</Link>
              </li>
              <li>
                <Link href="/logout">Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
