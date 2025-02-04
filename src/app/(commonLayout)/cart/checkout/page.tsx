"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(60); // Default shipping for Dhaka
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Dhaka", // Default city to Dhaka
    district: "", // Added district field
    deliveryNote: "",
    country: "Bangladesh", // Default country
  });

  const router = useRouter();

  const cities = [
    "Dhaka",
    "Sylhet",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Rangpur",
    "Mymensingh",
    "Comilla",
    "Narsingdi",
    "Tangail",
    "Bogra",
  ];

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const items = storedCart ? JSON.parse(storedCart) : [];
    setCartItems(items);
    calculateTotal(items);

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);

    if (storedUser) {
      setFormData({
        fullName: storedUser.name,
        phone: storedUser.phone,
        email: storedUser.email,
        address: storedUser.address,
        city: "Dhaka", // Default to Dhaka
        district: "", // Default to empty
        deliveryNote: "",
        country: "Bangladesh", // Assume Bangladesh as default
      });
    }
  }, []);

  const calculateTotal = (items: any[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    toast.success("Item removed from cart.");
  };

  const handleOrder = async () => {
    const userToken = localStorage.getItem("accessToken");

    if (!userToken) {
      toast.error("Please log in to place an order.");
      router.push("/login");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty. Add items before placing an order.");
      return;
    }

    setLoading(true);

    const orderData = {
      userId: user?._id,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      shippingCost,
      grandTotal: totalAmount + shippingCost,
      status: "Processing",
      orderDate: new Date().toISOString(),
      shippingDetails: formData,
      deliveryNote: formData.deliveryNote, // Include delivery note here
    };

    // Log the orderData to the console before posting
    console.log("Order Data being posted:", orderData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/checkout",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Display the success message
        toast.success("✅ Order placed successfully!");

        // Clear the cart after placing the order
        localStorage.removeItem("cart");

        // Redirect to the order history page after the success message
        setTimeout(() => {
          router.push(`/order-history`);
        }, 2000); // Redirect after a short delay to allow the toast to be visible
      }
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle city selection to update shipping cost
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setFormData({ ...formData, city: selectedCity });

    // Update shipping cost based on city selection
    if (selectedCity === "Dhaka") {
      setShippingCost(60); // Dhaka shipping cost
    } else {
      setShippingCost(120); // Outside Dhaka shipping cost
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-3xl font-semibold text-center mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing & Shipping Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            Shipping Information
          </h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="fullName" className="text-sm text-gray-600">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="mt-2 p-3 w-full rounded-md border-2 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="text-sm text-gray-600">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-2 p-3 w-full rounded-md border-2 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-2 p-3 w-full rounded-md border-2 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="text-sm text-gray-600">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="mt-2 p-3 w-full rounded-md border-2 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="text-sm text-gray-600">
                City
              </label>
              <select
                id="city"
                value={formData.city}
                onChange={handleCityChange}
                className="mt-2 p-3 w-full rounded-md border-2 border-gray-300 focus:border-blue-500"
              >
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label htmlFor="district" className="text-sm text-gray-600">
                District
              </label>
              <input
                id="district"
                type="text"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                className="mt-2 p-3 w-full rounded-md border-2 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Delivery Note */}
            <div>
              <label htmlFor="deliveryNote" className="text-sm text-gray-600">
                Delivery Note
              </label>
              <textarea
                id="deliveryNote"
                rows={3}
                value={formData.deliveryNote}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryNote: e.target.value })
                }
                className="mt-2 p-3 w-full rounded-md border-2 border-gray-300 focus:border-blue-500"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            Order Summary
          </h2>

          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                >
                  <div className="flex items-center">
                    <img
                      src={item.productImages[0] || "/default-image.png"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <span className="ml-4">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4">${item.price.toFixed(2)}</span>
                    <span>x {item.quantity}</span>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Your cart is empty.</p>
            )}
          </div>

          {/* Total */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-800 mt-2">
              <span>Total</span>
              <span>${(totalAmount + shippingCost).toFixed(2)}</span>
            </div>

            <button
              onClick={handleOrder}
              className="w-full mt-6 py-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default CheckoutPage;
