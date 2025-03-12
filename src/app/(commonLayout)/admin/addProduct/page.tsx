"use client";

import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";

// ✅ SKU generator
const generateSKU = (slug: string, color: string, size: string) =>
  `${slug}-${color}-${size}`;

// ✅ Interfaces
interface ProductData {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  category: string;
  brand: string;
  videoUrl: string;
}

interface Variant {
  sku: string;
  color: string;
  size: string;
  stock: number;
  price: number;
  images: string[];
}

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    discountPrice: 0,
    stockQuantity: 0,
    category: "",
    brand: "",
    videoUrl: "",
  });

  const [productImages, setProductImages] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);
  const [colors, setColors] = useState<string[]>([""]);
  const [sizes, setSizes] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // ✅ Input Change Handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // ✅ Array Handlers
  const handleArrayChange = (setter: any, index: number, value: string) => {
    setter((prev: string[]) =>
      prev.map((item, idx) => (idx === index ? value : item))
    );
  };
  const addArrayItem = (setter: any) =>
    setter((prev: string[]) => [...prev, ""]);
  const removeArrayItem = (setter: any, index: number) =>
    setter((prev: string[]) => prev.filter((_, idx) => idx !== index));

  // ✅ Variant Handling
  const handleVariantChange = (color: string, size: string) => {
    const sku = generateSKU(productData.slug, color, size);
    if (!variants.some((v) => v.color === color && v.size === size)) {
      setVariants((prev) => [
        ...prev,
        { sku, color, size, stock: 0, price: productData.price, images: [] },
      ]);
    }
  };

  const updateVariantField = (
    color: string,
    size: string,
    field: keyof Variant,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.color === color && variant.size === size
          ? { ...variant, [field]: value }
          : variant
      )
    );
  };

  // ✅ Form Reset
  const resetForm = () => {
    setProductData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      discountPrice: 0,
      stockQuantity: 0,
      category: "",
      brand: "",
      videoUrl: "",
    });
    setProductImages([""]);
    setTags([""]);
    setColors([""]);
    setSizes([""]);
    setFeatures([""]);
    setVariants([]);
    setIsFeatured(false);
    setIsNewArrival(false);
  };

  // ✅ Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...productData,
      productImages,
      tags,
      colors,
      sizes,
      features,
      isFeatured,
      isNewArrival,
      variants,
    };
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/product", finalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("✅ Product added successfully!");
      resetForm();
    } catch (err) {
      toast.error("❌ Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render Fields
  const renderInputField = (
    label: string,
    name: keyof ProductData,
    type = "text"
  ) => (
    <div>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={productData[name]}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
    </div>
  );

  const renderArrayField = (label: string, state: string[], setter: any) => (
    <div>
      <label>{label}</label>
      {state.map((val, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            value={val}
            onChange={(e) => handleArrayChange(setter, idx, e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button type="button" onClick={() => removeArrayItem(setter, idx)}>
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(setter)}
        className="bg-gray-200 px-3 py-1 rounded"
      >
        Add {label}
      </button>
    </div>
  );

  // ✅ Variants Render
  const renderVariants = () =>
    colors.flatMap((color) =>
      sizes.map((size) => (
        <div key={`${color}-${size}`} className="border p-4 my-2 rounded-lg">
          <h4 className="font-bold">
            {color} - {size}
          </h4>
          <div className="flex gap-4 items-center">
            <input
              value={generateSKU(productData.slug, color, size)}
              disabled
              className="p-2 border rounded w-full"
            />
            <button
              type="button"
              onClick={() => handleVariantChange(color, size)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Variant
            </button>
          </div>
          {variants.some((v) => v.color === color && v.size === size) && (
            <div className="mt-2 grid grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Stock"
                onChange={(e) =>
                  updateVariantField(
                    color,
                    size,
                    "stock",
                    Number(e.target.value)
                  )
                }
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                onChange={(e) =>
                  updateVariantField(
                    color,
                    size,
                    "price",
                    Number(e.target.value)
                  )
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Images (comma separated)"
                onChange={(e) =>
                  updateVariantField(
                    color,
                    size,
                    "images",
                    e.target.value.split(",")
                  )
                }
                className="p-2 border rounded"
              />
            </div>
          )}
        </div>
      ))
    );

  // ✅ Return Form
  return (
    <div className="p-6">
      <ToastContainer />
      {loading && <Loading />}
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderInputField("Product Name", "name")}
        {renderInputField("Slug", "slug")}
        {renderInputField("Description", "description")}
        {renderInputField("Price", "price", "number")}
        {renderInputField("Discount Price", "discountPrice", "number")}
        {renderInputField("Stock Quantity", "stockQuantity", "number")}
        {renderInputField("Category", "category")}
        {renderInputField("Brand", "brand")}
        {renderInputField("Video URL", "videoUrl")}
        {renderArrayField("Product Images", productImages, setProductImages)}
        {renderArrayField("Tags", tags, setTags)}
        {renderArrayField("Colors", colors, setColors)}
        {renderArrayField("Sizes", sizes, setSizes)}
        {renderArrayField("Features", features, setFeatures)}
        {renderVariants()}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
