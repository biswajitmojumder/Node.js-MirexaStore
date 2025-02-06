import { useState } from "react";

interface Review {
  _id: string;
  userName?: string;
  userId: string;
  timestamp?: string;
  rating: number;
  comment: string;
  likes: string[];
  replies: {
    userId: string;
    comment: string;
    userName: any;
    timestamp: string;
  }[];
}

interface ReviewsSectionProps {
  reviews: Review[];
  onLikeReview: (reviewId: string) => void;
  onReplyReview: (reviewId: string, replyComment: string) => void;
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
  onLikeReview,
  onReplyReview,
}) => {
  const [replyInput, setReplyInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Calculate total reviews, comments, and average rating
  const totalReviews = reviews.length;
  const totalComments = reviews.reduce(
    (acc, review) => acc + review.replies.length,
    0
  );

  // Calculate the average rating
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      : 0;

  const handleSendReply = (reviewId: string) => {
    // Send the reply
    onReplyReview(reviewId, replyInput);

    // Clear the input and close the reply box after sending
    setReplyInput("");
    setReplyingTo(null);
  };

  return (
    <div className="mt-10 w-full px-4 sm:px-6 lg:px-10">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
        Customer Reviews
      </h2>
      <hr />
      {/* Total reviews, comments count, and average rating */}
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

      {reviews.length > 0 ? (
        reviews.map((review) => (
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
                    {review.createdAt ? formatDate(review.createdAt) : "N/A"}
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

            {/* Display Replies */}
            <div className="mt-4 ml-6">
              {review.replies && review.replies.length > 0 ? (
                review.replies.map((reply, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-white">
                      {reply.userId[0] || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{reply.userName}</p>
                      <p className="text-sm text-gray-500">{reply.comment}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(reply.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No replies yet.</p>
              )}
            </div>

            {/* Reply Input Field */}
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
    </div>
  );
};

export default ReviewsSection;
