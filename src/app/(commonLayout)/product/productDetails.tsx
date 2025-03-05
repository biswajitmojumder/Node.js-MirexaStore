"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import ReviewsSection from "./review";
import FloatingIcons from "../components/ui/FloatingIcons";

interface Review {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  likes: string[];
  replies: { _id: string; userId: string; comment: string }[]; // Add _id for replies
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
      productImages: string[];
    };
  };
  relatedProducts: {
    data: {
      _id: string;
      name: string;
      price: number;
      productImages: string[];
    }[];
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter();
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
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/${product.data._id}`
        );
        setReviews(response.data.data);
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

    if (cart.length === 0) {
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      const existingCartItem = cart.find(
        (item: any) =>
          item.productId === product.data._id && item.userId === userId
      );

      if (existingCartItem) {
        router.push("/cart/checkout");
        return;
      } else {
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    }

    window.dispatchEvent(new Event("cartUpdated"));
    setStockQuantity((prevStock) => prevStock - cartQuantity);
    toast.success("Added to cart!");

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
    }
  };

  const handleReplyReview = async (reviewId: string, replyComment: string) => {
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
          userName: user.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Replied to the review!");

      // Fetch reviews again after the reply is successfully sent
      fetchReviews();

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                replies: [
                  ...review.replies,
                  {
                    userId: user._id,
                    userName: user.name,
                    comment: replyComment,
                    timestamp: new Date(),
                  },
                ],
              }
            : review
        )
      );
    } catch (error) {
      toast.error("Error replying to the review. Please try again.");
    }
  };

  // Fetch reviews function (you can place this in the component itself or a separate file)
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reviews/${product}`
      );
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const handleDeleteReply = async (reviewId: string, replyId: string) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/reviews/delete-reply/${reviewId}/${replyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Reply deleted successfully!");

      setReviews((prevReviews) => {
        return prevReviews.map((review) => {
          if (review._id === reviewId) {
            review.replies = review.replies.filter(
              (reply) => reply._id !== replyId
            );
          }
          return review;
        });
      });
    } catch (error) {
      toast.error("Error deleting the reply. Please try again.");
    }
  };

  const onUpdateReply = (
    reviewId: string,
    replyId: string,
    updatedComment: string
  ) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === reviewId
          ? {
              ...review,
              replies: review.replies.map((reply) =>
                reply._id === replyId
                  ? { ...reply, comment: updatedComment }
                  : reply
              ),
            }
          : review
      )
    );
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
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xl font-semibold text-orange-600">
                  ৳ {product.data.price}
                </span>
                <span className="ml-4 text-lg text-gray-500">
                  {product.data.stockQuantity} in stock
                </span>
              </div>
              <p className="text-base text-gray-700">
                {product.data.description}
              </p>

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center">
                <span className="mr-4">Quantity:</span>
                <input
                  type="number"
                  value={cartQuantity}
                  min="1"
                  max={stockQuantity}
                  onChange={(e) => setCartQuantity(parseInt(e.target.value))}
                  className="w-20 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || stockQuantity <= 0}
                  className={`w-full py-3 bg-orange-600 text-white font-semibold rounded-md ${
                    isLoading || stockQuantity <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isLoading ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isLoading || stockQuantity <= 0}
                  className={`w-full mt-4 py-3 bg-green-600 text-white font-semibold rounded-md ${
                    isLoading || stockQuantity <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isLoading ? "Processing..." : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <h3 className="text-2xl font-semibold mb-4">Product Reviews</h3>
        <ReviewsSection
          reviews={reviews}
          setReviews={setReviews}
          onLikeReview={handleLikeReview}
          onReplyReview={handleReplyReview}
          onDeleteReply={handleDeleteReply}
          onUpdateReply={onUpdateReply}
        />
      </div>

      <ToastContainer />
      <FloatingIcons />
    </>
  );
};

export default ProductDetails;
