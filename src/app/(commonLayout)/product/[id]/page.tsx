// src/app/(commonLayout)/product/[id]/page.tsx

import { notFound } from "next/navigation";
import RelatedProduct from "../RelatedProduct";
import ProductDetails from "../productDetails";

type tParams = Promise<{ id: string[] }>;
export async function generateMetadata({ params }: { params: tParams }) {
  const { id } = await params;

  try {
    const res = await fetch(
      `https://mirexa-store-backend.vercel.app/api/product/${id}`
    );
    if (!res.ok) {
      return {
        title: "Product Not Found - MirexaStore",
        description:
          "The product you're looking for does not exist or is currently unavailable.",
      };
    }

    const productData = await res.json();
    const product = productData.data;

    return {
      title: product.name || "Product - MirexaStore",
      description:
        product.description?.slice(0, 160) ||
        "Explore premium products from MirexaStore.",
      openGraph: {
        title: product.name,
        description: product.description,
        images: [
          {
            url: product.productImages[0],
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Page - MirexaStore",
      description: "Explore the finest products at MirexaStore.",
    };
  }
}

const ProductPage = async ({ params }: { params: tParams }) => {
  const { id } = await params;

  try {
    const apiUrl = `https://mirexa-store-backend.vercel.app/api/product/${id}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      notFound();
      return; // Ensure the function exits here if not found
    }

    const productData = await response.json();
    console.log("Product Data:", productData);

    if (!productData || !productData.data || !productData.data.category) {
      notFound(); // Instead of throwing an error, redirect to notFound
      return; // Ensure the function exits here
    }

    const relatedProductsUrl = `https://mirexa-store-backend.vercel.app/api/product/category/${productData.data.category}`;
    const relatedProductsResponse = await fetch(relatedProductsUrl);

    console.log(relatedProductsUrl);
    const relatedProducts = relatedProductsResponse.ok
      ? await relatedProductsResponse.json()
      : { data: [] };
    console.log("Related Products:", relatedProducts);

    // ✅ Filter out the current product
    const currentProductId = productData.data._id;
    const relatedProductsData =
      relatedProducts?.data?.filter(
        (product: any) => product._id !== currentProductId
      ) || [];

    return (
      <>
        <ProductDetails
          product={productData}
          relatedProducts={relatedProductsData}
        />

        {Array.isArray(relatedProductsData) &&
        relatedProductsData.length > 0 ? (
          <RelatedProduct relatedProducts={relatedProductsData} />
        ) : (
          <p className="text-left lg:ml-6 ml-5 py-8 lg:px-4">
            No similar items available right now. Please check back later!
          </p>
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    notFound();
  }
};

// This will treat this page as a static page

export default ProductPage;
