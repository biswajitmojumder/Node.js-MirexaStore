"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, Package, Settings, X } from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";

// ✅ Add the interface here (top of the file)
interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

// ✅ Component starts here
const menu = [
  { name: "Dashboard", href: "/(adminDashboard)", icon: Home },
  { name: "Users", href: "/(adminDashboard)/users", icon: Users },
  { name: "Orders", href: "/(adminDashboard)/orders", icon: Package },
  { name: "Settings", href: "/(adminDashboard)/settings", icon: Settings },
];

const AdminSidebar = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
  const pathname = usePathname();

  const closeSidebar = () => setIsOpen(false);

  // Optional: disable scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-[#F6550C] text-white p-6 flex flex-col transition-transform duration-300 ease-in-out z-40",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:min-h-screen md:block"
        )}
        aria-label="Admin sidebar"
      >
        {/* Mobile close button */}
        <div className="flex justify-between items-center md:hidden mb-6">
          <h2 className="text-2xl font-bold">Mirexa Admin</h2>
          <button
            onClick={closeSidebar}
            className="text-white hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-8 hidden md:block select-none">
          Mirexa Admin
        </h2>

        <nav className="flex flex-col gap-4 flex-grow">
          {menu.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                onClick={closeSidebar}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200",
                  "hover:bg-white hover:text-[#F6550C]",
                  isActive && "bg-white text-[#F6550C]"
                )}
              >
                <Icon size={20} />
                <span className="text-md font-medium">{name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        />
      )}
    </>
  );
};

export default AdminSidebar;
