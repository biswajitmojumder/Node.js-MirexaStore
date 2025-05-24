import React from "react";
import Image from "next/image";
import ShinyText from "../reactbit/ShinyText/ShinyText";

const Banner: React.FC = () => {
  return (
    <div>
      <section className="relative w-full bg-cover bg-center text-white py-20 sm:py-32 px-4">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dwg8d0bfp/image/upload/v1746954223/arrangement-black-friday-shopping-carts-with-copy-space-23-2148667047_hlwc79.jpg"
            alt="MirexaStore Banner"
            fill // ✅ replaces layout="fill"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
            className="object-cover z-0"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300 hover:opacity-70"></div>

        {/* Text Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 animate__animated animate__fadeIn">
            Smart Shopping Starts at MirexaStore
          </h1>

          <p className="text-sm sm:text-lg lg:text-2xl font-light mb-6 sm:mb-8 animate__animated animate__fadeIn animate__delay-1s">
            Discover gadgets, gear, and everyday essentials — all in one trusted
            destination. Enjoy fast delivery, fair prices, and a future-ready
            shopping experience.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6 sm:mb-8">
            <a
              href="/product"
              className="inline-block px-8 sm:px-10 py-4 bg-gradient-to-r from-[#F85606] to-[#E14003] text-white rounded-full text-sm sm:text-xl font-semibold transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <ShinyText
                text="Shop Now"
                disabled={false}
                speed={3}
                className="custom-class"
              />
            </a>
            <a
              href="#"
              className="inline-block px-8 sm:px-10 py-4 border-2 border-white rounded-full text-sm sm:text-xl font-semibold text-white transition-transform transform hover:scale-105 hover:bg-white hover:text-[#F85606]"
            >
              Learn More
            </a>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 sm:gap-6 text-2xl sm:text-3xl">
            <a href="#" className="hover:text-[#F85606]">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-[#F85606]">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-[#F85606]">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;
