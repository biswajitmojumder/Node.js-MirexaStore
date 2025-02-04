// import React, { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export type CartItem = {
//   _id: string;
//   userId: string;
//   productId: {
//     _id: string;
//     name: string;
//     price: number;
//     productImages: string[];
//   };
//   quantity: number;
//   addedAt: string;
// };

// type CartPageProps = {
//   initialCartItems: CartItem[];
// };

// const CartPageSSR = ({ initialCartItems }: CartPageProps) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
//   const [loading, setLoading] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState<string | null>(null);

//   const handleQuantityChange = async (id: string, delta: number) => {
//     setLoading(true);
//     const updatedCartItem = cartItems.find((item) => item._id === id);
//     if (!updatedCartItem) return;

//     const newQuantity = Math.max(1, updatedCartItem.quantity + delta);
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item._id === id ? { ...item, quantity: newQuantity } : item
//       )
//     );

//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/cart/${updatedCartItem._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//           body: JSON.stringify({ quantity: newQuantity }),
//         }
//       );

//       if (!response.ok) {
//         toast.error("Failed to update quantity.");
//         return;
//       }

//       toast.success("Quantity updated successfully!");
//     } catch (error) {
//       toast.error("Something went wrong while updating quantity.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemoveItem = async (id: string) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:5000/api/cart/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });

//       if (response.ok) {
//         setCartItems((prevItems) =>
//           prevItems.filter((item) => item._id !== id)
//         );
//         toast.success("Item removed from cart!");
//       } else {
//         toast.error("Failed to remove item.");
//       }
//     } catch (error) {
//       toast.error("Something went wrong while removing item.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (total, item) => total + item.productId.price * item.quantity,
//     0
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="container mx-auto">
//         <h1 className="text-3xl font-semibold mb-6 text-gray-800">
//           Shopping Cart
//         </h1>
//         {cartItems.length === 0 ? (
//           <p className="text-xl text-gray-600">Your cart is empty.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 space-y-4">
//               {cartItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className="relative flex items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
//                 >
//                   <button
//                     className="absolute top-2 right-2 text-red-600 text-3xl font-semibold hover:text-red-700 focus:outline-none transition duration-200 transform hover:scale-110"
//                     onClick={() => handleRemoveItem(item._id)}
//                   >
//                     &times;
//                   </button>

//                   <img
//                     src={item.productId.productImages[0]}
//                     alt={item.productId.name}
//                     className="w-28 h-28 object-cover rounded-lg"
//                   />
//                   <div className="ml-6 flex-1">
//                     <h2 className="text-xl font-medium text-gray-800 mb-2">
//                       {item.productId.name}
//                     </h2>
//                     <p className="text-lg text-gray-600">
//                       ${item.productId.price.toFixed(2)}
//                     </p>
//                     <div className="flex items-center space-x-4 mt-3">
//                       <button
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
//                         onClick={() => handleQuantityChange(item._id, -1)}
//                         disabled={item.quantity <= 1}
//                       >
//                         -
//                       </button>
//                       <span className="text-lg font-semibold text-gray-800">
//                         {item.quantity}
//                       </span>
//                       <button
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
//                         onClick={() => handleQuantityChange(item._id, 1)}
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-lg">
//               <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//                 Order Summary
//               </h3>
//               <p className="text-lg text-gray-600 mb-4">
//                 Total Price: ${totalPrice.toFixed(2)}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export async function getServerSideProps(context: any) {
//   const { req } = context;
//   const token = req.cookies.accessToken;

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   const userData = req.cookies.userData
//     ? JSON.parse(req.cookies.userData)
//     : null;
//   if (!userData) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   const userId = userData._id;
//   const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     return {
//       props: { initialCartItems: [] },
//     };
//   }

//   const data = await response.json();
//   return {
//     props: { initialCartItems: data.data || [] },
//   };
// }

// export default CartPageSSR;
