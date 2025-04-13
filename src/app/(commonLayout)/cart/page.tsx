"use client";
import { useState, useEffect, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

type CartItem = {
  userId: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  stockQuantity?: number;
  productImages: string[];
  color?: string;
  size?: string;
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [quantityUpdated, setQuantityUpdated] = useState<boolean>(false); // State to track quantity update
  const router = useRouter();

  const handleCheckoutRedirect = () => {
    router.push("/cart/checkout");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      toast.error("Authentication token or user data missing. Please log in.");
      return;
    }

    try {
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;
      setUserId(userId);
      fetchCartData(userId);
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("Invalid user data. Please log in again.");
    }
  }, []);

  const fetchCartData = useCallback(async (userId: string) => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      const userCart = parsedCart.filter(
        (item: CartItem) => item.userId === userId
      );
      setCartItems(userCart);
    } else {
      toast.error("No cart data found.");
    }
  }, []);

  const handleQuantityChange = useCallback(
    (id: string, delta: number) => {
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.productId === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        );

        // Set the updated items in localStorage
        setTimeout(() => {
          localStorage.setItem("cart", JSON.stringify(updatedItems));
        }, 0); // Set with a small delay to prevent multiple updates

        // Trigger quantity updated flag
        setQuantityUpdated(true); // Mark that quantity was updated

        return updatedItems;
      });
    },
    [] // Ensure this callback doesn't change unnecessarily
  );

  const handleRemoveItem = useCallback(
    (id: string) => {
      const updatedCart = cartItems.filter((item) => item.productId !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      toast.success("Item removed from cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    },
    [cartItems]
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const showConfirmationModal = (id: string) => {
    setShowConfirmation(id);
  };

  const handleConfirmation = (id: string, confirm: boolean) => {
    if (confirm) {
      handleRemoveItem(id);
    }
    setShowConfirmation(null);
  };

  // Show toast success notification after quantity update
  useEffect(() => {
    if (quantityUpdated) {
      toast.success("Quantity updated successfully!");
      setQuantityUpdated(false); // Reset the state after showing the toast
    }
  }, [quantityUpdated]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-center"
        gutter={10}
        containerStyle={{ top: "70px", zIndex: 9999 }}
        reverseOrder={false}
      />

      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          🛒 Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <Image
              src="https://i.ibb.co.com/whX10JvN/download-removebg-preview.png"
              alt="Empty Cart"
              width={192}
              height={192}
              className="opacity-80"
            />
            <h2 className="text-2xl font-semibold text-gray-700 mt-4">
              Your Shopping Cart is Empty
            </h2>
            <p className="text-gray-500 mt-2">
              {"Looks like you haven't added anything yet."}
            </p>
            <a
              href="/product"
              className="mt-6 px-6 py-2 bg-[#EA580C] text-white rounded-md hover:bg-[#c2490b] transition duration-300"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="relative flex items-center bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                >
                  <button
                    className="absolute top-3 right-3 text-red-600 text-2xl font-bold hover:text-red-700"
                    onClick={() => showConfirmationModal(item.productId)}
                  >
                    &times;
                  </button>

                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                    {item.productImages?.length > 0 ? (
                      <Image
                        src={item.productImages[0]}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">
                      Price:{" "}
                      <span className="font-semibold">
                        ৳{item.price.toFixed(2)}
                      </span>
                    </p>
                    {item.color && (
                      <p className="text-sm text-gray-500">
                        Color: <span className="capitalize">{item.color}</span>
                      </p>
                    )}
                    {item.size && (
                      <p className="text-sm text-gray-500">
                        Size: <span className="uppercase">{item.size}</span>
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-3">
                      <button
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                        onClick={() => handleQuantityChange(item.productId, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-20">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Order Summary
              </h3>
              <div className="text-lg text-gray-700 mb-6 flex justify-between">
                <span>Total:</span>
                <span className="font-semibold text-orange-600">
                  ৳{totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckoutRedirect}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Remove this item from cart?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleConfirmation(showConfirmation, true)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => handleConfirmation(showConfirmation, false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
