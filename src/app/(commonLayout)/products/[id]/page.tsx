"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Type Definitions
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  images: string[];
};

type Review = {
  name: string;
  comment: string;
  rating: number;
};

const ProductDetails = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]); // Store product reviews
  const [newReview, setNewReview] = useState<Review>({
    name: "",
    comment: "",
    rating: 0,
  });

  const params = useParams(); // Get product ID from the URL
  const productId = params.id; // Access dynamic `id` from route params

  // Simulated API call to fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const data: Product = {
        id: 1,
        name: "Product A",
        description: "This is a great product with amazing features.",
        price: "$100",
        stock: 5,
        images: [
          "https://via.placeholder.com/400",
          "https://via.placeholder.com/400",
          "https://via.placeholder.com/400",
        ],
      };
      setProduct(data);
    };

    if (productId) fetchProduct();
  }, [productId]);

  // Submit a new review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || !newReview.rating) {
      alert("Please fill in all fields.");
      return;
    }
    setReviews((prevReviews) => [...prevReviews, newReview]);
    setNewReview({ name: "", comment: "", rating: 0 });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Images */}
        <div>
          <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full object-contain"
            />
          </div>
          <div className="flex mt-4 gap-2">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover border rounded"
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700 my-4">{product.description}</p>
          <p className="text-2xl font-bold text-primary">{product.price}</p>
          <p className="text-sm text-gray-500 mt-2">
            {product.stock > 0
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </p>
          <button
            className="btn btn-primary mt-4"
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="space-y-4 mt-4">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-base-100 shadow-sm"
              >
                <h3 className="font-bold">{review.name}</h3>
                <p className="text-sm text-gray-500">
                  Rating: {review.rating}/5
                </p>
                <p className="mt-2">{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to leave a review!</p>
          )}
        </div>
      </div>

      {/* Add Review Form */}
      <form
        onSubmit={handleReviewSubmit}
        className="mt-6 p-6 border rounded-lg bg-base-100 shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">Write a Review</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={newReview.name}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, name: e.target.value }))
            }
            className="input input-bordered"
            required
          />
          <textarea
            placeholder="Your Review"
            value={newReview.comment}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, comment: e.target.value }))
            }
            className="textarea textarea-bordered"
            required
          />
          <select
            value={newReview.rating}
            onChange={(e) =>
              setNewReview((prev) => ({
                ...prev,
                rating: parseInt(e.target.value),
              }))
            }
            className="select select-bordered"
            required
          >
            <option value={0} disabled>
              Select Rating
            </option>
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Very Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductDetails;
