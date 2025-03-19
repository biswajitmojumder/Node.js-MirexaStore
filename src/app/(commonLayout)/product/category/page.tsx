"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import Link from "next/link"; // ✅ Import Next.js Link
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../../components/ui/CategorySection.module.css";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  bannerImage: string;
  description: string;
  isFeatured: boolean;
  status: string;
}

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category")
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error("Expected an array, but got:", response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <section className={styles.categoryWrapper}>
      <h2 className={styles.categoryTitle}>Categories</h2>
      <div className="w-full mx-auto px-4">
        <Slider {...settings}>
          {categories.map((category) => (
            <div key={category._id} className={styles.sliderItem}>
              <Link href={`/product/category/${category.slug}`} passHref>
                {" "}
                {/* ✅ Dynamic slug link */}
                <div className="mb-6 overflow-hidden p-2 rounded-xl cursor-pointer">
                  <Image
                    src={
                      category.bannerImage ||
                      "https://via.placeholder.com/400x200"
                    }
                    alt={category.name}
                    width={400}
                    height={200}
                    className={styles.sliderImage}
                    unoptimized
                  />
                </div>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDescription}>
                  {category.description}
                </p>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default CategorySection;
