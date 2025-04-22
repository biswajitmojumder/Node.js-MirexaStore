import Link from "next/link";
import SearchBar from "./Navbar/SearchBar";
import ProfileDropdown from "./Navbar/ProfileDropDown";
import CartButton from "./Navbar/CartButton";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="bg-[#F85606] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-2 py-2 lg:py-3">
        {/* Left Section: Logo */}
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

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8 text-lg font-medium">
          <Link href="/" className="text-white hover:text-gray-200 transition">
            Home
          </Link>
          <Link
            href="/product"
            className="text-white hover:text-gray-200 transition"
          >
            Product
          </Link>
          <Link
            href="/cart"
            className="text-white hover:text-gray-200 transition"
          >
            Cart
          </Link>
        </nav>

        {/* Right Section: Search, Cart, Profile */}
        <div className="flex items-center gap-2">
          <SearchBar />
          <CartButton />
          <div className="ml-auto">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
