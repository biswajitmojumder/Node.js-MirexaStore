// import React from "react";

// type CartItem = {
//   _id: string;
//   productId: {
//     _id: string;
//     name: string;
//     price: number;
//     productImages: string[];
//   } | null;
//   quantity: number;
// };

// type CartProps = {
//   cartItems: CartItem[];
//   loading: boolean;
// };

// const CartComponent: React.FC<CartProps> = ({ cartItems, loading }) => {
//   const totalPrice = cartItems.reduce((total, item) => {
//     if (!item.productId) return total;
//     return total + item.productId.price * item.quantity;
//   }, 0);

//   if (loading) {
//     return <p className="text-xl text-gray-600">Loading...</p>;
//   }

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
//               {cartItems.map(
//                 (item) =>
//                   item.productId && (
//                     <div
//                       key={item._id}
//                       className="bg-white p-6 rounded-xl shadow-lg"
//                     >
//                       <h2 className="text-xl font-medium text-gray-800">
//                         {item.productId.name}
//                       </h2>
//                       <p className="text-lg text-gray-600">
//                         ${item.productId.price.toFixed(2)}
//                       </p>
//                       <p className="text-lg">Quantity: {item.quantity}</p>
//                     </div>
//                   )
//               )}
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-lg">
//               <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//                 Order Summary
//               </h3>
//               <p className="text-lg text-gray-600">
//                 Total Price: ${totalPrice.toFixed(2)}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartComponent;
