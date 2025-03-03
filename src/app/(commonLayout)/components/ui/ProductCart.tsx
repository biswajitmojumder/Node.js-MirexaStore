"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export type Product = {
  _id: string;
  name: string;
  category: string;
  price: string;
  productImages: string[];
};

type ProductSectionProps = {
  products: Product[];
  categories: string[];
};

const ProductCart = ({ products, categories }: ProductSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const productsPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    // Load search query from localStorage
    const storedQuery = localStorage.getItem("searchQuery") || "";
    setSearchQuery(storedQuery);
  }, []);

  // Filter products based on selected category
  const filteredProductsByCategory: Product[] =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Filter products based on search query from localStorage
  const filteredProducts: Product[] = filteredProductsByCategory.filter(
    (product) =>
      product.name &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid text-center grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <motion.div
              key={product._id}
              className="card bg-base-100 shadow-md rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleSeeDetails(product._id)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <figure className="flex items-center justify-center overflow-hidden">
                {product.productImages && product.productImages.length > 0 ? (
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
              <div className="card-body p-1 lg:p-4 flex flex-col items-center">
                <h2 className="card-title text-base lg:text-lg font-medium">
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
          <button
            className="btn btn-sm btn-outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          {/* First page and ellipsis if needed */}
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

          {/* Page numbers around the current page */}
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

          {/* Ellipsis and last page if needed */}
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
    </main>
  );
};

export default ProductCart;
