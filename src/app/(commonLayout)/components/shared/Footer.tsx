import Image from "next/image";
import Link from "next/link";
import ResellerClientButton from "./FooterCsr";

const FooterSSR = () => {
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

        {/* Customer Service */}
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

        {/* Contact + Client Reseller Button */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <p className="text-sm mb-2">📞 +8801405671742</p>
          <p className="text-sm mb-4">✉️ mdeasinsarkar01@gmail.com</p>

          {/* CLIENT-ONLY BUTTON LOADED SEPARATELY */}
          <ResellerClientButton />

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            {/* Social icons SVG same as before */}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white pt-4 text-center text-xs">
        <p>
          &copy; {new Date().getFullYear()} CampusNeeds. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSSR;
