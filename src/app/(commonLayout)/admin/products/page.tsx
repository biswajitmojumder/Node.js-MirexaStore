"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import Loading from "@/app/loading";

const AdminProductPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null); // For storing product ID to delete
  const [isModalOpen, setIsModalOpen] = useState(false); // To track if the modal is open
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/product");
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setLoading(false);

        const uniqueCategories = [
          ...new Set(
            response.data.data.map((product: any) => product.category)
          ),
        ] as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        toast.error("Error fetching products!");
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteClick = (productId: string) => {
    setDeleteProductId(productId); // Set the product ID to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Authentication token is missing!");
      console.error("Authentication token is missing");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/product/${deleteProductId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== deleteProductId)
      );
      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.filter(
          (product) => product._id !== deleteProductId
        )
      );
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Error deleting product!");
      console.error("Error deleting product:", error);
    } finally {
      setIsModalOpen(false); // Close the modal after deletion
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal without deletion
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        <Loading></Loading>
      </p>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Product Management
      </h1>

      {/* Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this product?"
      />

      {/* Other filters and table rendering... */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Price
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Category
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Stock Quantity
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-800">
                  {product.name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  ${product.price}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {product.category}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {product.stockQuantity}
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex justify-start gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/products/${product._id}`)
                      }
                      className="text-blue-500 hover:text-blue-700 py-1 px-3 rounded-md border border-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id)}
                      className="text-red-500 hover:text-red-700 py-1 px-3 rounded-md border border-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminProductPage;
