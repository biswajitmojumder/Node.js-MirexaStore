// import Image from "next/image";
// import React, { useState, useEffect } from "react";
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

// const CartPageCSR = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     const userData = localStorage.getItem("user");

//     if (!token || !userData) {
//       toast.error("Authentication token or user data missing. Please log in.");
//       return;
//     }

//     try {
//       const parsedUserData = JSON.parse(userData);
//       const userId = parsedUserData._id;
//       setUserId(userId);
//       fetchCartData(userId);
//     } catch (error) {
//       console.error("Error parsing user data:", error);
//       toast.error("Invalid user data. Please log in again.");
//     }
//   }, []);

//   const fetchCartData = async (userId: string) => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//       toast.error("Authentication token missing. Please log in.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://e-commerce-backend-ashy-eight.vercel.app/api/cart/${userId}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setCartItems(data.data || []);
//       } else {
//         toast.error("Failed to load cart data.");
//       }
//     } catch (error) {
//       console.error("Error fetching cart data:", error);
//       toast.error("Something went wrong while fetching cart data.");
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
//                   <Image
//                     src={item.productId.productImages[0]}
//                     alt={item.productId.name}
//                     width={112}
//                     height={112}
//                     className="object-cover rounded-lg"
//                     unoptimized
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
//                         onClick={() => {}}
//                       >
//                         -
//                       </button>
//                       <span className="text-lg font-semibold text-gray-800">
//                         {item.quantity}
//                       </span>
//                       <button
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
//                         onClick={() => {}}
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

// export default CartPageCSR;
