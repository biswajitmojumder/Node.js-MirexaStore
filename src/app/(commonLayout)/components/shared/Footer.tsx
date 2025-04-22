"use client";

import { RootState } from "@/app/lib/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Footer = () => {
  const user = useSelector((state: RootState) => state?.auth?.user);
  const router = useRouter();

  const handleResellerClick = () => {
    if (user?.email) {
      // Logged in → go to reseller page
      router.push("/reseller-request");
    } else {
      // Not logged in → redirect to login
      router.push("/login");
    }
  };

  return (
    <footer className="bg-[#EA580C] text-white pt-10 pb-5">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <Link href="/" className="flex items-center min-w-[160px]">
            <Image
              src="/favicon.ico"
              alt="CampusNeeds Logo"
              width={160}
              height={50}
              className="h-[48px] w-auto object-contain"
              priority
            />
          </Link>
          <p className="text-sm leading-relaxed">
            Your one-stop solution for quality products at the best prices.
            Enjoy seamless shopping experience.
          </p>
        </div>

        {/* Customer Service Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:underline">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:underline">
                Return & Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/product" className="hover:underline">
                Products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:underline">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/add-product" className="hover:underline">
                Add Product
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Reseller */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <p className="text-sm mb-2">📞 +8801405671742</p>
          <p className="text-sm mb-4">✉️ mdeasinsarkar01@gmail.com</p>

          {/* Button click logic based on login status */}
          <button
            onClick={handleResellerClick}
            className="inline-block bg-white text-[#EA580C] font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition mb-4"
          >
            Become a Reseller
          </button>

          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-gray-300 transition"
            >
              {/* Facebook SVG */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.8h2.6l-.4 3h-2.2v7A10 10 0 0 0 22 12z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-gray-300 transition"
            >
              {/* Instagram SVG */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm8 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-gray-300 transition"
            >
              {/* LinkedIn SVG */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 5 2.12 5 3.5zM0 8h5v14H0V8zm7 0h4.7v2h.1c.7-1.3 2.4-2.6 5-2.6 5.3 0 6.3 3.5 6.3 8v9h-5V15.5c0-2.1 0-4.8-3-4.8s-3.4 2.3-3.4 4.6V22H7V8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-white pt-4 text-center text-xs">
        <p>
          &copy; {new Date().getFullYear()} CampusNeeds. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
