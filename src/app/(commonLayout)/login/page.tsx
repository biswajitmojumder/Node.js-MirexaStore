"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "@/app/lib/redux/hook";
import { loginUser } from "@/app/lib/redux/features/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const signUpEmail = localStorage.getItem("signUpEmail");
    if (signUpEmail) {
      setEmail(signUpEmail);
      localStorage.removeItem("signUpEmail");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://campus-needs-backend.vercel.app/api/auth/login",
        { email, password }
      );

      const { token, data } = response.data;

      // Redux + LocalStorage save
      dispatch(loginUser({ user: data, token }));

      toast.success("Login successful! Redirecting...", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        const role = data.role;
        router.push("/"); // route based on role
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

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.open(
      "https://campus-needs-backend.vercel.app/api/auth/google",
      "_self"
    );
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
          disabled={true}
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
