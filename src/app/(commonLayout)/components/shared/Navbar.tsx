import Link from "next/link";
import SearchBar from "./Navbar/SearchBar";
import ProfileDropdown from "./Navbar/ProfileDropDown";
import CartButton from "./Navbar/CartButton";
import Image from "next/image";
import ClickSparkWrapper from "../reactbit/ClickSparkWrapper/ClickSparkWrapper";

const Navbar = () => {
  return (
    <ClickSparkWrapper>
      {" "}
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
          <nav className="hidden md:flex gap-10 text-lg  items-center">
            {[
              { href: "/", label: "Home" },
              { href: "/product", label: "Product" },
              { href: "/cart", label: "Cart" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="relative text-white hover:text-gray-200 transition-all duration-300 ease-in-out group"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
              </Link>
            ))}
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
    </ClickSparkWrapper>
  );
};

export default Navbar;
