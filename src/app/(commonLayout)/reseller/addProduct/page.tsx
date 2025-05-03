"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import WithAuth from "@/app/lib/utils/withAuth";

// SKU generator
const generateSKU = (slug: string, color: string, size: string) =>
  `${slug}-${color}-${size}`;

// Slug generator
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

// Interfaces
interface ProductData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  materials: string;
  careInstructions: string;
  specifications: string;
  additionalInfo: string;
  weight: number;
  warranty: string;
  sellerEmail: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  category: string;
  brand: string;
  videoUrl: string;
  type: "own" | "affiliate";
  affiliateLink?: string;
}

interface Variant {
  sku: string;
  color: string;
  size: string;
  stock: number;
  price: number;
  images: string[];
}

// 🌟 Cloudinary Upload Function
const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "campus-needs-upload"); // ✅ Your upload preset

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dwg8d0bfp/image/upload`, // ✅ Your cloud name in URL
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url; // eta hocche upload hoye jawa image er URL
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    materials: "",
    careInstructions: "",
    specifications: "",
    additionalInfo: "",
    weight: 0,
    warranty: "",
    sellerEmail: "",
    price: 0,
    discountPrice: 0,
    stockQuantity: 0,
    category: "",
    brand: "",
    videoUrl: "",
    type: "own",
  });

  const [productImages, setProductImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([""]);
  const [colors, setColors] = useState<string[]>([""]);
  const [sizes, setSizes] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!slugEdited) {
      setProductData((prev) => ({
        ...prev,
        slug: generateSlug(prev.name),
      }));
    }
  }, [productData.name, slugEdited]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "slug") setSlugEdited(true);
    setProductData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleArrayChange = (setter: any, index: number, value: string) => {
    setter((prev: string[]) =>
      prev.map((item, idx) => (idx === index ? value : item))
    );
  };

  const addArrayItem = (setter: any) =>
    setter((prev: string[]) => [...prev, ""]);

  const removeArrayItem = (setter: any, index: number) =>
    setter((prev: string[]) => prev.filter((_, idx) => idx !== index));

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

  const resetForm = () => {
    setProductData({
      name: "",
      slug: "",
      description: "",
      longDescription: "",
      materials: "",
      careInstructions: "",
      specifications: "",
      additionalInfo: "",
      weight: 0,
      warranty: "",
      sellerEmail: "",
      price: 0,
      discountPrice: 0,
      stockQuantity: 0,
      category: "",
      brand: "",
      videoUrl: "",
      type: "own",
    });
    setProductImages([]);
    setTags([""]);
    setColors([""]);
    setSizes([""]);
    setFeatures([""]);
    setVariants([]);
    setIsFeatured(false);
    setIsNewArrival(false);
    setSlugEdited(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sellerEmail = user?.email || "";
    const sellerName = user?.name || "";
    const sellerNumber = user?.phone || 0;

    const finalData = {
      ...productData,
      type: productData.affiliateLink ? "affiliate" : "own",
      productImages,
      tags,
      colors,
      sizes,
      features,
      isFeatured,
      isNewArrival,
      variants,
      sellerEmail,
      sellerName,
      sellerNumber,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        "https://campus-needs-backend.vercel.app/api/product",
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("✅ Product added successfully!");
        resetForm();
      } else {
        throw new Error("Failed to add product.");
      }
    } catch (err: any) {
      console.error("Error adding product:", err);
      if (err.response && err.response.status === 400) {
        toast.error(
          `❌ ${err.response.data.message || "Slug already exists."}`
        );
      } else {
        toast.error("❌ Failed to add product.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🌟 Updated Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setLoading(true);
    try {
      const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setProductImages((prev) => [...prev, ...uploadedUrls]);
      toast.success("✅ Images uploaded!");
    } catch (error) {
      toast.error("❌ Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    name: keyof ProductData,
    type = "text"
  ) => (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={productData[name] === 0 ? "" : productData[name]}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const renderArrayField = (label: string, state: string[], setter: any) => (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-700">{label}</label>
      {label === "Product Images" ? (
        <>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {state.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Uploaded Preview"
                className="w-24 h-24 object-cover rounded-md border"
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {state.map((val, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                value={val}
                onChange={(e) => handleArrayChange(setter, idx, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(setter, idx)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(setter)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
          >
            Add {label}
          </button>
        </>
      )}
    </div>
  );

  const renderVariants = () =>
    colors.flatMap((color) =>
      sizes.map((size) => (
        <div
          key={`${color}-${size}`}
          className="border p-6 my-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
        >
          <h4 className="font-bold text-xl">
            {color} - {size}
          </h4>
          <div className="flex gap-4 items-center">
            <input
              value={generateSKU(productData.slug, color, size)}
              disabled
              className="p-3 border border-gray-300 rounded-md w-full"
            />
            <button
              type="button"
              onClick={() => handleVariantChange(color, size)}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
            >
              Add Variant
            </button>
          </div>
          {variants.some((v) => v.color === color && v.size === size) && (
            <div className="mt-4 grid grid-cols-3 gap-4">
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
                className="p-3 border border-gray-300 rounded-md"
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
                className="p-3 border border-gray-300 rounded-md"
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
                className="p-3 border border-gray-300 rounded-md"
              />
            </div>
          )}
        </div>
      ))
    );

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <ToastContainer />
      {loading && <Loading />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center text-2xl font-semibold text-gray-800">
          Add Product
        </div>
        {renderInputField("Product Name", "name")}
        {renderInputField("Slug (Editable)", "slug")}
        {renderInputField("Description", "description")}
        {renderInputField("Long Description", "longDescription")}
        {renderInputField("Materials", "materials")}
        {renderInputField("Care Instructions", "careInstructions")}
        {renderInputField("Specifications", "specifications")}
        {renderInputField("Additional Info", "additionalInfo")}
        {renderInputField("Weight", "weight", "number")}
        {renderInputField("Warranty", "warranty")}
        {renderInputField("Price", "price")}
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
        {renderInputField("Affiliate Link", "affiliateLink")}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
            />
            New Arrival
          </label>
        </div>
        <h3 className="text-lg font-semibold mt-6 text-gray-800">
          Variants (Color + Size)
        </h3>
        {renderVariants()}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default function ProtectedPage() {
  return (
    <WithAuth requiredRoles={["reseller"]}>
      <AddProduct />
    </WithAuth>
  );
}
