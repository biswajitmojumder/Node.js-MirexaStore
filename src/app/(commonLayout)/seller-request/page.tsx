"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import axios from "axios";
import Loading from "@/app/loading";
import SellerProfileForm from "./SellerProfileForm";

interface SellerRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  additionalInfo?: string;
  status: "pending" | "approved" | "rejected";
  productType: string;
}
interface Props {
  email: string;
  token: string | null;
}
const SellerRequestPage = () => {
  const userInfo = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: userInfo?.user?.name || "",
    email: userInfo?.user?.email || "",
    phone: userInfo?.user?.phone || "",
    company: "",
    message: "",
    productType: "general", // Default productType
  });

  const [existingRequest, setExistingRequest] = useState<SellerRequest | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      if (!userInfo?.user?._id) {
        setFetching(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://mirexa-store-backend.vercel.app/api/seller-request/my-requests`,
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );

        if (response.data?.data) {
          setExistingRequest(response.data.data[0]); // Assuming the response contains an array
        }
      } catch (error) {
        console.error("Error fetching seller request:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchRequest();
  }, [userInfo?.user?._id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      additionalInfo: formData.message,
      productType: formData.productType,
    };

    console.log("Submitting seller request payload:", payload); // ✅ Log actual payload being sent

    try {
      const response = await axios.post(
        `https://mirexa-store-backend.vercel.app/api/seller-request/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      setExistingRequest(response.data.data); // Assuming the response contains the created request
    } catch (err: any) {
      console.error("Submission Error:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStatusMessage = () => {
    if (!existingRequest) return null;

    switch (existingRequest.status) {
      case "pending":
        return (
          <div className="text-center text-yellow-600 font-medium">
            🕐 Your request is currently <strong>pending</strong>. We’ll contact
            you shortly.
          </div>
        );
      case "approved":
        return (
          <>
            <div className="text-center text-green-700 font-semibold space-y-2">
              <h2 className="text-2xl font-bold">
                🎉 Congratulations, {existingRequest.name}!
              </h2>
              <p>
                You are now an approved <strong>seller</strong> 🛍️
              </p>
              <p>We’ll share resources, tools, and updates soon.</p>
            </div>
            <SellerProfileForm />
          </>
        );
      case "rejected":
        return (
          <div className="text-center text-red-600 font-medium">
            ❌ Sorry, your request was <strong>rejected</strong>. Please contact
            support if you have any concerns.
          </div>
        );
    }
  };

  if (fetching) {
    return <Loading></Loading>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-[#EA580C] mb-6 text-center">
          Become a seller
        </h1>

        {existingRequest ? (
          renderStatusMessage()
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <p className="text-red-500 font-medium text-center">{errorMsg}</p>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-400"
              />
            </div>

            {/* Added Product Type Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Type
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-orange-400"
              >
                <option value="general">General</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home-appliances">Home Appliances</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EA580C] text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellerRequestPage;
