"use client";
import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation"; // Corrected import for client-side navigation

type CartItem = {
  userId: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  stockQuantity: number;
  productImages: string[]; // Add productImages field
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const router = useRouter(); // Now using the correct hook for client-side navigation

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
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        const userCart = parsedCart.filter(
          (item: CartItem) => item.userId === userId
        );

        // Assuming you have a backend endpoint to fetch product data, including images
        // Here we will use product data from local storage or from an API
        const updatedCartItems = userCart.map((cartItem: CartItem) => ({
          ...cartItem,
        }));

        setCartItems(updatedCartItems);
      } else {
        toast.error("No cart data found.");
      }
    } catch (error) {
      console.error("Error parsing cart data:", error);
      toast.error("Something went wrong while fetching cart data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQuantityChange = useCallback(
    async (id: string, delta: number) => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        setLoading(false);
        return;
      }

      const updatedCartItem = cartItems.find((item) => item.productId === id);
      if (!updatedCartItem) return;

      const newQuantity = Math.max(1, updatedCartItem.quantity + delta);
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.productId === id ? { ...item, quantity: newQuantity } : item
        );

        // Immediately update the localStorage after updating the state
        localStorage.setItem("cart", JSON.stringify(updatedItems));
        return updatedItems;
      });

      toast.success("Quantity updated successfully!");
      setLoading(false);
    },
    [cartItems]
  );

  const handleRemoveItem = useCallback(
    async (id: string) => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const updatedCart = cartItems.filter((item) => item.productId !== id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        toast.success("Item removed from cart!");
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        console.error("Error removing item:", error);
        toast.error("Something went wrong while removing item.");
      } finally {
        setLoading(false);
      }
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Shopping Cart
        </h1>
        {cartItems.length === 0 ? (
          <p className="text-xl text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="relative flex items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <button
                    className="absolute top-2 right-2 text-red-600 text-3xl font-semibold hover:text-red-700 focus:outline-none transition duration-200 transform hover:scale-110"
                    onClick={() => showConfirmationModal(item.productId)}
                  >
                    &times;
                  </button>

                  <div className="w-28 h-28 bg-gray-200 rounded-lg">
                    {/* Display product images */}
                    {Array.isArray(item.productImages) &&
                    item.productImages.length > 0 ? (
                      <img
                        src={item.productImages[0]}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-6 flex-1">
                    <h2 className="text-xl font-medium text-gray-800 mb-2">
                      {item.name}
                    </h2>
                    <p className="text-lg text-gray-600">
                      ${item.price ? item.price.toFixed(2) : "0.00"}
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                        onClick={() => handleQuantityChange(item.productId, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Total Price: ${totalPrice.toFixed(2)}
              </p>
              <button
                onClick={handleCheckoutRedirect}
                className="w-full py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to remove this item?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={() => handleConfirmation(showConfirmation, true)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => handleConfirmation(showConfirmation, false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CartPage;
