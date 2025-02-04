import { notFound } from "next/navigation";
import ProductDetails from "../productDetails";

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  console.log(id);

  const apiUrl = `http://localhost:5000/api/product/${id}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    notFound();
  }

  let productData;
  try {
    productData = await response.json();
  } catch (error) {
    throw new Error("Failed to parse product details");
  }

  return <ProductDetails product={productData} />;
};

export default ProductPage;
