"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MailIcon, CheckCircleIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email!");
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/newsletter/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setEmail("");
        toast.success(data.message || "Subscribed successfully!");
      } else {
        toast.error(data.message || "Failed to subscribe!");
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* ✅ Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative bg-white py-16 px-6 sm:px-10 rounded-3xl shadow-xl my-12 overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <MailIcon className="w-12 h-12 mx-auto mb-4 text-[#F85606]" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">
            Join Our Newsletter
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-gray-600">
            Subscribe now and get <span className="font-bold">10% OFF</span>{" "}
            your first order! 🎉 Stay updated with our latest offers.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:w-2/3 px-5 py-3 rounded-full border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F85606] shadow-sm"
            />
            <button
              type="submit"
              className="bg-[#F85606] hover:bg-orange-600 transition-colors text-white px-8 py-3 rounded-full font-semibold shadow-md"
            >
              Subscribe
            </button>
          </form>

          {success && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-green-600 text-lg flex justify-center items-center gap-2"
            >
              <CheckCircleIcon className="w-5 h-5" /> Thanks for subscribing!
            </motion.p>
          )}
        </motion.div>

        {/* Optional Decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-0 left-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
        ></motion.div>
      </motion.section>
    </>
  );
}
