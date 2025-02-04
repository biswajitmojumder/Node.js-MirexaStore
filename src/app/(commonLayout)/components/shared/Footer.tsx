const Footer = () => {
  return (
    <footer className="bg-[#F85606] text-white py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 text-2xl font-bold">
          <img
            src="../../../favicon.ico"
            alt="MirexaStore Logo"
            className="h-10 w-10"
          />
          MirexaStore
        </div>

        {/* Navigation Links */}
        <nav className="flex gap-6 text-lg font-medium mt-4 md:mt-0">
          <a href="/" className="hover:text-gray-200 transition">
            Home
          </a>
          <a href="/product" className="hover:text-gray-200 transition">
            Product
          </a>
          <a href="/cart" className="hover:text-gray-200 transition">
            Cart
          </a>
          <a href="/add-product" className="hover:text-gray-200 transition">
            Add Product
          </a>
        </nav>

        {/* Social Media Links */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-200 transition">
            <i className="fab fa-facebook text-xl"></i>
          </a>
          <a href="#" className="hover:text-gray-200 transition">
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a href="#" className="hover:text-gray-200 transition">
            <i className="fab fa-instagram text-xl"></i>
          </a>
          <a href="#" className="hover:text-gray-200 transition">
            <i className="fab fa-linkedin text-xl"></i>
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-sm mt-6 border-t border-white/20 pt-4">
        &copy; {new Date().getFullYear()} MirexaStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
