// src/app/components/ProductSection.server.tsx

import ProductCart from "../components/ui/ProductCart";

const Product = async () => {
  const apiUrl = "http://localhost:5000/api/product"; // ✅ API to get all products
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const responseData = await response.json();
  const products = responseData.data;

  return <ProductCart products={products} />;
};

export default Product;
