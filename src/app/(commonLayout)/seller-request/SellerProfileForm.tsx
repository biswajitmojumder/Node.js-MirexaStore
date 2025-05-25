"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Image from "next/image";
import { RootState } from "@/app/lib/redux/store";
import {
  Store,
  Tag,
  MapPin,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  FileText,
  Image as ImageIcon,
  Link2,
  FileImage,
  AlignLeft,
} from "lucide-react";

const SellerProfileForm = () => {
  const userInfo = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: "",
    banner: "",
    tagline: "",
    description: "",
    location: "",
    phone: "",
    whatsapp: "",
    socialLinks: {
      facebook: "",
      instagram: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = userInfo?.user?.email;
        if (!email) return;

        const res = await axios.get(
          `https://mirexa-store-backend.vercel.app/api/seller/profile/${email}`
        );

        const brand = res.data?.data?.brand;
        if (brand) {
          setForm({
            ...brand,
            socialLinks: {
              facebook: brand.socialLinks?.facebook || "",
              instagram: brand.socialLinks?.instagram || "",
            },
            whatsapp: brand.whatsapp || "",
            phone: brand.phone || "",
          });
          setProfileExists(true);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfileExists(false);
      }
    };

    fetchProfile();

    if (userInfo?.user?.phone) {
      setForm((prev) => ({ ...prev, phone: userInfo?.user?.phone }));
    }
  }, [userInfo]);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else if (["facebook", "instagram"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: value,
        },
      }));
    } else if (name === "whatsapp") {
      const cleaned = value.trim();
      const formatted = cleaned.startsWith("+")
        ? cleaned
        : `+880${cleaned.replace(/^0+/, "")}`;
      setForm((prev) => ({
        ...prev,
        whatsapp: formatted,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "campus-needs-upload");
      formData.append("folder", "seller-profile-images");
      formData.append("cloud_name", "dwg8d0bfp");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dwg8d0bfp/image/upload",
        formData
      );

      const originalUrl = res.data.secure_url;
      const optimizedUrl = originalUrl.replace(
        "/upload/",
        "/upload/q_auto:eco,f_auto,w_800/"
      );

      setForm((prev) => ({
        ...prev,
        [field]: optimizedUrl,
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    if (!form.logo || !form.banner) {
      setSuccessMsg("❌ Please upload both logo and banner.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        userEmail: userInfo?.user?.email,
        brand: {
          name: form.name,
          slug: form.slug,
          logo: form.logo,
          banner: form.banner,
          tagline: form.tagline,
          description: form.description,
          location: form.location,
          phone: form.phone,
          whatsapp: form.whatsapp,
          socialLinks: {
            facebook: form.socialLinks.facebook,
            instagram: form.socialLinks.instagram,
          },
        },
      };

      // 🔍 Log the payload before submitting
      console.log("📤 Submitting Seller Profile Payload:");
      console.log(JSON.stringify(payload, null, 2));

      const response = await axios.post(
        "https://mirexa-store-backend.vercel.app/api/seller/create-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      console.log("✅ Response:", response.data);

      setSuccessMsg("✅ Profile created successfully!");
      setProfileExists(true);
    } catch (err: any) {
      console.error("❌ Submission Error:", err?.response?.data || err.message);

      if (err.response?.data?.message?.includes("slug")) {
        setSuccessMsg(
          "❌ Slug already exists. Please choose a different name."
        );
      } else if (err.response?.data?.message?.includes("You are not seller")) {
        setSuccessMsg(
          "❌ You are not a seller. Please contact support to upgrade."
        );
      } else {
        setSuccessMsg("❌ Failed to submit profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo?.user?.email) {
    return (
      <p className="text-center py-10 text-gray-500">Loading user info...</p>
    );
  }

  if (profileExists) {
    return (
      <div className="mt-10 p-4 sm:p-6 border border-green-300 rounded-xl shadow bg-green-50 max-w-4xl mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-green-700">
          🎉 Your Seller Profile is Already Submitted!
        </h2>

        <div className="mb-4">
          {form.banner ? (
            <div className="relative w-full h-40 sm:h-60 md:h-72 lg:h-80 rounded-xl overflow-hidden">
              <Image
                src={form.banner}
                alt="Banner"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-gray-200 w-full h-40 rounded-xl flex items-center justify-center text-gray-500">
              No Banner
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          {form.logo ? (
            <Image
              src={form.logo}
              alt="Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
          ) : (
            <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center text-gray-500">
              No Logo
            </div>
          )}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold">{form.name}</h3>
            <p className="text-sm text-gray-600">{form.tagline}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm sm:text-base text-gray-700">
          <p>
            <strong>Description:</strong> {form.description}
          </p>
          <p>
            <strong>Location:</strong> {form.location}
          </p>
          <p>
            <strong>Phone:</strong> {form.phone}
          </p>
          <p>
            <strong>WhatsApp:</strong> {form.whatsapp}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {form.socialLinks.facebook && (
            <a
              href={form.socialLinks.facebook}
              target="_blank"
              className="text-blue-600 font-medium hover:underline"
            >
              Facebook
            </a>
          )}
          {form.socialLinks.instagram && (
            <a
              href={form.socialLinks.instagram}
              target="_blank"
              className="text-pink-600 font-medium hover:underline"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 p-4 sm:pt-6  mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange-600">
        🛍️ Complete Your Seller Profile
      </h2>

      {successMsg && (
        <p className="text-green-600 font-medium mb-4">{successMsg}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          {
            label: "Brand Name",
            name: "name",
            icon: <Store className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "Brand Slug",
            name: "slug",
            icon: <Link2 className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "Tagline",
            name: "tagline",
            icon: <Tag className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "Location",
            name: "location",
            icon: <MapPin className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "Phone Number",
            name: "phone",
            icon: <Phone className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "WhatsApp Number",
            name: "whatsapp",
            icon: <MessageCircle className="w-4 h-4 mr-1 text-orange-500" />,
          },
          {
            label: "Facebook",
            name: "facebook",
            icon: <Facebook className="w-4 h-4 mr-1 text-blue-600" />,
          },
          {
            label: "Instagram",
            name: "instagram",
            icon: <Instagram className="w-4 h-4 mr-1 text-pink-600" />,
          },
        ].map((field) => {
          const isRequired = [
            "name",
            "slug",
            "tagline",
            "location",
            "phone",
            "whatsapp",
          ].includes(field.name);

          return (
            <div key={field.name}>
              <label className="flex items-center text-sm font-medium mb-1">
                {field.icon}
                {field.label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name={field.name}
                value={
                  ["facebook", "instagram"].includes(field.name)
                    ? form.socialLinks[field.name as "facebook" | "instagram"]
                    : (form as any)[field.name]
                }
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-400"
                required={isRequired}
              />
            </div>
          );
        })}

        <div>
          <label className="flex items-center text-sm font-medium mb-1 text-gray-700">
            <AlignLeft className="w-4 h-4 mr-1 text-orange-500" />
            Description<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            name="description"
            rows={3}
            required
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-400"
          />
        </div>

        {/* Upload Logo with icon */}
        <div>
          <label className="flex items-center text-sm font-medium mb-1 text-gray-700">
            <ImageIcon className="w-4 h-4 mr-1 text-orange-500" />
            Upload Logo<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "logo")}
            className="mb-2"
            required
          />
          {form.logo && (
            <Image
              src={form.logo}
              alt="Logo Preview"
              width={100}
              height={100}
              className="rounded"
            />
          )}
        </div>

        {/* Upload Banner with icon */}
        <div>
          <label className="flex items-center text-sm font-medium mb-1 text-gray-700">
            <FileImage className="w-4 h-4 mr-1 text-orange-500" />
            Upload Banner<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "banner")}
            className="mb-2"
            required
          />
          {form.banner && (
            <div className="relative w-full h-32 sm:h-40 mt-2 rounded overflow-hidden">
              <Image
                src={form.banner}
                alt="Banner Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default SellerProfileForm;
