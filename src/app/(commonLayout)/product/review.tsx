"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

interface Reply {
  _id: string;
  userId: string;
  comment: string;
  userName: string;
  timestamp: string;
  isEditing: boolean;
}

interface Review {
  updatedAt: string;
  createdAt: string;
  _id: string;
  userName?: string;
  userId: {
    _id: string;
    name: string;
  };
  timestamp: string;
  rating: number;
  comment: string;
  likes: string[];
  replies: Reply[];
}

interface ReviewsSectionProps {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  onLikeReview: (reviewId: string) => void;
  onReplyReview: (reviewId: string, replyComment: string) => void;
  onDeleteReply: (reviewId: string, replyId: string) => void;
  onUpdateReply: (reviewId: string, replyId: string, updatedReply: string) => void;
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  setReviews,
  onLikeReview,
  onReplyReview,
  onDeleteReply,
  onUpdateReply,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // Dynamic ratings calculation based on reviews
  const calculateRatingDistribution = () => {
    const ratingCounts: Record<1 | 2 | 3 | 4 | 5, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      // Assert review.rating as a valid key of ratingCounts
      const rating = review.rating as 1 | 2 | 3 | 4 | 5; 
      ratingCounts[rating]++;
    });
    return ratingCounts;
  };
  

  const ratings = calculateRatingDistribution();

  const currentReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const [replyInput, setReplyInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<{ _id: string; name: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user._id) {
        setLoggedInUser(user);
      }
    }
  }, []);

  const totalReviews = reviews.length;
  const totalComments = reviews.reduce(
    (acc, review) => acc + review.replies.length,
    0
  );
  const averageRating = totalReviews
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
    : 0;

  const handleSendReply = (reviewId: string) => {
    if (replyInput.trim()) {
      onReplyReview(reviewId, replyInput);
      setReplyInput("");
      setReplyingTo(null);
    } else {
      toast.warn("Please enter a reply before sending.");
    }
  };

  const handleDeleteReply = (reviewId: string, replyId: string) => {
    onDeleteReply(reviewId, replyId);
    const updatedReviews = reviews.map((review) => {
      if (review._id === reviewId) {
        return {
          ...review,
          replies: review.replies.filter((reply) => reply._id !== replyId),
        };
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  const handleEditReply = async (reviewId: string, replyId: string, newComment: string) => {
    if (!reviewId || !replyId) {
      toast.error("Review ID or Reply ID is missing!");
      return;
    }

    try {
      await axios.put(`/api/reviews/edit-reply/${reviewId}/${replyId}`, {
        updatedComment: newComment,
      });

      const updatedReviews = reviews.map((review) => {
        if (review._id === reviewId) {
          return {
            ...review,
            replies: review.replies.map((reply) =>
              reply._id === replyId ? { ...reply, comment: newComment } : reply
            ),
          };
        }
        return review;
      });

      setReviews(updatedReviews);
      toast.success("Reply updated successfully!");
    } catch (err) {
      const error = err as AxiosError<any>;
      console.error(error.response?.data || error.message);
      toast.error("Failed to update reply.");
    }
  };

  return (
    <div className="mt-10 w-full px-4 sm:px-6 lg:px-10">
      <div className="py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Customer Reviews</h2>

        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

            {/* Average Rating */}
            <div className="text-center">
              <p className="text-5xl font-bold text-yellow-400">{averageRating.toFixed(1)}</p>
              <p className="text-xl text-gray-700 mt-2">out of 5</p>
              <div className="flex justify-center mt-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className={`w-6 h-6 ${index < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.367 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.65 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-2">
                {totalReviews} Reviews | {totalComments} Comments
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block border-r border-gray-200"></div>

            {/* Rating Breakdown */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const starCount = ratings[star as 1 | 2 | 3 | 4 | 5] || 0;
                const percentage = totalReviews ? (starCount / totalReviews) * 100 : 0;

                return (
                  <div key={star} className="flex items-center space-x-3">
                    <span className="w-6 text-sm font-medium">{star}★</span>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full"
                        style={{ width: `${percentage}%`, transition: "width 0.5s ease-in-out" }}
                      ></div>
                    </div>
                    <span className="w-8 text-sm text-gray-700">{starCount}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Review Cards */}
      {currentReviews.length > 0 ? (
        currentReviews.map((review) => (
          <div key={review._id} className="w-full bg-white border rounded-lg shadow-md p-6 mb-6">
            {/* Review header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white">
                  {review.userName?.[0] || "?"}
                </div>
                <div>
                  <p className="text-lg font-semibold">{review.userId.name || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">{review.createdAt ? formatDate(review.updatedAt) : "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className={index < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                ))}
              </div>
            </div>

            <p className="mt-3">{review.comment}</p>

            {/* Like and Reply buttons */}
            <div className="mt-4 flex items-center space-x-6">
              <button onClick={() => onLikeReview(review._id)} className="text-blue-600 hover:text-blue-800">
                👍 {review.likes.length}
              </button>
              <button onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)} className="text-green-600 hover:text-green-800">
                💬 Reply
              </button>
            </div>

            {/* Replies */}
            <div className="mt-4 ml-6">
              {review.replies.length > 0 ? (
                review.replies.map((reply) => (
                  <div key={reply._id} className="flex items-center justify-between bg-gray-100 m-1 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
                        {reply.userName?.[0] || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{reply.userName}</p>
                        <p className="text-sm text-gray-700">{reply.comment}</p>
                        <p className="text-xs text-gray-500">{formatDate(reply.timestamp)}</p>
                      </div>
                    </div>

                    {reply.userId === loggedInUser?._id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteReply(review._id, reply._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No replies yet.</p>
              )}
            </div>

            {/* Reply input */}
            {replyingTo === review._id && (
              <div className="mt-4 flex items-center">
                <input
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button onClick={() => handleSendReply(review._id)} className="bg-green-600 text-white px-4 py-2">
                  Send
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        ""
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="btn btn-sm btn-outline">
          Previous
        </button>
        <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className="btn btn-sm btn-outline">
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewsSection;
