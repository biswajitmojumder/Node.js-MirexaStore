"use client";

import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "next/navigation"; // ✅ Fix applied
import Loading from "@/app/loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface ShippingDetails {
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  country?: string;
  deliveryNote?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  productImages: string[];
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product?: Product | null;
}

interface Order {
  _id: string;
  shippingDetails: ShippingDetails;
  orderDate: string;
  grandTotal: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Canceled";
  items: OrderItem[];
}

const OrderDetails: React.FC = () => {
  const params = useParams(); // ✅ Fix applied
  const orderId = params.orderId as string; // ✅ Convert to string to avoid TypeScript errors

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is not available.");
      setLoading(false);
      return;
    }
    fetchOrderDetails(orderId);
  }, [orderId]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await Axios.get(
        `http://localhost:5000/api/checkout/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderData: Order = response.data.data;

      const updatedItems = await Promise.all(
        orderData.items.map(async (item) => {
          try {
            const productRes = await Axios.get(
              `http://localhost:5000/api/product/${item.productId}`
            );
            return { ...item, product: productRes.data.data };
          } catch {
            return { ...item, product: null };
          }
        })
      );

      setOrder({ ...orderData, items: updatedItems });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch order details. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="text-center text-red-500 mt-6">
        {error}
        <ToastContainer />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Order Details</h1>

      {order && (
        <div>
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold">Shipping Details</h2>
            <p>
              <strong>Name:</strong> {order.shippingDetails.fullName}
            </p>
            {order.shippingDetails.email && (
              <p>
                <strong>Email:</strong> {order.shippingDetails.email}
              </p>
            )}
            {order.shippingDetails.phone && (
              <p>
                <strong>Phone:</strong> {order.shippingDetails.phone}
              </p>
            )}
            {order.shippingDetails.address && (
              <p>
                <strong>Address:</strong> {order.shippingDetails.address}
              </p>
            )}
            {order.shippingDetails.city && (
              <p>
                <strong>City:</strong> {order.shippingDetails.city}
              </p>
            )}
            {order.shippingDetails.district && (
              <p>
                <strong>District:</strong> {order.shippingDetails.district}
              </p>
            )}
            {order.shippingDetails.country && (
              <p>
                <strong>Country:</strong> {order.shippingDetails.country}
              </p>
            )}
            {order.shippingDetails.deliveryNote && (
              <p>
                <strong>Delivery Note:</strong>{" "}
                {order.shippingDetails.deliveryNote}
              </p>
            )}
          </div>

          <div className="mb-6 border-b pb-4 flex flex-col md:flex-row justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <p>
                <strong>Order ID:</strong> {order._id.slice(-6)}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
            </div>
            <div className="flex flex-col justify-center items-center md:items-end mt-4 md:mt-0">
              <p className="font-bold text-lg text-gray-900">
                <strong>Total Amount:</strong> ${order.grandTotal.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Items Ordered</h2>
            <ul className="grid gap-6">
              {order.items.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                >
                  {/* Product Image */}
                  {item.product?.productImages?.[0] ? (
                    <Image
                      src={item.product.productImages[0]}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="object-cover rounded-md mr-4"
                      unoptimized
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-300 flex items-center justify-center rounded-md mr-4">
                      No Image
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex flex-col justify-between">
                    <h3 className="font-semibold text-lg text-gray-700">
                      {item.product?.name || "Unknown Product"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>Price:</strong> ${item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                    <p className="font-bold text-lg text-gray-900">
                      <strong>Subtotal:</strong> $$
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderDetails;
