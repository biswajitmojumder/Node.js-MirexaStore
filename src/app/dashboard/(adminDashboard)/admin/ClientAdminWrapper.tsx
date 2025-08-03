"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";

export default function ClientAdminWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = useSelector((state: any) => state.auth?.user?.role);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && role && role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [isClient, role, router]);

  if (!isClient || !role) return null;

  return (
    <div className="flex flex-1 min-h-screen min-w-0">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        {/* Main area */}
        <main className="flex-grow pt-[60px] min-w-0 overflow-auto bg-gray-50">
          {/* Your children content (e.g. admin analytics) */}
          {children}
        </main>
      </div>
    </div>
  );
}
