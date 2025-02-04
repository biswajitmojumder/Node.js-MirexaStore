"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation purposes
import { useParams } from "next/navigation"; // For dynamic route params
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const EditProductPage = () => {
  const { id } = useParams(); // Use useParams to get the dynamic id from the URL
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // For navigation (redirecting)

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/product/${id}`
          );
          setProduct(response.data.data); // Assuming response data structure
          setLoading(false);
        } catch (err) {
          setError("Error fetching product");
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct: any) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage

    if (!token) {
      setError("Authentication token is missing");
      toast.error("Authentication token is missing!"); // Show error toast
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/product/${id}`, // Your API endpoint
        product, // Product data to update
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );
      toast.success("Product updated successfully!"); // Show success toast
      router.push("/admin/products"); // Redirect after successful update
    } catch (err) {
      setError("Error updating product");
      toast.error("Error updating product!"); // Show error toast
      console.error(err); // Log any additional error details
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            value={product?.name || ""}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
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
            id="price"
            name="price"
            type="number"
            value={product?.price || ""}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
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
            id="category"
            name="category"
            value={product?.category || ""}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Save Changes
        </button>
      </form>

      {/* Add ToastContainer to display toast notifications */}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default EditProductPage;
