// src/app/(commonLayout)/product/[id]/page.tsx

import { notFound } from "next/navigation";
import RelatedProduct from "../RelatedProduct";
import ProductDetails from "../productDetails";

type tParams = Promise<{ id: string[] }>;

const ProductPage = async ({ params }: { params: tParams }) => {
  const { id } = await params;

  try {
    const apiUrl = `http://localhost:5000/api/product/${id}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      notFound();
    }

    const productData = await response.json();
    console.log("Product Data:", productData);

    if (!productData || !productData.data || !productData.data.category) {
      throw new Error("Invalid product data received");
    }

    const relatedProductsUrl = `http://localhost:5000/api/product/category/${productData.data.category}`;
    const relatedProductsResponse = await fetch(relatedProductsUrl);
    const relatedProducts = relatedProductsResponse.ok
      ? await relatedProductsResponse.json()
      : { data: [] };
    console.log("Related Products:", relatedProducts);

    const relatedProductsData = relatedProducts?.data || [];

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
          <p>No related products available.</p>
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    notFound();
  }
};

export const dynamic = "force-static"; // This will treat this page as a static page

export default ProductPage;
