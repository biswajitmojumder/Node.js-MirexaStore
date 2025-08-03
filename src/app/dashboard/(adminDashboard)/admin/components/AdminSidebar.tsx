// "use client";

// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { Home, Users, Package, Settings, X } from "lucide-react";
// import clsx from "clsx";
// import { useEffect } from "react";

// // ✅ Add the interface here (top of the file)
// interface AdminSidebarProps {
//   isOpen: boolean;
//   setIsOpen: (value: boolean) => void;
// }

// // ✅ Component starts here
// const menu = [
//   { name: "Dashboard", href: "/(adminDashboard)", icon: Home },
//   { name: "Users", href: "/(adminDashboard)/users", icon: Users },
//   { name: "Orders", href: "/(adminDashboard)/orders", icon: Package },
//   { name: "Settings", href: "/(adminDashboard)/settings", icon: Settings },
// ];

// const AdminSidebar = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
//   const pathname = usePathname();

//   const closeSidebar = () => setIsOpen(false);

//   // Optional: disable scrolling when sidebar is open on mobile
//   useEffect(() => {
//     if (isOpen) document.body.style.overflow = "hidden";
//     else document.body.style.overflow = "auto";
//   }, [isOpen]);

//   return (
//     <>
//       {/* Sidebar */}
//       <aside
//         className={clsx(
//           "fixed top-0 left-0 w-64 bg-[#F6550C] text-white p-6 flex flex-col transition-transform duration-300 ease-in-out z-40 h-full",
//           isOpen ? "translate-x-0" : "-translate-x-full",
//           // md screen er jonno height auto and scrollable jodi lage:
//           "md:static md:block md:h-auto md:max-h-screen md:overflow-y-auto md:translate-x-0"
//         )}
//         aria-label="Admin sidebar"
//       >
//         {/* Mobile close button */}
//         <div className="flex justify-between items-center md:hidden mb-6">
//           <h2 className="text-2xl font-bold">Mirexa Admin</h2>
//           <button
//             onClick={closeSidebar}
//             className="text-white hover:text-gray-200"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <h2 className="text-2xl font-bold mb-8 hidden md:block select-none">
//           Mirexa Admin
//         </h2>

//         <nav className="flex flex-col gap-4 flex-grow">
//           {menu.map(({ name, href, icon: Icon }) => {
//             const isActive = pathname === href;
//             return (
//               <Link
//                 key={name}
//                 href={href}
//                 onClick={closeSidebar}
//                 className={clsx(
//                   "flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200",
//                   "hover:bg-white hover:text-[#F6550C]",
//                   isActive && "bg-white text-[#F6550C]"
//                 )}
//               >
//                 <Icon size={20} />
//                 <span className="text-md font-medium">{name}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           onClick={closeSidebar}
//           className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
//         />
//       )}
//     </>
//   );
// };

// export default AdminSidebar;

// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import clsx from "clsx";
// import { Home, Users, Package, Settings, X } from "lucide-react";

// interface AdminSidebarProps {
//   isOpen: boolean;
//   setIsOpen: (open: boolean) => void;
// }

// const menu = [
//   { name: "Dashboard", href: "/(adminDashboard)", icon: Home },
//   {
//     name: "E-commerce",
//     icon: Package,
//     submenu: [
//       { name: "Products", href: "/(adminDashboard)/products" },
//       { name: "Billing", href: "/(adminDashboard)/billing" },
//       { name: "Invoice", href: "/(adminDashboard)/invoice" },
//     ],
//   },
//   { name: "Users", href: "/(adminDashboard)/users", icon: Users },
//   { name: "Settings", href: "/(adminDashboard)/settings", icon: Settings },
// ];

// const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
//   const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

//   // মোবাইলে sidebar open থাকলে body scroll বন্ধ রাখবে
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//   }, [isOpen]);

//   const toggleSubmenu = (name: string) => {
//     setOpenSubmenus((prev) =>
//       prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
//     );
//   };

//   return (
//     <>
//       {/* Sidebar */}
//       <aside
//         className={clsx(
//           "fixed top-0 left-0 z-40 w-64 h-screen bg-[#F6550C] text-white p-6 flex flex-col transition-transform duration-300 ease-in-out",
//           isOpen ? "translate-x-0" : "-translate-x-full",
//           "md:static md:translate-x-0 md:h-auto md:block md:max-h-screen md:overflow-y-auto"
//         )}
//         aria-label="Admin sidebar"
//       >
//         {/* মোবাইলের জন্য header ও close বাটন */}
//         <div className="flex justify-between items-center md:hidden mb-6">
//           <h2 className="text-2xl font-bold">Mirexa Admin</h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="text-white hover:text-gray-200"
//             aria-label="Close sidebar"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Desktop header */}
//         <h2 className="text-2xl font-bold mb-8 hidden md:block select-none">
//           Mirexa Admin
//         </h2>

//         {/* Navigation */}
//         <nav className="flex flex-col gap-4 flex-grow">
//           {menu.map(({ name, href, icon: Icon, submenu }) => {
//             if (submenu) {
//               const isSubmenuOpen = openSubmenus.includes(name);

//               return (
//                 <div key={name}>
//                   <button
//                     onClick={() => toggleSubmenu(name)}
//                     className="flex items-center gap-3 px-4 py-2 rounded-md w-full text-left hover:bg-white hover:text-[#F6550C] transition-colors duration-200"
//                     aria-expanded={isSubmenuOpen}
//                     aria-controls={`${name}-submenu`}
//                   >
//                     <Icon size={20} />
//                     <span className="text-md font-medium flex-1">{name}</span>
//                     <svg
//                       className={clsx(
//                         "w-4 h-4 transition-transform",
//                         isSubmenuOpen && "rotate-180"
//                       )}
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                       aria-hidden="true"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </button>

//                   <ul
//                     id={`${name}-submenu`}
//                     className={clsx(
//                       "pl-10 mt-1 flex flex-col gap-2",
//                       !isSubmenuOpen && "hidden"
//                     )}
//                   >
//                     {submenu.map((sub) => (
//                       <li key={sub.name}>
//                         <Link
//                           href={sub.href}
//                           className="block px-4 py-2 rounded-md hover:bg-white hover:text-[#F6550C] transition-colors duration-200"
//                           onClick={() => setIsOpen(false)}
//                         >
//                           {sub.name}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               );
//             }

//             return (
//               <Link
//                 key={name}
//                 href={href!}
//                 onClick={() => setIsOpen(false)}
//                 className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-white hover:text-[#F6550C] transition-colors duration-200"
//               >
//                 <Icon size={20} />
//                 <span className="text-md font-medium">{name}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* মোবাইলের জন্য overlay */}
//       {isOpen && (
//         <div
//           onClick={() => setIsOpen(false)}
//           className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
//           aria-hidden="true"
//         />
//       )}
//     </>
//   );
// };

// export default AdminSidebar;

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

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard/admin",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Users",
    href: "/dashboard/admin/users",
    icon: <Users size={18} />,
  },
  {
    name: "Orders",
    href: "/dashboard/admin/orders",
    icon: <FaBox size={18} />,
  },
  {
    name: "Affiliate Products",
    href: "/dashboard/admin/affiliate-products",
    icon: <FaChartLine size={18} />,
  },
  {
    name: "Product Requests",
    href: "/dashboard/admin/products-request",
    icon: <FaClipboardList size={18} />,
  },
  {
    name: "Products",
    href: "/dashboard/admin/products",
    icon: <FaBoxes size={18} />,
  },
  {
    name: "Seller ValidTill",
    href: "/dashboard/admin/seller-validtill",
    icon: <FaUserCheck size={18} />,
  },
  {
    name: "Seller Requests",
    href: "/dashboard/admin/sellerrequest",
    icon: <FaUserPlus size={18} />,
  },
  {
    name: "Subscription Requests",
    href: "/dashboard/admin/subscription-requests",
    icon: <FaMoneyCheckAlt size={18} />,
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: <Settings size={18} />,
  },
];

const AdminSidebar = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
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
          <h2 className="text-lg font-bold text-[#F6550C]">Mirexa Admin</h2>
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

export default AdminSidebar;
