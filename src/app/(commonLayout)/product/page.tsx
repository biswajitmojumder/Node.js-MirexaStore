// src/app/components/ProductSection.server.tsx

import ProductCart from "../components/ui/ProductCart";

const Product = async () => {
  const apiUrl = "http://localhost:5000/api/product";
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  let responseData;
  try {
    responseData = await response.json();
  } catch (error) {
    throw new Error("Failed to parse products JSON");
  }

  // Debug log to inspect the fetched data
  console.log("Fetched response:", responseData);

  // Extract the products array from the response's 'data' field
  const products = responseData.data;

  // Ensure products is an array before proceeding
  if (!Array.isArray(products)) {
    console.error("Unexpected data format:", products);
    throw new Error("Products data is not an array");
  }

  // Extract unique categories from the fetched products
  const categories = [
    ...new Set(
      products.map((product: { category: string }) => product.category)
    ),
  ];

  return (
    <>
      <ProductCart products={products} categories={categories} />{" "}
    </>
  );
};

export default Product;
