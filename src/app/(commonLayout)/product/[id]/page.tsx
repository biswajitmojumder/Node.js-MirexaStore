// src/app/(commonLayout)/product/[id]/page.tsx

import { notFound } from "next/navigation";
import RelatedProduct from "../RelatedProduct";
import ProductDetails from "../productDetails";

type tParams = { id: string };

const ProductPage = async ({ params }: { params: tParams }) => {
  const { id } = params;

  if (!id) {
    console.error("Product ID is missing");
    return notFound();
  }

  try {
    const apiUrl = `https://mirexa-store-backend.vercel.app/api/product/${id}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Failed to fetch product: ${response.status}`);
      return notFound();
    }

    const productData = await response.json();

    if (!productData?.data?.category) {
      console.error("Invalid product data format");
      return notFound();
    }

    const relatedProductsUrl = `https://mirexa-store-backend.vercel.app/api/product/category/${productData.data.category}`;
    const relatedProductsResponse = await fetch(relatedProductsUrl);

    let relatedProductsData = [];
    if (relatedProductsResponse.ok) {
      const relatedProducts = await relatedProductsResponse.json();
      relatedProductsData = relatedProducts?.data || [];
    } else {
      console.warn("Failed to fetch related products");
    }

    return (
      <>
        <ProductDetails
          product={productData}
          relatedProducts={relatedProductsData}
        />

        {relatedProductsData.length > 0 ? (
          <RelatedProduct relatedProducts={relatedProductsData} />
        ) : (
          <p>No related products available.</p>
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    return notFound();
  }
};

export const dynamic = "force-static";

export default ProductPage;
