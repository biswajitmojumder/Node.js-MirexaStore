"use client";
import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-xl text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="relative flex items-center bg-white p-6 rounded-xl shadow-lg"
                >
                  <button
                    className="absolute top-2 right-2 text-red-600 text-3xl font-bold hover:text-red-700"
                    onClick={() => showConfirmationModal(item.productId)}
                  >
                    &times;
                  </button>

                  <div className="w-28 h-28 bg-gray-200 rounded-lg overflow-hidden">
                    {item.productImages?.length > 0 ? (
                      <img
                        src={item.productImages[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-md text-gray-600 mb-1">
                      Price: ৳{item.price.toFixed(2)}
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
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
                Total Price: ৳{totalPrice.toFixed(2)}
              </p>
              <button
                onClick={handleCheckoutRedirect}
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Checkout
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

      <ToastContainer />
    </div>
  );
};

export default CartPage;
