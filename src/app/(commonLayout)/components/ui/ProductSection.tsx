"use client";

import { useState, useEffect } from "react";

// Type Definitions
type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
};

const ProductSection = () => {
  // State Variables
  const [products, setProducts] = useState<Product[]>([]); // Product data
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [selectedCategory, setSelectedCategory] = useState<string>("all"); // Selected category
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const productsPerPage: number = 8; // Number of products per page

  // Simulated API call to fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const data: Product[] = [
        { id: 1, name: "Product A", category: "Electronics", price: "$100" },
        { id: 2, name: "Product B", category: "Clothing", price: "$50" },
        { id: 3, name: "Product C", category: "Home", price: "$80" },
        { id: 4, name: "Product D", category: "Electronics", price: "$120" },
        { id: 5, name: "Product E", category: "Clothing", price: "$40" },
        { id: 6, name: "Product F", category: "Home", price: "$90" },
        { id: 7, name: "Product G", category: "Electronics", price: "$200" },
        { id: 8, name: "Product H", category: "Clothing", price: "$30" },
        { id: 9, name: "Product I", category: "Home", price: "$70" },
      ];
      setProducts(data);
    };

    fetchProducts();
  }, []);

  // Filter products based on search and category
  const filteredProducts: Product[] = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages: number = Math.ceil(
    filteredProducts.length / productsPerPage
  );
  const displayedProducts: Product[] = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full md:w-1/2"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select select-bordered w-full md:w-1/4"
        >
          <option value="all">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <div
              key={product.id}
              className="card bg-base-100 shadow-md rounded-lg overflow-hidden"
            >
              <figure className="h-40 bg-gray-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-500">
                  {product.name[0]}
                </span>
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-medium">
                  {product.name}
                </h2>
                <p className="text-gray-500">{product.category}</p>
                <p className="text-primary font-bold">{product.price}</p>
              </div>
            </div>
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
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`btn btn-sm ${
                currentPage === index + 1 ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
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

export default ProductSection;
