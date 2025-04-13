"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="relative h-screen bg-white">
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm z-20"></div>

      {/* Product or Website Content */}
      <div className="relative z-10">
        {/* Your content goes here (e.g., products, website elements) */}
        <div className="h-full bg-gray-100 p-4">
          {/* Example content */}
          <h1 className="text-center text-2xl text-gray-700">
            Website or Products
          </h1>
          <p className="text-center mt-4">
            Content that remains visible beneath the blur effect.
          </p>
        </div>
      </div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center absolute inset-0 z-30">
        <div className="loader" />
      </div>

      {/* Custom Spinner Animation using @keyframes */}
      <style jsx>{`
        .loader {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: inline-block;
          border-top: 4px solid #fff;
          border-right: 4px solid transparent;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
          position: relative;
        }

        .loader::after {
          content: "";
          box-sizing: border-box;
          position: absolute;
          left: 0;
          top: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border-bottom: 4px solid #ff3d00;
          border-left: 4px solid transparent;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
