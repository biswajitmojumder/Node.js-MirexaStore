"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Loading from "@/app/loading";

export type Product = {
  stockQuantity: number;
  stock: number;
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
  const [loading, setLoading] = useState(true); // Loading state

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
    setLoading(true); // Set loading state when navigating to details
    router.push(`/product/${slug}`);
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (
    price: number,
    discountPrice: number
  ) => {
    if (discountPrice && price > discountPrice) {
      return Math.round(((price - discountPrice) / price) * 100);
    }
    return 0;
  };

  // Handle page change (next or previous)
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    // Simulate a delay for loading
    const timer = setTimeout(() => {
      setLoading(false);
    }); // Delay for 1 second to show loading (you can remove this when fetching actual data)

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, [currentPage]); // Re-run whenever the page changes

  return (
    <>
      {loading ? (
        <Loading /> // Display loading component while the data is loading
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="grid text-center grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const discountPercentage = calculateDiscountPercentage(
                  product.price,
                  product.discountPrice || 0
                );

                // Determine stock status
                const stockStatus =
                  product.stockQuantity > 0 ? "In Stock" : "Out of Stock";

                return (
                  <motion.div
                    key={product._id}
                    className="card bg-base-100 shadow-md rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleSeeDetails(product.slug)}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <figure className="flex items-center justify-center overflow-hidden bg-white">
                        {product.productImages?.length > 0 ? (
                          <span>
                            {discountPercentage > 0 && (
                              <span className="absolute top-2 left-2 bg-red-500 z-10 text-white px-3 py-1 text-xs font-semibold rounded-md">
                                {discountPercentage}% Off
                              </span>
                            )}
                            <div className="relative">
                              <Image
                                src={product.productImages[0]}
                                alt={product.name}
                                width={200} // Specify width to prevent layout shift
                                height={200} // Specify height to maintain aspect ratio
                                className="object-contain mx-auto"
                                unoptimized={true}
                              />
                            </div>
                          </span>
                        ) : (
                          <span className="text-3xl font-bold text-gray-500">
                            {product.name[0]}
                          </span>
                        )}
                      </figure>
                      <div className="card-body p-1 lg:p-4 flex flex-col items-start gap-1">
                        <h2 className="card-title text-base lg:text-lg font-medium text-left">
                          {product.name}
                        </h2>

                        {product.brand && (
                          <p className="text-gray-500 text-sm text-left">
                            {product.brand}
                          </p>
                        )}

                        <p className="text-gray-500 text-sm text-left">
                          {product.category}
                        </p>

                        <div className="flex items-center gap-2 text-left">
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

                        {/* Stock status */}
                        <p
                          className={`text-sm font-bold ${
                            product.stockQuantity > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {product.stockQuantity > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
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
      )}
    </>
  );
};

export default ProductCart;
