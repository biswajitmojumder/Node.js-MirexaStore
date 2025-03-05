"use client"; // Add this line to mark the component as a client component

import React, { ReactNode, useEffect, useState } from "react";
import Axios from "axios";
import Loading from "@/app/loading";
import { ToastContainer, toast } from "react-toastify"; // Importing Toastify
import "react-toastify/dist/ReactToastify.css"; // Importing CSS for Toastify
import FloatingIcons from "../components/ui/FloatingIcons";

interface OrderItem {
  shippingCost: ReactNode;
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  productDetails: Product;
  review?: string;
  rating?: number; // New field for rating
}

interface ShippingDetails {
  fullName: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  deliveryNote: string;
  country: string;
}

interface Order {
  totalPrice: any;
  shippingCost: any;
  _id: string;
  status: string;
  grandTotal: number;
  discountApplied: number;
  orderDate: string;
  items: OrderItem[];
  shippingDetails: ShippingDetails;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  productImages: string[];
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await Axios.get(
        `http://localhost:5000/api/product/${productId}`
      );
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch product details:", err);
      return null;
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;

      if (!token || !userId) {
        setError("No token or user ID found. Please log in.");
        return;
      }

      const response = await Axios.get(
        `http://localhost:5000/api/checkout/order/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ordersWithProductDetails = await Promise.all(
        response.data.data.map(async (order: Order) => {
          const itemsWithDetails = await Promise.all(
            order.items.map(async (item: OrderItem) => {
              const productDetails = await fetchProductDetails(item.productId);
              return {
                ...item,
                productDetails,
                rating: 5, // Set initial rating as 5
              };
            })
          );

          return {
            ...order,
            items: itemsWithDetails,
          };
        })
      );

      setOrders(ordersWithProductDetails);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch order history");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const handleReviewSubmit = async (
    productId: string,
    orderId: string,
    rating: number,
    comment: string
  ) => {
    try {
      // Retrieve the token and user info from localStorage
      const token = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userName = user?.name; // Get the username from the localStorage user object

      if (!token) {
        toast.error("You must be logged in to submit a review.");
        return;
      }

      if (!userName) {
        toast.error("User name is missing. Please log in.");
        return;
      }

      if (!comment.trim()) {
        toast.error("Review cannot be empty.");
        return;
      }

      // Send the review to the backend with the necessary data
      const response = await Axios.post(
        "http://localhost:5000/api/reviews/create",
        {
          productId,
          userId: orderId, // Assuming userId is orderId for simplicity here, adjust accordingly.
          userName, // Include the userName field here
          rating,
          comment,
          likes: [],
          replies: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      // Show success toast
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit the review.");
    }
  };

  const handleRatingChange = (item: OrderItem, rating: number) => {
    item.rating = rating; // Update the rating for the item
    setOrders([...orders]); // Trigger re-render
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-400 text-black";
      case "shipped":
        return "bg-blue-500 text-white";
      case "delivered":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) return <Loading />;
  if (error)
    return <div className="text-center text-red-500 text-lg">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto my-8 px-4 md:px-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-900">
        Your Order History
      </h1>

      <div className="space-y-8">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            You have no orders yet.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h3 className="text-2xl font-semibold text-blue-600 mb-2 sm:mb-0">
                  Order ID:{" "}
                  <span className="">MIREXA-{order._id.slice(-6)}</span>
                </h3>
                <p className="text-lg text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <p
                  className={`text-sm font-medium px-3 py-2 rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </p>
                <p className="text-xl font-medium text-gray-700">
                  Total:{" "}
                  <span className="text-xl font-semibold">
                    ৳{(order.totalPrice + order.shippingCost).toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <h4 className="text-xl font-semibold">Items</h4>
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row justify-between items-center py-4 border-b border-gray-300 mb-4"
                  >
                    <img
                      src={
                        item.productDetails?.productImages?.[0] ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.productDetails?.name || "Product"}
                      className="w-24 h-24 object-cover rounded-md shadow-sm"
                    />
                    <div className="ml-6 flex-1">
                      <p className="text-lg font-semibold text-gray-800">
                        {item.productDetails?.name ||
                          "Product details not found"}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Description:{" "}
                        <span className="italic text-gray-500">
                          {item.productDetails?.description ||
                            "No description available."}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Qty: {item.quantity} | Price:{" "}
                        <span className="font-semibold">
                          ৳{item.price.toFixed(2)}
                        </span>{" "}
                        | shippingCost:{" "}
                        <span className="font-semibold">
                          ৳{order.shippingCost.toFixed(2)}
                        </span>
                        {order.discountApplied ? (
                          <>
                            {" "}
                            | FirstOrderDiscount:{" "}
                            <span className="font-semibold">
                              ৳{order.discountApplied.toFixed(2)}
                            </span>
                          </>
                        ) : null}
                      </p>

                      {/* Rating system */}
                      <div className="mt-4">
                        <h5 className="text-lg font-medium">
                          Rate this Product
                        </h5>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRatingChange(item, star)}
                              className={`${
                                item.rating >= star
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Review Form */}
                      <div className="mt-4">
                        <h5 className="text-lg font-medium">Write a Review</h5>
                        <textarea
                          placeholder="Your review"
                          rows={4}
                          className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                          onChange={(e) => (item.review = e.target.value)}
                        />
                        <button
                          onClick={() =>
                            handleReviewSubmit(
                              item.productId,
                              order._id,
                              item.rating || 5,
                              item.review || ""
                            )
                          }
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-xl font-semibold">Shipping Details</h4>
                <div className="text-gray-700 text-sm mt-2">
                  {Object.entries(order.shippingDetails).map(([key, value]) => (
                    <p key={key} className="mb-1">
                      <strong>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </strong>{" "}
                      {value}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ToastContainer */}
      <ToastContainer />
      <FloatingIcons />
    </div>
  );
};

export default OrderHistory;
