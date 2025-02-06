"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import axios from "axios";
import ReviewsSection from "./review";

interface Review {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  likes: string[];
  replies: { userId: string; comment: string }[];
}

interface ProductDetailsProps {
  product: {
    data: {
      _id: string;
      name: string;
      description: string;
      price: number;
      stockQuantity: number;
      category: string;
      productImages: string[]; // Array of images
    };
  };
  relatedProducts: {
    data: {
      _id: string;
      name: string;
      price: number;
      productImages: string[]; // Array of images
    }[];
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter(); // Initialize router
  const [cartQuantity, setCartQuantity] = useState(1);
  const [stockQuantity, setStockQuantity] = useState(
    product.data.stockQuantity
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    product.data.productImages[0]
  );
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Fetch reviews for this product
    const fetchReviews = async () => {
      console.log(product.data._id);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/${product.data._id}`
        );
        setReviews(response.data.data);
        console.log("UserId:", response.data.data);
      } catch (error) {
        console.error("Error fetching reviews", error);
      }
    };

    fetchReviews();
  }, [product.data._id]);

  const handleAddToCart = () => {
    if (isLoading) return;
    setIsLoading(true);

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please log in to add items to the cart.");
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user._id;
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      setIsLoading(false);
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingCartItem = cart.find(
      (item: any) =>
        item.productId === product.data._id && item.userId === userId
    );

    if (existingCartItem) {
      toast.info("This product is already in your cart.");
      setIsLoading(false);
      return;
    }

    const cartItem = {
      userId,
      productId: product.data._id,
      quantity: cartQuantity,
      name: product.data.name,
      price: product.data.price,
      stockQuantity,
      productImages: product.data.productImages,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));
    setStockQuantity((prevStock) => prevStock - cartQuantity);
    toast.success("Added to cart!");
    setIsLoading(false);
  };

  const handleBuyNow = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please log in to proceed to checkout.");
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user._id;

    const cartItem = {
      userId,
      productId: product.data._id,
      quantity: cartQuantity,
      name: product.data.name,
      price: product.data.price,
      stockQuantity,
      productImages: product.data.productImages,
    };

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // If cart is empty, create a new one with the selected product
    if (cart.length === 0) {
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      // Otherwise, check if the product is already in the cart
      const existingCartItem = cart.find(
        (item: any) =>
          item.productId === product.data._id && item.userId === userId
      );

      if (existingCartItem) {
        router.push("/cart/checkout");
        return;
      } else {
        // Add the product to the cart if not already present
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    }

    window.dispatchEvent(new Event("cartUpdated"));
    setStockQuantity((prevStock) => prevStock - cartQuantity);
    toast.success("Added to cart!");

    // Redirect to the checkout page
    router.push("/cart/checkout");
  };

  const handleLikeReview = async (reviewId: string) => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      toast.error("Please log in to like a review.");
      return;
    }

    const user = JSON.parse(storedUser);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/reviews/like/${reviewId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Review like/unlike toggled!");
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, likes: response.data.data.likes }
            : review
        )
      );
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
      } else {
        toast.error("Error toggling like for the review.");
      }
      console.error("Error toggling like for the review:", error);
    }
  };

  const handleReplyReview = async (reviewId: string, replyComment: string) => {
    console.log("ReplyComment:", replyComment);

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please log in to reply to a review.");
      return;
    }

    const user = JSON.parse(storedUser);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/reviews/reply/${reviewId}`,
        {
          reply: replyComment,
          userName: user.name, // Add the user's name here
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Replied to the review!");

      // Optimistically update UI
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                replies: [
                  ...review.replies,
                  {
                    userId: user._id,
                    userName: user.name, // Store the user's name here as well
                    comment: replyComment,
                    timestamp: new Date(),
                  },
                ],
              }
            : review
        )
      );
    } catch (error) {
      console.error(
        "Error replying to the review:",
        error.response?.data || error
      );
      toast.error("Error replying to the review. Please try again.");
    }
  };

  return (
    <>
      <div className="product-details pt-5 flex flex-col gap-8 px-4 sm:px-8 lg:px-16">
        <h1 className="text-3xl font-semibold">{product.data.name}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images Gallery */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="w-full mb-4 max-w-[600px]">
                <div className="relative w-full h-80 overflow-hidden rounded-lg shadow-md">
                  <img
                    src={selectedImage}
                    alt={product.data.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              {/* Thumbnails for the Gallery */}
              <div className="flex gap-4 overflow-x-auto">
                {product.data.productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={product.data.name}
                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer border ${
                      selectedImage === image
                        ? "border-orange-600"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(image)} // Update selected image
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2">
            <p className="mt-4 text-lg">{product.data.description}</p>
            <p className="mt-4 text-xl font-semibold">${product.data.price}</p>
            <p className="mt-2 text-gray-600">
              Category: {product.data.category}
            </p>
            <p
              className={`mt-2 text-gray-600 ${
                stockQuantity > 0 ? "" : "text-red-600"
              }`}
            >
              {stockQuantity > 0
                ? `In stock: ${stockQuantity}`
                : "Out of stock"}
            </p>

            {/* Quantity Controls */}
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() =>
                  cartQuantity > 1 && setCartQuantity(cartQuantity - 1)
                }
                className="py-2 px-4 border rounded-md bg-gray-200 hover:bg-gray-300"
                disabled={cartQuantity <= 1}
              >
                -
              </button>
              <span className="text-lg">{cartQuantity}</span>
              <button
                onClick={() =>
                  cartQuantity < stockQuantity &&
                  setCartQuantity(cartQuantity + 1)
                }
                className="py-2 px-4 border rounded-md bg-gray-200 hover:bg-gray-300"
                disabled={cartQuantity >= stockQuantity}
              >
                +
              </button>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex items-center gap-4">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`py-2 px-6 rounded-md transition duration-300 ${
                  stockQuantity === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }`}
                disabled={stockQuantity === 0 || isLoading}
              >
                {isLoading ? "Adding..." : "Add to Cart"}
              </button>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className={`py-2 px-6 rounded-md transition duration-300 ${
                  stockQuantity === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
                disabled={stockQuantity === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <ReviewsSection
          reviews={reviews}
          onLikeReview={handleLikeReview}
          onReplyReview={handleReplyReview}
        ></ReviewsSection>

        {/* Related Products Section */}
        {Array.isArray(relatedProducts.data) &&
          relatedProducts.data.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.data.map((product) => (
                  <div
                    key={product._id}
                    className="border rounded-lg p-4 shadow-md"
                  >
                    <img
                      src={product.productImages[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-lg font-semibold">${product.price}</p>
                    <Link
                      href={`/product/${product._id}`}
                      className="mt-4 inline-block text-blue-600"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
      <ToastContainer />
    </>
  );
};

export default ProductDetails;
