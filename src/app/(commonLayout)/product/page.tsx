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

  // Filter for featured products
  const featuredProducts = products.filter(
    (product: { isFeatured: any }) => product.isFeatured
  );
  // Filter for new arrival products
  const newArrivalProducts = products.filter(
    (product: { isNewArrival: any }) => product.isNewArrival
  );

  return (
    <div>
      {/* New Arrivals Section */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          New Arrivals
        </h2>
        <ProductCart products={newArrivalProducts} />
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Featured Products
        </h2>
        <ProductCart products={featuredProducts} />
      </section>

      {/* All Products Section */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          All Products
        </h2>
        <ProductCart products={products} />
      </section>
    </div>
  );
};

export default Product;
