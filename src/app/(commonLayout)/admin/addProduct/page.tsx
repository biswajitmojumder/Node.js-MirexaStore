"use client";

import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [productImages, setProductImages] = useState<string[]>(["", ""]); // Default to two empty URLs
  const [loading, setLoading] = useState(false); // Manage loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productImages.some((image) => image.trim() === "")) {
      toast.error("Please provide valid image URLs for both images!");
      return;
    }

    const productData = {
      name,
      description,
      price,
      stockQuantity,
      category,
      productImages,
    };

    setLoading(true); // Set loading to true when the request starts

    try {
      const response = await axios.post(
        "http://localhost:5000/api/product", // Update with your actual endpoint
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product!");
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after the request ends
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedImages = [...productImages];
    updatedImages[index] = e.target.value;
    setProductImages(updatedImages);
  };

  return (
    <div className="container mx-auto p-6">
      {loading && <Loading />}{" "}
      {/* Show the loading animation when loading is true */}
      <h1 className="text-3xl font-semibold mb-6 text-center">Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="name"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded w-full"
            placeholder="Enter product name"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded w-full"
            placeholder="Enter product description"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="price"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="p-2 border border-gray-300 rounded w-full"
            placeholder="Enter product price"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="stockQuantity"
          >
            Stock Quantity
          </label>
          <input
            type="number"
            id="stockQuantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(Number(e.target.value))}
            required
            className="p-2 border border-gray-300 rounded w-full"
            placeholder="Enter stock quantity"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="category"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded w-full"
            placeholder="Enter product category"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="productImages"
          >
            Product Image URLs
          </label>

          <div className="space-y-2">
            {productImages.map((image, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(e, index)}
                  className="p-2 border border-gray-300 rounded w-full"
                  placeholder={`Enter image URL ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mt-4 hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
