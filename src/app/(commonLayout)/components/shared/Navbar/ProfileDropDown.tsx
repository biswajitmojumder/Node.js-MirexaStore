"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/app/lib/redux/features/authSlice";
import { RootState } from "@/app/lib/redux/store";
import axios from "axios";
import { Avatar, AvatarIcon } from "@heroui/react";

const ProfileDropdown = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [resellerSlug, setResellerSlug] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);

  // Handle fallback image logic
  const [imgSrc, setImgSrc] = useState(
    user?.photo || "https://img.icons8.com/ios-glyphs/30/user--v1.png"
  );

  useEffect(() => {
    // Update imgSrc when user data changes
    setImgSrc(
      user?.photo || "https://img.icons8.com/ios-glyphs/30/user--v1.png"
    );
  }, [user?.photo]);

  const handleLogout = () => {
    localStorage.removeItem("cart");
    dispatch(logoutUser());
    setIsOpen(false);
    router.push("/login");
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Close dropdown on outside click
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

  // Fetch reseller profile on load (if user is reseller)
  useEffect(() => {
    const fetchResellerProfile = async () => {
      if (!user?.email || user.role !== "reseller") return;

      try {
        const res = await axios.get(
          `https://campus-needs-backend.vercel.app/api/reseller/profile/${user.email}`
        );
        setResellerSlug(res.data?.data?.brand?.slug || "");
        console.log(res);
      } catch (error) {
        console.error("Failed to fetch reseller profile", error);
      }
    };

    fetchResellerProfile();
  }, [user?.email, user?.role]);

  return (
    <div ref={dropdownRef} className="dropdown dropdown-end">
      <button
        onClick={handleToggle}
        tabIndex={0}
        className="btn btn-ghost btn-circle"
      >
        {/* Desktop avatar */}
        <div className="hidden sm:block w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white overflow-hidden">
          <div className="flex items-center">
            <Avatar
              classNames={{
                base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                icon: "text-black/80",
              }}
              icon={<AvatarIcon />}
            />
          </div>
        </div>

        {/* Mobile menu icon */}
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

      {/* Dropdown menu */}
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
                      href="/admin/reseller-request"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Reseller Request
                    </Link>
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
              ) : user?.role === "reseller" ? (
                <>
                  <li>
                    <Link
                      href="/reseller/addProduct"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Add Product
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reseller/orders"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Order Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reseller/products"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Product Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reseller/analytics"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reseller/profile"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Profile Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/store/${resellerSlug}`}
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 font-bold text-[#EA580C] p-2 rounded-lg"
                    >
                      My Store
                    </Link>
                  </li>
                </>
              ) : (
                <>
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
                  <li>
                    <Link
                      href="/analytics"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 p-2 rounded-lg"
                    >
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reseller-request"
                      onClick={handleLinkClick}
                      className="hover:bg-gray-100 font-bold text-[#EA580C] p-2 rounded-lg"
                    >
                      Become a Reseller
                    </Link>
                  </li>
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
