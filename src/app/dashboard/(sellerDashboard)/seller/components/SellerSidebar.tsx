"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, X } from "lucide-react";
import {
  FaBox,
  FaChartLine,
  FaClipboardList,
  FaBoxes,
  FaUserCheck,
  FaUserPlus,
  FaMoneyCheckAlt,
} from "react-icons/fa";

interface SellerSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard/seller",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Users",
    href: "/dashboard/seller/users",
    icon: <Users size={18} />,
  },
  {
    name: "Orders",
    href: "/dashboard/seller/orders",
    icon: <FaBox size={18} />,
  },
  {
    name: "Affiliate Products",
    href: "/dashboard/seller/affiliate-products",
    icon: <FaChartLine size={18} />,
  },
  {
    name: "Product Requests",
    href: "/dashboard/seller/products-request",
    icon: <FaClipboardList size={18} />,
  },
  {
    name: "Products",
    href: "/dashboard/seller/products",
    icon: <FaBoxes size={18} />,
  },
  {
    name: "Seller ValidTill",
    href: "/dashboard/seller/seller-validtill",
    icon: <FaUserCheck size={18} />,
  },
  {
    name: "Seller Requests",
    href: "/dashboard/seller/sellerrequest",
    icon: <FaUserPlus size={18} />,
  },
  {
    name: "Subscription Requests",
    href: "/dashboard/seller/subscription-requests",
    icon: <FaMoneyCheckAlt size={18} />,
  },
  {
    name: "Settings",
    href: "/dashboard/seller/settings",
    icon: <Settings size={18} />,
  },
];

const SellerSidebar = ({ isOpen, setIsOpen }: SellerSidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-20 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-[#F6550C]">Mirexa seller</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition ${
                pathname === link.href
                  ? "bg-[#F6550C]/10 text-[#F6550C]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Footer/Logout */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;
