"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import ProductCart from "@/app/(commonLayout)/components/ui/ProductCart";
import ProductCardSkeleton from "@/app/(commonLayout)/components/skeleton/ProductCardSkeleton";
import { Dialog } from "@headlessui/react";
import { Filter, X } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  productImages: string[];
  brand: string;
  category: string;
  stockQuantity: number;
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  status: string;
}

export default function FilterableProductPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryFromURL = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showNewArrival, setShowNewArrival] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // Sync URL category to local state
  useEffect(() => {
    setSelectedCategory(categoryFromURL);
  }, [categoryFromURL]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://api.mirexastore.com/api/product");
        let list: Product[] = res.data.data;

        setBrands([...new Set(list.map((p) => p.brand))]);
        setCategories([...new Set(list.map((p) => p.category))]);

        list = list.filter((p) => {
          const inBrand = selectedBrand ? p.brand === selectedBrand : true;
          const inPrice =
            (p.discountPrice || p.price) >= priceRange[0] &&
            (p.discountPrice || p.price) <= priceRange[1];
          const inStock = onlyInStock ? p.stockQuantity > 0 : true;
          const isFeaturedMatch = showFeatured ? p.isFeatured : true;
          const isNewArrivalMatch = showNewArrival ? p.isNewArrival : true;
          const isActive = p.status === "active";
          const inCategory = selectedCategory
            ? p.category === selectedCategory
            : true;

          return (
            inBrand &&
            inPrice &&
            inStock &&
            isFeaturedMatch &&
            isNewArrivalMatch &&
            inCategory &&
            isActive
          );
        });

        setProducts(list);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
        setCurrentPage(1);
      }
    };

    fetchProducts();
  }, [
    selectedBrand,
    priceRange,
    showFeatured,
    showNewArrival,
    onlyInStock,
    selectedCategory,
  ]);

  const displayed = products.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const totalPages = Math.ceil(products.length / perPage);

  const resetMobile = () => setIsMobileFilterOpen(false);

  const resetFilters = () => {
    setSelectedBrand("");
    setPriceRange([0, 10000]);
    setShowFeatured(false);
    setShowNewArrival(false);
    setOnlyInStock(false);
    setSelectedCategory("");
    setCurrentPage(1);
    router.push("/products");
  };

  const renderFilters = () => (
    <div className="border p-4 rounded space-y-4 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-orange-600 hover:text-orange-800"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Category</p>
        {categories.map((cat) => (
          <label key={cat} className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value={cat}
              checked={selectedCategory === cat}
              onChange={() =>
                router.push(`/products?category=${encodeURIComponent(cat)}`)
              }
            />
            {cat}
          </label>
        ))}
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="category"
            value=""
            checked={selectedCategory === ""}
            onChange={() => router.push("/products")}
          />
          All Categories
        </label>
      </div>

      <div>
        <label className="block font-medium mb-1">Brand</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([
                Math.min(+e.target.value, priceRange[1]),
                priceRange[1],
              ])
            }
            className="w-1/2 p-2 border rounded"
            placeholder="Min"
          />
          <input
            type="number"
            min={priceRange[0]}
            max={10000}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([
                priceRange[0],
                Math.max(+e.target.value, priceRange[0]),
              ])
            }
            className="w-1/2 p-2 border rounded"
            placeholder="Max"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={() => setOnlyInStock(!onlyInStock)}
          />
          In Stock Only
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showFeatured}
            onChange={() => setShowFeatured(!showFeatured)}
          />
          Featured Products
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showNewArrival}
            onChange={() => setShowNewArrival(!showNewArrival)}
          />
          New Arrivals
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 mt-10">
      <div className="lg:hidden mb-4 flex justify-center">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 border px-4 py-2 rounded bg-white shadow-sm hover:shadow-md transition"
        >
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block lg:w-1/4">{renderFilters()}</aside>

        <section className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: perPage }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center py-10 text-gray-500">
              No products found.
            </p>
          ) : (
            <>
              {/* Pagination Info */}
              <div className="mb-4 text-sm text-gray-700 text-center lg:text-left">
                <span className="text-gray-500">Showing</span>{" "}
                <span className="font-medium text-orange-600">
                  {(currentPage - 1) * perPage + 1} –{" "}
                  {Math.min(currentPage * perPage, products.length)}
                </span>{" "}
                <span className="text-gray-500">of</span>{" "}
                <span className="font-medium text-orange-600">
                  {products.length}
                </span>{" "}
                <span className="text-gray-500">products</span>
              </div>

              <ProductCart products={displayed} />

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === i + 1
                          ? "bg-orange-600 text-white"
                          : "bg-white hover:bg-orange-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Dialog
        open={isMobileFilterOpen}
        onClose={resetMobile}
        className="relative z-50 lg:hidden"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded p-6 w-full max-w-sm mx-auto shadow-lg relative">
            <button
              onClick={resetMobile}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <Dialog.Title className="font-semibold mb-4 text-lg">
              Filters
            </Dialog.Title>
            {renderFilters()}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
