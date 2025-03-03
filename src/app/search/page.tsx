"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "../(commonLayout)/components/shared/Navbar";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  productImages: string[];
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const productsPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/product`);
        const filtered = res.data.data.filter((product: Product) =>
          product.name.toLowerCase().includes(query?.toLowerCase() || "")
        );
        setProducts(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query]);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const displayedProducts = useMemo(
    () =>
      products.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ),
    [products, currentPage]
  );

  const handleSeeDetails = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section>
      <Navbar></Navbar>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Search Results for: &quot;{query}&quot;
        </h2>

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
      </main>
    </section>
  );
};

export default SearchPage;
