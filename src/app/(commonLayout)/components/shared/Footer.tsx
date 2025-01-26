import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold mb-4 md:mb-0">
          <Link href="/">MyStore</Link>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          {/* New Footer Links */}
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link
            href="https://facebook.com"
            target="_blank"
            aria-label="Facebook"
          >
            <FaFacebook className="text-2xl hover:text-gray-300" />
          </Link>
          <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
            <FaTwitter className="text-2xl hover:text-gray-300" />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            aria-label="Instagram"
          >
            <FaInstagram className="text-2xl hover:text-gray-300" />
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-2xl hover:text-gray-300" />
          </Link>
        </div>
      </div>

      {/* Footer Bottom Text */}
      <div className="mt-8 text-center text-sm text-gray-300">
        &copy; {new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
