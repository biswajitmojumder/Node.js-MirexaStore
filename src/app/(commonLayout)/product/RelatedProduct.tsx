"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation"; // For navigation
import { motion } from "framer-motion";

// Type Definitions
export type Product = {
  _id: string; // Using _id as unique identifier instead of id
  name: string;
  price: string;
  productImages: string[]; // Array of image URLs
};

type RelatedProductProps = {
  relatedProducts: Product[];
};

const RelatedProduct = ({ relatedProducts }: RelatedProductProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 4; // Show only 4 products at a time
  const router = useRouter(); // Router for navigation

  // Ensure products are not empty
  if (!relatedProducts || !Array.isArray(relatedProducts)) {
    return <p>Invalid related products data.</p>;
  }

  // Pagination logic
  const totalPages: number = Math.ceil(
    relatedProducts.length / productsPerPage
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const displayedProducts: Product[] = useMemo(
    () =>
      relatedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ),
    [relatedProducts, currentPage]
  );

  // Navigate to the product details page
  const handleSeeDetails = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Related Products Grid */}
      <h1 className="text-3xl pb-10 lg:pl-5 font-semibold">Related Product</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <motion.div
              key={product._id} // Use _id as the unique key for each product
              className="card bg-base-100 shadow-md rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleSeeDetails(product._id)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <figure className="h-40 flex items-center justify-center overflow-hidden">
                {/* Display the first image if available */}
                {product.productImages && product.productImages.length > 0 ? (
                  <img
                    src={product.productImages[0]} // Display the first image
                    alt={product.name}
                    className="w-full h-full object-cover"
                    style={{ maxHeight: "150px", maxWidth: "150px" }}
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-500">
                    {product.name[0]}
                  </span>
                )}
              </figure>
              <div className="card-body p-4 flex flex-col items-center">
                <h2 className="card-title text-lg font-medium">
                  {product.name}
                </h2>
                <p className="text-[#F85606] font-bold">৳{product.price}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No related products found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {/* Previous Button */}
          <button
            className="btn btn-sm btn-outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          {/* Page Number Buttons */}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1} // Ensure unique key for pagination buttons
              className={`btn btn-sm ${
                currentPage === index + 1 ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            className="btn btn-sm btn-outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default RelatedProduct;
