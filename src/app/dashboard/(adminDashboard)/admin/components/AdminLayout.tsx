// "use client";

// import { useState } from "react";
// import AdminSidebar from "./AdminSidebar";
// import AdminNavbar from "./AdminNavbar";

// const AdminLayout = ({ children }: { children: React.ReactNode }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       {/* Sidebar */}
//       <AdminSidebar
//         isOpen={isSidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-auto">
//         <AdminNavbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
//         <main className="p-4 md:p-6">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
