"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProfileDropdown = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Load the user from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user state from localStorage
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken"); // Remove token as well
    setUser(null); // Update state immediately on logout
    router.push("/login"); // Redirect to login page after logout
  };

  // Handle login by manually setting the user state and updating localStorage
  const handleLogin = (newUser: any) => {
    localStorage.setItem("user", JSON.stringify(newUser)); // Save user data in localStorage
    setUser(newUser); // Update the user state immediately
  };

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-9 lg:w-10 rounded-full border-2 border-white">
          <img
            src={
              user?.photo || "https://img.icons8.com/ios-glyphs/30/user--v1.png"
            } // Show user's photo if available
            alt="Profile"
          />
        </div>
      </button>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-white text-black rounded-lg shadow-lg mt-3 w-48"
      >
        {user ? (
          <>
            {user?.role === "admin" ? (
              // Admin-specific options
              <>
                <li>
                  <Link
                    href="/admin/users"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                  >
                    User Management
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/addProduct"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                  >
                    Add Product
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/products"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                  >
                    Product Management
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/orders"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                  >
                    Order Management
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/analytics"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                  >
                    Analytics
                  </Link>
                </li>
              </>
            ) : (
              // Regular user-specific options
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/order-history"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                  >
                    Order History
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wishlist"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                  >
                    Shopping Cart
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                  >
                    Settings
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
              <Link href="/login" className="hover:bg-gray-100 p-2 rounded-lg">
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="hover:bg-gray-100 p-2 rounded-lg"
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ProfileDropdown;
