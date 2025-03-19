"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image"; // Import Image from next/image

const Banner = () => {
  const images = [
    "https://i.ibb.co.com/mLcnZG3/arrangement-black-friday-shopping-carts-with-copy-space-23-2148667047.jpg",
    "https://i.ibb.co.com/DgzxfvS9/download.jpg",
    "https://i.ibb.co.com/Ng6ZfZ3b/toy-shopping-cart-with-boxes-credit-card-with-copy-space-339191-197.jpg",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [images.length]); // Added images.length as a dependency

  return (
    <div>
      <section className="relative w-full bg-cover bg-center text-white py-20 sm:py-32 px-4">
        {/* Using Image component here */}
        <div className="absolute inset-0">
          <Image
            src={images[currentImageIndex]}
            alt="Banner Image"
            layout="fill"
            objectFit="cover"
            className="z-0"
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300 hover:opacity-75"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 animate__animated animate__fadeIn">
            Discover Excellence at MirexaStore
          </h1>
          <p className="text-sm sm:text-lg lg:text-2xl font-light mb-6 sm:mb-8 animate__animated animate__fadeIn animate__delay-1s">
            Shop premium products and experience seamless service like never
            before.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6 sm:mb-8">
            <a
              href="#"
              className="inline-block px-8 sm:px-10 py-4 bg-gradient-to-r from-[#F85606] to-[#E14003] text-white rounded-full text-sm sm:text-xl font-semibold transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              Shop Now
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
