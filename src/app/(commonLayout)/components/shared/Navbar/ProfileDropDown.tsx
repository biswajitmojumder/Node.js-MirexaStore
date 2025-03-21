"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ProfileDropdown = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("cart");
    setUser(null);
    setIsOpen(false);
    router.push("/login");
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="dropdown dropdown-end">
      {/* 🔥 Desktop: Profile Icon, Mobile: 3-Line Button */}
      <button
        onClick={handleToggle}
        tabIndex={0}
        className="btn btn-ghost btn-circle"
      >
        {/* ✅ Desktop: Fully Rounded Profile Icon */}
        <div className="hidden sm:block w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white overflow-hidden">
          <Image
            className="w-full h-full object-cover"
            src={
              user?.photo || "https://img.icons8.com/ios-glyphs/30/user--v1.png"
            }
            alt="Profile"
            layout="responsive"
            height={500}
            width={500}
          />
        </div>

        {/* ✅ Mobile: 3-Line Menu Button */}
        <div className="block sm:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-white text-black rounded-lg shadow-lg mt-3 w-48"
        >
          {user ? (
            <>
              {user?.role === "admin" ? (
                <>
                  <li>
                    <Link
                      href="/admin/users"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      User Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/addProduct"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Add Product
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/products"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Product Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/orders"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Order Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/analytics"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Analytics
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* <li>
                    <Link
                      href="/dashboard"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Dashboard
                    </Link>
                  </li> */}

                  {/* <li>
                    <Link
                      href="/wishlist"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Wishlist
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      href="/product"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Product
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cart"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Shopping Cart
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cart/checkout"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Checkout
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/order-history"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Order History
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="/settings"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Settings
                    </Link>
                  </li> */}
                </>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:bg-gray-100 p-2 rounded-lg"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="hover:bg-gray-100 p-2 rounded-lg"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  onClick={handleLinkClick}
                  className="hover:bg-gray-100 p-2 rounded-lg"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;
