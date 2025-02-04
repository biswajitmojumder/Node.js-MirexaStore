"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import Loading from "@/app/loading";

const UserViewPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // For filtered users
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Store search query
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null); // For storing user ID to delete
  const [isModalOpen, setIsModalOpen] = useState(false); // To track if the modal is open
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No accessToken found");
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(response.data.data); // Assuming response has 'data' key
        setFilteredUsers(response.data.data); // Initially showing all users
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [router]);

  useEffect(() => {
    // Filter users by email whenever the search query changes
    if (searchQuery) {
      setFilteredUsers(
        users.filter((user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users); // Reset to all users when search query is empty
    }
  }, [searchQuery, users]);

  // Handling role promotion (making user an admin)
  const handleMakeAdmin = async (userId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No accessToken found");
      return;
    }

    // Confirmation dialog before action with Toastify
    toast
      .promise(
        axios.patch(
          `http://localhost:5000/api/users/${userId}/role`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ),
        {
          pending: "Making user an admin...",
          success: "User role updated to admin",
          error: "Failed to update user role",
        }
      )
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: "admin" } : user
          )
        );
      });
  };

  // Open modal to confirm deletion
  const openDeleteModal = (userId: string) => {
    setDeleteUserId(userId); // Set the user ID to be deleted
    setIsModalOpen(true); // Open the confirmation modal
  };

  // Handling user deletion
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No accessToken found");
      return;
    }

    // Find the user to delete
    const userToDelete = users.find((user) => user._id === deleteUserId);

    // Check if the user to delete is an admin
    if (userToDelete?.role === "admin") {
      toast.error("Admins cannot delete other admins.");
      setIsModalOpen(false);
      return; // Don't proceed with deletion if the user is an admin
    }

    // Proceed with deletion after confirmation
    toast
      .promise(
        axios.delete(`http://localhost:5000/api/users/${deleteUserId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        {
          pending: "Deleting user...",
          success: "User deleted successfully",
          error: "Failed to delete user",
        }
      )
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== deleteUserId)
        );
        setIsModalOpen(false); // Close the modal after successful deletion
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal without deletion
  };

  return (
    <div className="pt-10">
      {" "}
      {/* Added padding-top to move the content lower */}
      {/* Search bar */}
      <div className="mb-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="px-4 py-2 border rounded-md w-60 sm:w-1/2"
            placeholder="Search by email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            onClick={() => setSearchQuery(searchQuery)}
          >
            Search
          </button>
        </div>
      </div>
      {loading ? (
        <Loading></Loading>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.role}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.phone}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.address}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.role !== "admin" && (
                      <button
                        className="px-3 py-1 bg-blue-500 text-white mr-2"
                        onClick={() => handleMakeAdmin(user._id)}
                      >
                        Make Admin
                      </button>
                    )}
                    <button
                      className="px-3 py-1 bg-red-500 text-white"
                      onClick={() => openDeleteModal(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteUser}
        message="Are you sure you want to delete this user?"
      />
      {/* ToastContainer to render Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default UserViewPage;
