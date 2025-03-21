"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import FloatingIcons from "../../components/ui/FloatingIcons";
import Loading from "@/app/loading";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

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
  const [isFirstOrder, setIsFirstOrder] = useState(false); // Track if it's the user's first order
  const router = useRouter();

  console.log(isFirstOrder);
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

      // Check if it's the user's first order
      checkFirstOrder(storedUser._id);
    }
  }, []);

  const calculateTotal = (items: any[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  // Check if it's the user's first order
  const checkFirstOrder = async (userId: string) => {
    try {
      const response = await axios.post(
        `https://mirexa-store-backend.vercel.app/api/checkout/check-first-order/${userId}`
      );
      if (response.data.isFirstOrder) {
        setIsFirstOrder(true);
      } else {
        setIsFirstOrder(false);
      }
    } catch (error) {
      // Enhanced error handling
      if (axios.isAxiosError(error)) {
        // Axios error has a response property
        console.error(
          "Error checking first order:",
          error.response?.data || error.message
        );
      } else {
        // Non-Axios errors (e.g., network issues)
        console.error("Unexpected error:", error);
      }

      toast.error(
        "There was an error checking the first order. Please try again later."
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed from cart.");
  };

  const handleOrder = async () => {
    const userToken = localStorage.getItem("accessToken");

    if (!userToken) {
      toast.error("You need to be logged in to place an order. Please log in.");
      router.push("/login");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before proceeding.");
      return;
    }

    setLoading(true);

    // Calculate the total amount before applying any discounts
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Calculate the discount if it's the first order
    const total = totalAmount + shippingCost;

    // Calculate the grand total by adding the shipping cost
    const grandTotal = total;

    const orderData = {
      userId: user?._id,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        color: item.color || "",
        size: item.size || "",
        name: item.name || "",
        productImage: item.productImage || [],
        // Add any additional item details like item name or image if needed
      })),
      totalPrice: total,
      shippingCost: shippingCost, // Include shipping cost here
      totalAmount: totalAmount, // The original total amount before discount
      grandTotal: grandTotal, // Grand total including shipping cost
      status: "Processing", // Update order status as per your business logic
      orderDate: new Date().toISOString(),
      shippingDetails: formData, // Shipping details from the form
      deliveryNote: formData.deliveryNote, // Delivery note for the whole order
    };

    console.log("Order Data being posted:", orderData);

    try {
      const response = await axios.post(
        "https://mirexa-store-backend.vercel.app/api/checkout",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("✅ Order placed successfully!");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        setTimeout(() => {
          router.push("/order-history");
        }, 2000);
      }
    } catch (error) {
      // Check if the error is an Axios error
      if (axios.isAxiosError(error)) {
        // Log Axios-specific error details
        console.error("Error:", error.response?.data || error.message);
      } else {
        // Log unexpected errors (e.g., network issues)
        console.error("Unexpected error:", error);
      }

      // Show an error message to the user
      toast.error(
        "There was an error processing your order. Please try again later."
      );
    } finally {
      // Set loading state to false once the operation is done
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
      <Toaster
        position="top-center"
        gutter={10}
        containerStyle={{
          top: "70px",
          zIndex: 9999,
        }}
        reverseOrder={false}
      />
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h1 className="text-3xl font-semibold text-center mb-6">Checkout</h1>

          {/* First Order Discount */}
          <div className="bg-blue-100 text-blue-800 p-6 rounded-lg mb-6 text-center shadow-lg">
            <p className="font-semibold text-xl leading-tight">
              Congratulations! Enjoy a{" "}
              <span className="text-2xl font-bold text-blue-600">
                10% discount
              </span>{" "}
              on your first order!
            </p>
            <p className="mt-3 text-md text-gray-700">
              Don&apos;t miss out on this limited-time offer to save big. This
              special discount is available for first-time customers only.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Thank you for choosing us. We look forward to serving you again
              soon. Stay tuned for more exclusive offers!
            </p>
          </div>

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
                  <label
                    htmlFor="deliveryNote"
                    className="text-sm text-gray-600"
                  >
                    Delivery Note
                  </label>
                  <textarea
                    id="deliveryNote"
                    rows={4}
                    value={formData.deliveryNote}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryNote: e.target.value })
                    }
                    className="mt-2 p-3 w-full rounded-md border-2 border-gray-300 focus:border-blue-500"
                    placeholder="Any specific instruction about delivery..."
                  ></textarea>
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
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.productImages[0]}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover rounded-md"
                          unoptimized
                        />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-gray-500">
                            <p>
                              Color:{" "}
                              <span className="capitalize">{item.color}</span>
                            </p>
                            <p>
                              Size:{" "}
                              <span className="uppercase">{item.size}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p>
                          {item.quantity} x ৳{item.price}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No items in the cart.</p>
                )}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="font-medium">Shipping</span>
                <span>{shippingCost}</span>
              </div>

              <div className="mt-4 flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>৳{(totalAmount + shippingCost).toFixed(2)}</span>
              </div>

              <button
                onClick={handleOrder}
                className="mt-6 w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      <FloatingIcons></FloatingIcons>
    </div>
  );
};

export default CheckoutPage;
