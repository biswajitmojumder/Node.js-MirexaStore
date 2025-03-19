"use client"; // Ensure this runs on the client-side

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import Next.js router
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Google login state
  const router = useRouter(); // Initialize Next.js router

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, data } = response.data;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", data.role); // Store user role

      toast.success("Login successful! Redirecting...", {
        position: "top-center",
        autoClose: 2000,
      });

      // Redirect user based on their role
      setTimeout(() => {
        const role = data.role; // Get role from the logged-in user
        if (role === "admin") {
          router.push("/"); // Admin Dashboard
        } else {
          router.push("/"); // User Dashboard
        }
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-4 text-center text-orange-600">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition duration-200"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition duration-200"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {isGoogleLoading ? "Redirecting..." : "Login with Google"}
        </button>
      </div>

      <div className="mt-4 text-center">
        <a href="/register" className="text-sm text-blue-600 hover:underline">
          Don&apos;t have an account? Sign Up
        </a>
      </div>

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default Login;
