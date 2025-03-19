"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";

const EditProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/product/details/${id}`
          );
          setProduct(response.data.data);
          setLoading(false);
        } catch (err) {
          setError("Error fetching product");
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct: any) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct: any) => {
      const updatedVariants = [...prevProduct.variants];
      updatedVariants[index] = { ...updatedVariants[index], [name]: value };
      return {
        ...prevProduct,
        variants: updatedVariants,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Authentication token is missing");
      toast.error("Authentication token is missing!");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/product/${id}`, product, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (err) {
      setError("Error updating product");
      toast.error("Error updating product!");
      console.error(err);
    }
  };

  if (loading) return <Loading></Loading>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Name */}
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

        {/* Description */}
        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product?.description || ""}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        {/* Price */}
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

        {/* Stock Quantity */}
        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="stockQuantity"
          >
            Stock Quantity
          </label>
          <input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            value={product?.stockQuantity || ""}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        {/* Category */}
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

        {/* Tags */}
        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="tags"
          >
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            value={product?.tags.join(", ") || ""}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            placeholder="Enter tags separated by commas"
          />
        </div>

        {/* Variants */}
        {product?.variants?.map((variant: any, index: number) => (
          <div key={variant._id} className="mb-4">
            <h2 className="text-lg font-semibold text-gray-600">
              Variant {index + 1}
            </h2>

            <label
              className="block text-sm font-semibold text-gray-600"
              htmlFor={`variantColor-${index}`}
            >
              Color
            </label>
            <input
              id={`variantColor-${index}`}
              name="color"
              value={variant.color}
              onChange={(e) => handleArrayChange(e, index)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />

            <label
              className="block text-sm font-semibold text-gray-600"
              htmlFor={`variantSize-${index}`}
            >
              Size
            </label>
            <input
              id={`variantSize-${index}`}
              name="size"
              value={variant.size}
              onChange={(e) => handleArrayChange(e, index)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />

            <label
              className="block text-sm font-semibold text-gray-600"
              htmlFor={`variantPrice-${index}`}
            >
              Price
            </label>
            <input
              id={`variantPrice-${index}`}
              name="price"
              type="number"
              value={variant.price}
              onChange={(e) => handleArrayChange(e, index)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />

            <label
              className="block text-sm font-semibold text-gray-600"
              htmlFor={`variantStock-${index}`}
            >
              Stock
            </label>
            <input
              id={`variantStock-${index}`}
              name="stock"
              type="number"
              value={variant.stock}
              onChange={(e) => handleArrayChange(e, index)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>
        ))}

        {/* Product Images */}
        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="productImages"
          >
            Product Images (comma-separated URLs)
          </label>
          <input
            id="productImages"
            name="productImages"
            value={product?.productImages.join(", ") || ""}
            onChange={(e) => handleChange(e)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            placeholder="Enter image URLs separated by commas"
          />
        </div>

        {/* Is Featured */}
        <div className="mb-4">
          <label
            className="block text-sm font-semibold text-gray-600"
            htmlFor="isFeatured"
          >
            Is Featured
          </label>
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            checked={product?.isFeatured || false}
            onChange={(e) => handleChange(e)}
            className="mt-1"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Save Changes
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default EditProductPage;
