"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "axios";
import Loading from "@/app/loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WithAuth from "@/app/lib/utils/withAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";

interface ShippingDetails {
  fullName: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

interface OrderItem {
  sellerEmail: string;
}

interface Order {
  _id: string;
  shippingDetails: ShippingDetails;
  orderDate: string;
  grandTotal: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Canceled";
  items: OrderItem[];
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sellerFilter, setSellerFilter] = useState<string>("");
  const [userEmailFilter, setUserEmailFilter] = useState<string>("");

  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const userRole = localStorage.getItem("role");

    if (userRole !== "admin") {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const response = await Axios.get(
        "https://e-commerce-backend-ashy-eight.vercel.app/api/checkout",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      let newStatus = "";
      if (currentStatus === "Pending") newStatus = "Processing";
      else if (currentStatus === "Processing") newStatus = "Shipped";
      else if (currentStatus === "Shipped") newStatus = "Delivered";

      await Axios.patch(
        `https://e-commerce-backend-ashy-eight.vercel.app/api/checkout/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const deleteOrder = async (orderId: string) => {
    toast.info(
      <div>
        <p className="font-semibold">
          Are you sure you want to cancel this order?
        </p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={async () => {
              try {
                const loadingToastId = toast.loading("Cancelling order...");

                if (!token) return;

                await Axios.delete(
                  `https://e-commerce-backend-ashy-eight.vercel.app/api/checkout/${orderId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                toast.update(loadingToastId, {
                  render: "✅ Order canceled successfully!",
                  type: "success",
                  isLoading: false,
                  autoClose: 10000,
                });

                fetchOrders();
              } catch (err) {
                toast.error("❌ Failed to cancel order. Please try again.");
              }

              toast.dismiss();
            }}
          >
            Yes
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  // Group orders by first seller email
  const groupBySeller = orders.reduce((acc, order) => {
    const sellerEmail = order.items?.[0]?.sellerEmail || "Unknown";
    if (!acc[sellerEmail]) acc[sellerEmail] = [];
    acc[sellerEmail].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const filteredGroupedOrders = Object.entries(groupBySeller).map(
    ([sellerEmail, sellerOrders]) => {
      const filteredOrders = sellerOrders.filter((order) => {
        const matchesQuery = order._id
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "" || order.status === statusFilter;
        const matchesSeller =
          sellerFilter === "" || sellerEmail === sellerFilter;
        const matchesUserEmail =
          userEmailFilter === "" ||
          (order.shippingDetails.email || "")
            .toLowerCase()
            .includes(userEmailFilter.toLowerCase());

        return (
          matchesQuery && matchesStatus && matchesSeller && matchesUserEmail
        );
      });

      return { sellerEmail, orders: filteredOrders };
    }
  );

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-red-500">
        {error} <br />
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Admin Order Management
      </h1>

      <div className="mb-4 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Filter by User Email"
          value={userEmailFilter}
          onChange={(e) => setUserEmailFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Filter by Seller Email"
          value={sellerFilter}
          onChange={(e) => setSellerFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      {filteredGroupedOrders.map(
        ({ sellerEmail, orders }) =>
          orders.length > 0 && (
            <div key={sellerEmail} className="mb-8">
              <h2 className="text-xl font-semibold mb-2">
                Seller: {sellerEmail}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Order ID</th>
                      <th className="py-3 px-6 text-left">Customer</th>
                      <th className="py-3 px-6 text-left">User Email</th>
                      <th className="py-3 px-6 text-center">Date</th>
                      <th className="py-3 px-6 text-center">Total</th>
                      <th className="py-3 px-6 text-center">Status</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm">
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-6">{order._id.slice(-6)}</td>
                        <td className="py-3 px-6">
                          {order.shippingDetails.fullName}
                        </td>
                        <td className="py-3 px-6">
                          {order.shippingDetails.email || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-center">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-center">
                          ৳{order.grandTotal.toFixed(2)}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span
                            className={`py-1 px-3 rounded-full text-xs font-semibold ${
                              order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : order.status === "Processing"
                                ? "bg-blue-100 text-blue-600"
                                : order.status === "Shipped"
                                ? "bg-purple-100 text-purple-600"
                                : order.status === "Delivered"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center space-x-2">
                          {order.status !== "Delivered" &&
                            order.status !== "Canceled" && (
                              <>
                                {order.status === "Pending" && (
                                  <button
                                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                    onClick={() =>
                                      updateOrderStatus(order._id, "Pending")
                                    }
                                  >
                                    Processing
                                  </button>
                                )}
                                {order.status === "Processing" && (
                                  <button
                                    className="text-xs bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600"
                                    onClick={() =>
                                      updateOrderStatus(order._id, "Processing")
                                    }
                                  >
                                    Shipped
                                  </button>
                                )}
                                {order.status === "Shipped" && (
                                  <button
                                    className="text-xs bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                    onClick={() =>
                                      updateOrderStatus(order._id, "Shipped")
                                    }
                                  >
                                    Delivered
                                  </button>
                                )}
                              </>
                            )}
                          {order.status !== "Delivered" && (
                            <button
                              className="text-xs bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                              onClick={() => deleteOrder(order._id)}
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            className="text-xs bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                            onClick={() => router.push(`orders/${order._id}`)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
      )}

      <ToastContainer />
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["admin"]}>
      <AdminOrders />
    </WithAuth>
  );
}
