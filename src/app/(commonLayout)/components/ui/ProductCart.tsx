/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation"; // For navigation
import { motion } from "framer-motion";

// Type Definitions
export type Product = {
  _id: string; // Using _id as unique identifier instead of id
  name: string;
  category: string;
  price: string;
  productImages: string[]; // Array of image URLs
};

type ProductSectionProps = {
  products: Product[];
  categories: string[]; // Categories passed from the backend
};

const ProductCart = ({ products, categories }: ProductSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 8;
  const router = useRouter(); // Router for navigation

  // Ensure categories and products are not empty
  if (!products || !Array.isArray(products)) {
    return <p>Invalid products data.</p>;
  }

  // Filter products based on selected category
  const filteredProducts: Product[] =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Pagination logic
  const totalPages: number = Math.ceil(
    filteredProducts.length / productsPerPage
  );
  const displayedProducts: Product[] = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ),
    [filteredProducts, currentPage]
  );

  // Navigate to the product details page
  const handleSeeDetails = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Category Filter Section */}
      <div className="flex justify-end mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select select-bordered w-full md:w-1/4"
        >
          <option value="all">All Categories</option>
          {categories &&
            categories.length > 0 &&
            categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    className="w-full h-full object-cover" // Ensures image fills the container
                    style={{ maxHeight: "150px", maxWidth: "150px" }} // Fixed max height and width
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
                <p className="text-gray-500">{product.category}</p>
                <p className="text-[#F85606] font-bold">৳{product.price}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
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

export default ProductCart;
