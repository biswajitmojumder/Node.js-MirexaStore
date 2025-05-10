"use client";

import Image from "next/image";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
  bannerImage: string;
}

const CategorySection = ({ categories }: { categories: Category[] }) => {
  return (
    <section className="py-10 bg-white">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Categories
      </h2>

      <div className="w-full px-4">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/product/category/${category.slug}`}
            >
              <div className="flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 shadow-md">
                  <Image
                    src={(
                      category.bannerImage || "https://via.placeholder.com/100"
                    ).replace("http://", "https://")}
                    alt={category.name}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <p className="text-sm md:text-base font-medium text-[#F85606] mt-2 text-center">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
