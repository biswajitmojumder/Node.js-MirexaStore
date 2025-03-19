"use client";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Testimonial {
  createdAt: string;
  userName: string;
  review: string;
  image: string;
  rating: number;
  date: string;
}

const Testimonials: FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reviewsPerPage] = useState<number>(6); // Show 6 reviews per page
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://mirexa-store-backend.vercel.app/api/reviews/all?page=${currentPage}&limit=${reviewsPerPage}`
        );

        console.log("Backend Response:", response.data);

        const reviews = response.data.data.map((review: any) => ({
          userName: review.userName || "Anonymous", // Default name if not available
          review: review.comment,
          image: generateFallbackImage(review.userName), // Generate dynamic SVG based on user name
          rating: review.rating,
          createdAt: new Date(review.createdAt).toLocaleDateString("en-US"),
        }));

        setTestimonials(reviews);
        setTotalReviews(response.data.totalReviews); // Assuming the backend sends the total number of reviews
        setTotalPages(response.data.totalPages); // Set the total pages
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage]);

  // Function to generate dynamic SVG based on user name
  const generateFallbackImage = (userName: string) => {
    const letter = userName ? userName.charAt(0).toUpperCase() : "U"; // Use 'U' for undefined or empty name
    return `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9Im5vbmUiPgogPHJlY3QgY3g9IjEyIiBjeT0iOCIg
    cj0iNCIgc3Ryb2tlPSIjN0YzRjY2MyIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjRjNGNEY2NiIvPgogPHRleHQgeD0iNTMiIHk9IjUwIiBmb250LXNpemU9IjM1IiBmb250LWZhbWlseT0iQXJpYWwgTW90byIgZmlsbD0iIzZkYjcwMCI+${letter}</text>`;
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        What Our Customers Say
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow-lg p-4 rounded-lg"
          >
            <div className="flex items-center mb-4">
              <Image
                src={testimonial.image}
                alt={testimonial.userName}
                width={64} // 16 * 4 = 64px
                height={64}
                className="rounded-full mr-4"
              />
              <div>
                <h2 className="font-semibold text-lg truncate">
                  {testimonial.userName}
                </h2>
                <p className="text-yellow-400">
                  {"★".repeat(testimonial.rating)}
                </p>
                <p className="text-sm text-gray-500">{testimonial.createdAt}</p>
              </div>
            </div>
            <p className="text-gray-600 line-clamp-3">{testimonial.review}</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="btn btn-sm btn-outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
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
            className="btn btn-sm btn-outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
