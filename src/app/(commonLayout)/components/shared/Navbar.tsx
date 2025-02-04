import Link from "next/link";
import SearchBar from "./Navbar/SearchBar";
import ProfileDropdown from "./Navbar/ProfileDropDown";
import CartButton from "./Navbar/CartButton";
import ThemeSwitch from "./Navbar/ThemeSwitch";

const Navbar = () => {
  return (
    <header className="bg-[#F85606] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-3 py-2 lg:py-3">
        {/* Left Section: Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 lg:gap-2 text-2xl font-bold text-white"
        >
          <img
            src="/favicon.ico"
            alt="MirexaStore Logo"
            className="h-10 w-10"
          />
          <span className=" text-lg lg:text-2xl">MirexaStore</span>
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
          <Link
            href="/add-product"
            className="text-white hover:text-gray-200 transition"
          >
            Add Product
          </Link>
        </nav>

        {/* Right Section: Search, Theme, Cart, Profile */}
        <div className="flex items-center gap-2">
          <SearchBar />

          {/* Theme Toggle */}
          <ThemeSwitch />

          {/* Cart Button Styled & Positioned before Profile */}
          <CartButton />

          {/* Profile Icon Moved to the Right */}
          <div className="ml-auto">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
