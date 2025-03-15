"use client";

import { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Here, you can implement the logic to send the form data to your backend, like using an API.
    // For now, we'll simulate a successful submission.

    setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    }, 2000); // Simulate a delay
  };

  return (
    <section className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Contact Us / আমাদের সাথে যোগাযোগ করুন
        </h1>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-800 font-semibold"
                >
                  Name / নাম
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md"
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-800 font-semibold"
                >
                  Email / ইমেইল
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md"
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-800 font-semibold"
                >
                  Message / বার্তা
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md"
                  required
                  rows={5}
                  placeholder="Enter your message"
                />
              </div>

              {formStatus && (
                <div className="mt-4 text-green-600 font-semibold">
                  {formStatus}
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Send Message / বার্তা পাঠান"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
