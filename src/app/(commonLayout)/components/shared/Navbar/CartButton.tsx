"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/solid"; // Using ShoppingBagIcon

const CartButton = () => {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cartData.length);

    const handleStorageChange = () => {
      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cartData.length);
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Link href="/cart" className="relative group">
      <button className="flex items-center gap-2 bg-white text-[#F85606] px-1 lg:px-4 py-1 lg:py-2 rounded-full shadow-md hover:bg-gray-100 transition">
        <ShoppingBagIcon className="h-6 w-6" />{" "}
        {/* Updated to ShoppingBagIcon */}
        <span className="hidden md:inline font-medium">Cart</span>
      </button>
      {/* Cart Item Count Badge */}
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full group-hover:scale-110 transition">
        {cartCount}
      </span>
    </Link>
  );
};

export default CartButton;
