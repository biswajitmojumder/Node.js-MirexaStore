"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import FloatingIcons from "../../components/ui/FloatingIcons";
import Loading from "@/app/loading";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Landmark,
  StickyNote,
  ShoppingCart,
} from "lucide-react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sellerEmail: string;
  sellerName: string;
  color?: string;
  size?: string;
  productImage?: string[];
  productImages: string[];
};

type FormDataType = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  deliveryNote: string;
  country: string;
};

type UserType = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(60); // Default shipping for Dhaka
  const [singleShipping, setSingleShipping] = useState(60);
  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Dhaka",
    district: "",
    deliveryNote: "",
    country: "Bangladesh",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod"); // default is COD
  const [transactionId, setTransactionId] = useState("");
  const [sellerBkashNumber, setSellerBkashNumber] = useState(""); // You can fetch this from seller data
  const [finalBkashNumber, setFinalBkashNumber] = useState("017XXXXXXXX");
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMultipleSellers, setIsMultipleSellers] = useState(false);
  const router = useRouter();
  type FormDataType = {
    [key: string]: any;
  };
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
    const items: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

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
        city: "Dhaka",
        district: "",
        deliveryNote: "",
        country: "Bangladesh",
      });

      checkFirstOrder(storedUser._id);
    }
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  const checkFirstOrder = async (userId: string) => {
    try {
      const response = await axios.post(
        `https://api.mirexastore.com/api/checkout/check-first-order/${userId}`
      );
      setIsFirstOrder(response.data.isFirstOrder);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error checking first order:",
          error.response?.data || error.message
        );
      } else {
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
      toast.error("You need to be logged in to place an order.");
      router.push("/login");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (["bkash", "adminBkash"].includes(paymentMethod) && !transactionId) {
      toast.error("অনুগ্রহ করে আপনার বিকাশ Transaction ID লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const itemsGroupedBySeller: Record<string, CartItem[]> = {};
      cartItems.forEach((item) => {
        if (!itemsGroupedBySeller[item.sellerEmail]) {
          itemsGroupedBySeller[item.sellerEmail] = [];
        }
        itemsGroupedBySeller[item.sellerEmail].push(item);
      });

      const sellerEmails = Object.keys(itemsGroupedBySeller);
      const orderPromises = sellerEmails.map(async (sellerEmail) => {
        const items = itemsGroupedBySeller[sellerEmail];
        const totalAmount = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        const shipping = shippingCost;
        const grandTotal = totalAmount + shipping;

        const orderData = {
          userId: user?._id,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            sellerEmail: item.sellerEmail,
            sellerName: item.sellerName,
            color: item.color || "",
            size: item.size || "",
            name: item.name || "",
            productImage: item.productImages || [],
          })),
          totalPrice: totalAmount + singleShipping,
          shippingCost: shipping,
          totalAmount: totalAmount,
          grandTotal: grandTotal,
          status: "Processing",
          orderDate: new Date().toISOString(),
          shippingDetails: formData,
          deliveryNote: formData.deliveryNote,
          paymentMethod: paymentMethod,
          transactionId: ["bkash", "adminBkash"].includes(paymentMethod)
            ? transactionId
            : null,
        };

        console.log(orderData);
        const response = await axios.post(
          "https://api.mirexastore.com/api/checkout",
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        return response.data;
      });

      await Promise.all(orderPromises);

      // ✅ GA4 purchase event fire korchi ekhane
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "purchase", {
          transaction_id: Date.now().toString(), // unique id
          value:
            cartItems.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            ) + shippingCost,
          currency: "BDT",
          shipping: shippingCost,
          items: cartItems.map((item) => ({
            item_id: item.productId,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
            item_brand: item.sellerName,
          })),
        });
      }

      toast.success("✅ All orders placed successfully!");
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      router.push("/order-history");
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setFormData({ ...formData, city: selectedCity });
  };
  useEffect(() => {
    // শুধু তখনই শিপিং খরচ আপডেট হবে যখন কার্ট বা সিটি চেঞ্জ হবে
    if (!formData.city) return; // city empty থাকলে কিছু করো না

    const uniqueSellers = new Set(cartItems.map((item) => item.sellerEmail));
    const sellerCount = uniqueSellers.size;

    const costPerSeller = formData.city === "Dhaka" ? 60 : 120;
    setSingleShipping(costPerSeller);
    const totalShipping = sellerCount * costPerSeller;
    setShippingCost(totalShipping);
  }, [cartItems, formData.city]);

  useEffect(() => {
    const uniqueSellers = new Set(cartItems.map((item) => item.sellerEmail));
    const isMultipleSellers = uniqueSellers.size > 1;

    const number = isMultipleSellers
      ? "01405671742"
      : sellerBkashNumber || "017XXXXXXXX";

    setFinalBkashNumber(number);

    // ✅ Admin Bkash হলে আলাদা ভাবে চিহ্নিত করা
    // if (isMultipleSellers) {
    //   setPaymentMethod("adminBkash");
    // }
    setIsMultipleSellers(isMultipleSellers);
  }, [cartItems, sellerBkashNumber]);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalBkashNumber);
    setCopied(true);

    // Hide the tooltip after 1.5 seconds
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <Toaster
        position="top-center"
        gutter={10}
        containerStyle={{ top: "70px", zIndex: 9999 }}
        reverseOrder={false}
      />

      {loading ? (
        <Loading />
      ) : (
        <>
          <>
            <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
              Checkout
            </h1>

            {/* First Order Discount Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-200 text-blue-900 p-6 rounded-lg mb-8 text-center shadow-md">
              <p className="text-2xl font-bold">
                🎁 Enjoy 10% Off on Your First Purchase!
              </p>
              <p className="text-sm mt-2">
                Unlock your exclusive discount by subscribing to our newsletter.
                This special offer is only available to first-time customers.
              </p>
              <p className="text-sm mt-1 font-medium text-blue-800">
                Sign up today and start saving!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Info Form */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                  <User className="inline-block w-6 h-6 mr-2 text-blue-500" />
                  Shipping Information / শিপিং তথ্য
                </h2>
                <div className="space-y-5">
                  {/* Input Fields except District */}
                  {[
                    {
                      id: "fullName",
                      label: "Full Name / পুরো নাম",
                      icon: <User className="w-5 h-5 text-gray-500" />,
                    },
                    {
                      id: "phone",
                      label: "Phone / ফোন",
                      icon: <Phone className="w-5 h-5 text-gray-500" />,
                    },
                    {
                      id: "email",
                      label: "Email / ইমেইল",
                      type: "email",
                      icon: <Mail className="w-5 h-5 text-gray-500" />,
                    },
                    {
                      id: "address",
                      label: "Address / ঠিকানা",
                      icon: <MapPin className="w-5 h-5 text-gray-500" />,
                    },
                  ].map(({ id, label, type = "text", icon }) => (
                    <div key={id}>
                      <label
                        htmlFor={id}
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        {label}
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-md shadow-sm px-3">
                        {icon}
                        <input
                          id={id}
                          type={type}
                          value={formData[id]}
                          onChange={(e) =>
                            setFormData({ ...formData, [id]: e.target.value })
                          }
                          className="w-full px-3 py-3 focus:outline-none"
                        />
                      </div>
                      {!formData[id] && (
                        <p className="text-xs text-red-500 mt-1">
                          {label} is required.
                        </p>
                      )}
                    </div>
                  ))}

                  {/* City Dropdown */}
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      City / শহর
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md shadow-sm px-3">
                      <Landmark className="w-5 h-5 text-gray-500" />
                      <select
                        id="city"
                        value={formData.city}
                        onChange={handleCityChange}
                        className="w-full px-3 py-3 focus:outline-none bg-transparent"
                      >
                        <option value="">Select a city</option>
                        {cities.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    {!formData.city && (
                      <p className="text-xs text-red-500 mt-1">
                        City is required.
                      </p>
                    )}
                  </div>

                  {/* District Field */}
                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      District / জেলা
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md shadow-sm px-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <input
                        id="district"
                        type="text"
                        value={formData.district}
                        onChange={(e) =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                        className="w-full px-3 py-3 focus:outline-none"
                      />
                    </div>
                    {!formData.district && (
                      <p className="text-xs text-red-500 mt-1">
                        District is required.
                      </p>
                    )}
                  </div>

                  {/* Delivery Note */}
                  <div>
                    <label
                      htmlFor="deliveryNote"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      Delivery Note / ডেলিভারি নির্দেশনা
                    </label>
                    <div className="flex items-start border border-gray-300 rounded-md shadow-sm px-3">
                      <StickyNote className="w-5 h-5 text-gray-500 mt-3" />
                      <textarea
                        id="deliveryNote"
                        rows={4}
                        value={formData.deliveryNote}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deliveryNote: e.target.value,
                          })
                        }
                        className="w-full px-3 py-3 focus:outline-none"
                        placeholder="Any specific instructions about delivery..."
                      />
                    </div>
                    {!formData.deliveryNote && (
                      <p className="text-xs text-red-500 mt-1">
                        Delivery note is required.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                  <ShoppingCart className="inline-block w-6 h-6 mr-2 text-green-600" />
                  Order Summary / অর্ডার সারাংশ
                </h2>

                <div className="space-y-5">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Image
                            src={item.productImages[0]}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover border border-gray-200"
                            unoptimized
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Color:{" "}
                              <span className="capitalize">{item.color}</span> |
                              Size:{" "}
                              <span className="uppercase">{item.size}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-medium text-gray-700">
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
                    <p className="text-gray-500">
                      No items in the cart. / কার্টে কোনো পণ্য নেই।
                    </p>
                  )}
                </div>
                {/* Payment Method Selection */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Payment Method / পেমেন্ট পদ্ধতি
                  </h3>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-blue-600"
                      />
                      Cash on Delivery / ক্যাশ অন ডেলিভারি
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={
                          paymentMethod === "bkash" ||
                          paymentMethod === "adminBkash"
                        }
                        onChange={() =>
                          setPaymentMethod(
                            isMultipleSellers ? "adminBkash" : "bkash"
                          )
                        }
                        className="accent-blue-600"
                      />
                      Bkash Payment / বিকাশ পেমেন্ট
                    </label>
                  </div>

                  {/* Show Bkash Payment Instructions */}
                  {(paymentMethod === "bkash" ||
                    paymentMethod === "adminBkash") && (
                    <div className="mt-4 bg-pink-50 border border-pink-200 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-800 mb-2 leading-6">
                        📲 অনুগ্রহ করে মোট{" "}
                        <span className="font-semibold text-pink-600">
                          ৳{(totalAmount + shippingCost).toFixed(2)}
                        </span>{" "}
                        নিচের বিকাশ নম্বরে{" "}
                        <span className="font-medium">Send Money</span> করুন।
                      </p>

                      {/* Bkash Number + Copy Button */}
                      <div className="flex items-center gap-4 mt-2 relative w-full max-w-md flex-nowrap overflow-x-auto">
                        <p className="text-base font-semibold text-pink-700 whitespace-nowrap">
                          বিকাশ নম্বর:{" "}
                          <span className="tracking-wide">
                            {finalBkashNumber}
                          </span>
                        </p>

                        <button
                          onClick={handleCopy}
                          className={`text-[10px] bg-pink-600 text-white px-3 py-1.5 rounded-md hover:bg-pink-700 transition whitespace-nowrap flex-shrink-0`}
                          title={copied ? "কপি হয়েছে!" : "ক্লিক করে কপি করুন"}
                        >
                          {copied ? "✓ কপি হয়েছে" : "কপি করুন"}
                        </button>
                      </div>

                      {/* Instruction Text */}
                      <p className="text-sm text-gray-600 mt-3 leading-5">
                        📝 পেমেন্ট সম্পন্ন হলে নিচের ঘরে আপনার{" "}
                        <span className="font-medium">Transaction ID</span> দিন।
                        <br />✅ অর্ডার কনফার্ম হওয়ার আগ পর্যন্ত চাইলে একটি
                        স্ক্রিনশট রেখে দিতে পারেন।
                      </p>

                      {/* Transaction ID Input */}
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          আপনার বিকাশ Transaction ID:
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Transaction ID লিখুন"
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-pink-300"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t pt-4 space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Shipping / শিপিং</span>
                    <span>{shippingCost}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total / মোট</span>
                    <span>৳{(totalAmount + shippingCost).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (
                      !formData.fullName ||
                      !formData.phone ||
                      !formData.email ||
                      !formData.address ||
                      !formData.city ||
                      !formData.district ||
                      !formData.deliveryNote
                    ) {
                      toast.error("Please fill out all required fields.");
                      return;
                    }
                    handleOrder();
                  }}
                  className="mt-6 w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order / অর্ডার করুন"}
                </button>
              </div>
            </div>
          </>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
