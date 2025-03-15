"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

interface Review {
  updatedAt: string;
  createdAt: string;
  _id: string;
  userName?: string;
  userId: {
    _id: string;
    name: string;
  };
  timestamp?: string;
  rating: number;
  comment: string;
  likes: string[];
  replies: {
    _id: string;
    userId: string;
    comment: string;
    userName: string;
    timestamp: string;
    isEditing: boolean;
  }[];
}

interface ReviewsSectionProps {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  onLikeReview: (reviewId: string) => void;
  onReplyReview: (reviewId: string, replyComment: string) => void;
  onDeleteReply: (reviewId: string, replyId: string) => void;
  onUpdateReply: (
    reviewId: string,
    replyId: string,
    updatedReply: string
  ) => void;
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

  const currentReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const [replyInput, setReplyInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Calculate total reviews, comments, and average rating
  const totalReviews = reviews.length;
  const totalComments = reviews.reduce(
    (acc, review) => acc + review.replies.length,
    0
  );
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      : 0;

  const handleSendReply = (reviewId: string) => {
    if (replyInput.trim()) {
      onReplyReview(reviewId, replyInput);
      setReplyInput(""); // Reset input field after submitting
      setReplyingTo(null); // Reset replying state

      // Save scroll position before page reload

      window.location.reload();
    } else {
      toast.warn("Please enter a reply before sending.");
    }
  };

  const handleDeleteReply = (reviewId: string, replyId: string) => {
    onDeleteReply(reviewId, replyId);
    const updatedReviews = reviews.map((review) => {
      if (review._id === reviewId) {
        review.replies = review.replies.filter(
          (reply) => reply._id !== replyId
        );
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  const handleEditReply = async (
    reviewId: string,
    replyId: string,
    newComment: string
  ) => {
    // Check if replyId is undefined or null before proceeding
    if (!replyId) {
      console.error("Reply ID is missing or undefined!");
      toast.error("Reply ID is missing or undefined!");
      return;
    }

    // Check if reviewId is undefined or null before proceeding
    if (!reviewId) {
      console.error("Review ID is missing or undefined!");
      toast.error("Review ID is missing or undefined!");
      return;
    }

    console.log("Updating reply with:", { reviewId, replyId, newComment });

    try {
      console.log(
        `Making PUT request to: /api/reviews/edit-reply/${reviewId}/${replyId}`
      );

      const response = await axios.put(
        `/api/reviews/edit-reply/${reviewId}/${replyId}`,
        { updatedComment: newComment }
      );

      console.log("Response from server:", response.data);

      const updatedReviews = reviews.map((review) => {
        if (review._id === reviewId) {
          review.replies = review.replies.map((reply) => {
            if (reply._id === replyId) {
              reply.comment = newComment;
            }
            return reply;
          });
        }
        return review;
      });

      setReviews(updatedReviews);
      toast.success("Reply updated successfully!");
    } catch (err) {
      const error = err as AxiosError<any>;
      console.error(
        "Failed to update reply:",
        error.response?.data || error.message
      );
      toast.error("Failed to update reply.");
    }
  };

  return (
    <div className="mt-10 w-full px-4 sm:px-6 lg:px-10">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
        Customer Reviews
      </h2>
      <hr />
      <div className="mb-8 text-center pt-3">
        <h3 className="text-2xl font-semibold text-gray-800">
          Customer Feedback Overview
        </h3>
        <p className="text-lg text-gray-700 mt-4">
          Total Reviews: {totalReviews} | Total Comments: {totalComments}
        </p>
        <p className="text-xl font-semibold text-yellow-500 mt-2">
          Average Rating: {averageRating.toFixed(1)} ★
        </p>
      </div>

      {currentReviews.length > 0 ? (
        currentReviews.map((review) => (
          <div
            key={review._id}
            className="w-full bg-white border rounded-lg shadow-md p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white">
                  {review.userName?.[0] || "?"}
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {review.userId.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {review.createdAt ? formatDate(review.updatedAt) : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={
                      index < review.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3">{review.comment}</p>
            <div className="mt-4 flex items-center space-x-6">
              <button
                onClick={() => onLikeReview(review._id)}
                className="text-blue-600 hover:text-blue-800"
              >
                👍 {review.likes.length}
              </button>
              <button
                onClick={() =>
                  setReplyingTo(replyingTo === review._id ? null : review._id)
                }
                className="text-green-600 hover:text-green-800"
              >
                💬 Reply
              </button>
            </div>

            <div className="mt-4 ml-6">
              {review.replies.length > 0 ? (
                review.replies.map((reply) => (
                  <div
                    key={reply._id}
                    className="flex items-center justify-between bg-gray-100 m-1 p-3 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
                        {reply.userName?.[0] || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {reply.userName}
                        </p>
                        {reply.isEditing ? (
                          <div className="mt-2">
                            <input
                              value={reply.comment}
                              onChange={(e) => {
                                reply.comment = e.target.value;
                              }}
                              className="w-full p-2 border rounded-md"
                            />
                            <button
                              onClick={() =>
                                handleEditReply(
                                  review._id,
                                  reply._id,
                                  reply.comment
                                )
                              }
                              className="bg-blue-600 text-white px-4 py-2 mt-2"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700">
                            {reply.comment}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDate(reply.timestamp)}
                        </p>
                      </div>
                    </div>

                    {reply.userId === loggedInUser._id && (
                      <div className="flex space-x-2">
                        {/* <button
                          onClick={() => {
                            reply.isEditing = !reply.isEditing;
                            setReviews([...reviews]);
                          }}
                          className="ml-auto text-yellow-500 hover:text-yellow-700"
                        >
                          ✎ Edit
                        </button> */}
                        <button
                          onClick={() =>
                            handleDeleteReply(review._id, reply._id)
                          }
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-500 hover:text-red-700 transition-all duration-200 ease-in-out"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 3a1 1 0 011-1h4a1 1 0 011 1v1h5a1 1 0 110 2h-1.1l-1.28 13.022A2 2 0 0114.64 20H9.36a2 2 0 01-1.98-1.978L6.1 6H5a1 1 0 110-2h5V3zM8.1 6l1.2 12h5.4l1.2-12H8.1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No replies yet.</p>
              )}
            </div>

            {replyingTo === review._id && (
              <div className="mt-4 flex items-center">
                <input
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  onClick={() => handleSendReply(review._id)}
                  className="bg-green-600 text-white px-4 py-2"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="btn btn-sm btn-outline"
        >
          Previous
        </button>

        {currentPage > 3 && (
          <>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <span className="btn btn-sm btn-outline">...</span>
          </>
        )}

        {Array.from(
          { length: Math.min(3, totalPages) },
          (_, index) => currentPage - 1 + index
        )
          .filter((page) => page > 0 && page <= totalPages)
          .map((page) => (
            <button
              key={page}
              className={`btn btn-sm ${
                currentPage === page ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

        {currentPage < totalPages - 2 && (
          <>
            <span className="btn btn-sm btn-outline">...</span>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          className="btn btn-sm btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewsSection;
