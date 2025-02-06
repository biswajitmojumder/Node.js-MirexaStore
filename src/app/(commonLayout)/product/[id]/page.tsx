import { notFound } from "next/navigation";
import RelatedProduct from "../RelatedProduct";
import ProductDetails from "../productDetails";

interface ProductDetailsProps {
  product: {
    data: {
      _id: string;
      name: string;
      description: string;
      price: number;
      stockQuantity: number;
      category: string;
      productImages: string[];
      reviews: { rating: number; comment: string }[];
    };
  };
  relatedProducts?: {
    data: {
      _id: string;
      name: string;
      price: number;
      productImages: string[];
    }[];
  };
}

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    // Fetch product details
    const apiUrl = `http://localhost:5000/api/product/${id}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      notFound();
    }

    const productData = await response.json();
    console.log("Product Data:", productData);

    // Check if product data exists and is in the correct format
    if (!productData || !productData.data || !productData.data.category) {
      throw new Error("Invalid product data received");
    }

    // Fetch related products by category (excluding the current product)
    const relatedProductsUrl = `http://localhost:5000/api/product/${id}/related`;

    const relatedProductsResponse = await fetch(relatedProductsUrl);
    const relatedProducts = relatedProductsResponse.ok
      ? await relatedProductsResponse.json()
      : { data: [] }; // Use an empty array if there's an issue with the fetch
    console.log("Related Products:", relatedProducts);

    // Ensure related products exist before passing to the component
    const relatedProductsData = relatedProducts?.data || [];

    return (
      <>
        <ProductDetails
          product={productData}
          relatedProducts={relatedProductsData} // Pass relatedProducts prop here
        />
        {/* Only render RelatedProduct if relatedProductsData is an array and has items */}
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

export default ProductPage;
