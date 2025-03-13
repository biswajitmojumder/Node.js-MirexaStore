"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  brand?: string;
  productImages: string[];
  slug: string;
};

type ProductCartProps = {
  products: Product[]; // All products passed from the parent
};

const ProductCart = ({ products }: ProductCartProps) => {
  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Number of products to display per page

  // Calculate the index of the first and last product on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Total number of pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Navigate to product details
  const handleSeeDetails = (slug: string) => {
    router.push(`/product/${slug}`);
  };

  // Handle page change (next or previous)
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid text-center grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <motion.div
              key={product._id}
              className="card bg-base-100 shadow-md rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleSeeDetails(product.slug)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <figure className="flex items-center justify-center overflow-hidden bg-white">
                {product.productImages?.length > 0 ? (
                  <img
                    src={product.productImages[0]}
                    alt={product.name}
                    className="w-full h-auto object-contain max-h-[200px] mx-auto"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-500">
                    {product.name[0]}
                  </span>
                )}
              </figure>
              <div className="card-body p-1 lg:p-4 flex flex-col items-center gap-1">
                <h2 className="card-title text-base lg:text-lg font-medium text-center">
                  {product.name}
                </h2>

                {product.brand && (
                  <p className="text-gray-500 text-sm">{product.brand}</p>
                )}

                <p className="text-gray-500 text-sm">{product.category}</p>

                <div className="flex items-center gap-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-[#F85606] font-bold">
                        ৳{product.discountPrice}
                      </span>
                      <span className="line-through text-gray-400 text-sm">
                        ৳{product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-[#F85606] font-bold">
                      ৳{product.price}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>

      {/* ✅ Pagination Controls */}
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

          {/* First Page and Ellipsis */}
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

          {/* Page Numbers */}
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

          {/* Ellipsis and Last Page */}
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
