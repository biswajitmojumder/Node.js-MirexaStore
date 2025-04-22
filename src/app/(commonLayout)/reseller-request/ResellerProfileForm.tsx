"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Image from "next/image";
import { RootState } from "@/app/lib/redux/store";

const ResellerProfileForm = () => {
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
          `https://campus-needs-backend.vercel.app/api/reseller/profile/${email}`
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
      // Keep + if it's there, otherwise assume it's local and add +880
      const cleaned = value.trim();
      const formatted = cleaned.startsWith("+")
        ? cleaned
        : `+880${cleaned.replace(/^0+/, "")}`; // remove leading zeros
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

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

      const response = await axios.post(
        "https://campus-needs-backend.vercel.app/api/reseller/create-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      setSuccessMsg("✅ Profile created successfully!");
      setProfileExists(true);
    } catch (err: any) {
      if (err.response?.data?.message?.includes("slug")) {
        setSuccessMsg(
          "❌ Slug already exists. Please choose a different brand name."
        );
      } else if (
        err.response?.data?.message?.includes("You are not reseller")
      ) {
        setSuccessMsg(
          "❌ You are not a reseller. Please contact support to upgrade your account."
        );
      } else {
        setSuccessMsg("❌ Failed to submit profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo?.user?.email) {
    return <p>Loading user info...</p>;
  }

  if (profileExists) {
    return (
      <div className="mt-10 p-6 border border-green-300 rounded-xl shadow bg-green-50">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          🎉 Your Reseller Profile is Already Submitted!
        </h2>

        <div className="mb-4">
          {form.banner &&
          (form.banner.startsWith("http") || form.banner.startsWith("/")) ? (
            <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-60 rounded-xl overflow-hidden">
              <Image
                src={form.banner}
                alt="Banner"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-gray-200 w-full h-48 rounded-xl flex items-center justify-center text-gray-500">
              No Banner
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          {form.logo &&
          (form.logo.startsWith("http") || form.logo.startsWith("/")) ? (
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
          <div>
            <h3 className="text-xl font-bold">{form.name}</h3>
            <p className="text-sm text-gray-600">{form.tagline}</p>
          </div>
        </div>

        <p className="mb-2 text-gray-700">
          <strong>Description:</strong> {form.description}
        </p>
        <p className="mb-2">
          <strong>Location:</strong> {form.location}
        </p>
        <p className="mb-2">
          <strong>Phone:</strong> {form.phone}
        </p>
        <p className="mb-2">
          <strong>WhatsApp:</strong> {form.whatsapp}
        </p>

        <div className="mt-4 flex space-x-4">
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
    <div className="mt-10 p-6 border border-gray-200 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-orange-600">
        🛍️ Complete Your Reseller Profile
      </h2>

      {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Brand Name", name: "name" },
          { label: "Brand Slug", name: "slug" },
          { label: "Logo URL", name: "logo" },
          { label: "Banner URL", name: "banner" },
          { label: "Tagline", name: "tagline" },
          { label: "Location", name: "location" },
          { label: "Phone Number", name: "phone" },
          { label: "WhatsApp Number", name: "whatsapp" },
          { label: "Facebook", name: "facebook" },
          { label: "Instagram", name: "instagram" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
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
              required={["name", "slug"].includes(field.name)}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-400"
          />
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

export default ResellerProfileForm;
