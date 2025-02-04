"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      reviews: { rating: number; comment: string }[];
    };
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const {
    _id: productId,
    name,
    description,
    price,
    stockQuantity: initialStockQuantity,
    category,
    productImages,
    reviews,
  } = product.data;

  const [cartQuantity, setCartQuantity] = useState(1);
  const [newRating, setNewRating] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [updatedReviews, setUpdatedReviews] = useState(reviews);
  const [stockQuantity, setStockQuantity] = useState(initialStockQuantity);

  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleAddToCart = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user._id;
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingCartItem = cart.find(
      (item: any) => item.productId === productId && item.userId === userId
    );

    if (existingCartItem) {
      toast.info("This product is already in your cart.");
      return;
    }

    const cartItem = {
      userId,
      productId,
      quantity: cartQuantity,
      name,
      price,
      stockQuantity,
      productImages,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    setStockQuantity((prevStock) => prevStock - cartQuantity);

    refreshPage();
  };

  const handleBuyNow = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      toast.error("Please log in to buy this product.");
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user._id;
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingCartItem = cart.find(
      (item: any) => item.productId === productId && item.userId === userId
    );

    if (existingCartItem) {
      toast.info("This product is already in your cart.");
      window.location.href = "/cart/checkout";
      return;
    }

    const cartItem = {
      userId,
      productId,
      quantity: cartQuantity,
      name,
      price,
      productImages,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/cart/checkout";
  };

  return (
    <>
      <div className="product-details pt-5 flex flex-col gap-8 px-4 sm:px-8 lg:px-16">
        <h1 className="text-3xl font-semibold">{name}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="flex flex-wrap gap-4 justify-center">
              {productImages?.length > 0 ? (
                productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={name}
                    className="w-48 h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                  />
                ))
              ) : (
                <p>No images available for this product.</p>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <p className="mt-4 text-lg">{description}</p>
            <p className="mt-4 text-xl font-semibold">${price}</p>
            <p className="mt-2 text-gray-600">Category: {category}</p>
            <p
              className={`mt-2 text-gray-600 ${
                stockQuantity > 0 ? "" : "text-red-600"
              }`}
            >
              {stockQuantity > 0
                ? `In stock: ${stockQuantity}`
                : "Out of stock"}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                className="py-2 px-6 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-300"
                disabled={stockQuantity === 0}
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="py-2 px-6 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-300"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ProductDetails;
