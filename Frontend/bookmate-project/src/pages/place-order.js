
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCart } from "../slices/cartSlice";
// import { useContext, useEffect } from "react";
// import { placeOrder } from "../slices/rentSlice";
// import { useNavigate } from "react-router-dom";
// import AuthContext from "../context/authContext";
// import { AiOutlineUser, AiOutlineShoppingCart} from "react-icons/ai";
// import { Link } from "react-router-dom";

// export default function PlaceOrder() {
//   const {handleLogout}=useContext(AuthContext)
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { cartData } = useSelector((state) => state.carts);

//   useEffect(() => {
//     dispatch(fetchCart());
//   }, [dispatch]);

//   console.log("cart", cartData);

//   // Calculate total amount separately for Rent and Buy
//   const totalAmount = cartData?.reduce((acc, item) => {
//     if (item.rent) {
//       return (
//         acc +
//         item.rent.pricing.cautionDeposit +
//         item.rent.pricing.platformFee +
//         item.rent.pricing.readingFee +
//         item.rent.pricing.deliveryFee
//       );
//     } else if (item.buy) {
//       return acc + item.book.sellPrice + 10 + 30;
//     }
//     return acc;
//   }, 0);

//   const handleOrder = () => {
//     dispatch(placeOrder()).then(() => {
//       navigate("/order-confirm");
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//         <header className="w-full h-8 bg-red-700 text-white p-4 flex justify-between items-center px-6 left-0 top-0">
//         <h1 className="text-2xl font-bold">Bookmate</h1>
//         <div className="ml-auto flex gap-4">
//           <Link to="/profile" className="flex items-center gap-2 text-white hover:underline">
//             <AiOutlineUser size={24} /> Profile
//           </Link>
//           <Link to="/cart" className="flex items-center gap-2 text-white hover:underline">
//             <AiOutlineShoppingCart size={24} /> Cart
//           </Link>
//           <li>
//             <button
//               onClick={() => {
//                 const confirm = window.confirm("Logged out?");
//                 if (confirm) {
//                   handleLogout();
//                   localStorage.removeItem("token");
//                   navigate("/login");
//                 }
//               }}
//               className="text-white hover:underline"
//             >
//               Logout
//             </button>
//           </li>
//         </div>
//       </header>
//       <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
//         Order Placing
//       </h3>
//       {cartData?.length === 0 ? (
//         <p className="text-center text-gray-600">Your cart is empty</p>
//       ) : (
//         <>
//           <div className="max-w-4xl mx-auto">
//             {cartData?.map((ele) => (
//               <div
//                 key={ele._id}
//                 className="bg-white shadow-md rounded-lg p-4 flex gap-4 mb-4 items-center"
//               >
//                 <img
//                   className="w-32 h-40 object-cover rounded-md shadow-sm bg-yellow-100 p-2"
//                   src={ele.book?.coverImage}
//                   alt={ele.book?.modifiedTitle}
//                 />
//                 <div className="flex-1">
//                   <h2 className="text-xl font-semibold text-gray-700">
//                     {ele.book?.modifiedTitle}
//                   </h2>
//                   <h3 className="text-gray-600">Vendor: {ele.book?.vendor?.name}</h3>

//                   {/* Rent details */}
//                   {ele.rent && (
//                     <>
//                       <h3 className="text-gray-600">
//                         Duration: {ele.rent?.period} days
//                       </h3>
//                       <h3 className="text-gray-800 font-semibold">
//                         Amount: ₹
//                         {ele.rent.pricing.cautionDeposit +
//                           ele.rent.pricing.deliveryFee +
//                           ele.rent.pricing.platformFee +
//                           ele.rent.pricing.readingFee}
//                       </h3>
//                     </>
//                   )}

//                   {/* Buy details */}
//                   {ele.buy && (
//                     <>
//                       <h3 className="text-gray-600">
//                         Sell Price: ₹{ele.buy.sellPrice}
//                       </h3>
//                       <h3 className="text-gray-800 font-semibold">
//                         Total Amount: ₹
//                         {ele.buy.sellPrice +
//                           ele.buy.platformFee +
//                           ele.buy.deliveryFee}
//                       </h3>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <h4 className="text-2xl font-bold text-gray-800 text-center mt-6">
//             Total: ₹{totalAmount}
//           </h4>
//           <div className="flex justify-center mt-4">
//             <button
//               onClick={handleOrder}
//               className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
//             >
//               Pay-{totalAmount}/-
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../slices/cartSlice";
import { useContext, useEffect } from "react";
import { placeOrder } from "../slices/rentSlice";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function PlaceOrder() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartData } = useSelector((state) => state.carts);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  console.log("cart", cartData);

  // Calculate total amount separately for Rent and Buy
  const totalAmount = cartData?.reduce((acc, item) => {
    if (item.rent) {
      return (
        acc +
        item.rent.pricing.cautionDeposit +
        item.rent.pricing.platformFee +
        item.rent.pricing.readingFee +
        item.rent.pricing.deliveryFee
      );
    } else if (item.buy) {
      return acc + item.book.sellPrice + 10 + 30;
    }
    return acc;
  }, 0);

  const handleOrder = async () => {
    try {
      const response = await dispatch(placeOrder()).unwrap();
      navigate("/make-payment", { state: { newOrder: response } }); // Pass order data to Payment component
    } catch (err) {
      console.error(err);
      alert("Failed to create order. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="w-full h-8 bg-red-700 text-white p-4 flex justify-between items-center px-6 left-0 top-0">
        <h1 className="text-2xl font-bold">Bookmate</h1>
        <div className="ml-auto flex gap-4">
          <Link to="/profile" className="flex items-center gap-2 text-white hover:underline">
            <AiOutlineUser size={24} /> Profile
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-white hover:underline">
            <AiOutlineShoppingCart size={24} /> Cart
          </Link>
          <li>
            <button
              onClick={() => {
                const confirm = window.confirm("Logged out?");
                if (confirm) {
                  handleLogout();
                  localStorage.removeItem("token");
                  navigate("/login");
                }
              }}
              className="text-white hover:underline"
            >
              Logout
            </button>
          </li>
        </div>
      </header>
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Order Placing
      </h3>
      {cartData?.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty</p>
      ) : (
        <>
          <div className="max-w-4xl mx-auto">
            {cartData?.map((ele) => (
              <div
                key={ele._id}
                className="bg-white shadow-md rounded-lg p-4 flex gap-4 mb-4 items-center"
              >
                <img
                  className="w-32 h-40 object-cover rounded-md shadow-sm bg-yellow-100 p-2"
                  src={ele.book?.coverImage}
                  alt={ele.book?.modifiedTitle}
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-700">
                    {ele.book?.modifiedTitle}
                  </h2>
                  <h3 className="text-gray-600">Vendor: {ele.book?.vendor?.name}</h3>

                  {/* Rent details */}
                  {ele.rent && (
                    <>
                      <h3 className="text-gray-600">
                        Duration: {ele.rent?.period} days
                      </h3>
                      <h3 className="text-gray-800 font-semibold">
                        Amount: ₹
                        {ele.rent.pricing.cautionDeposit +
                          ele.rent.pricing.deliveryFee +
                          ele.rent.pricing.platformFee +
                          ele.rent.pricing.readingFee}
                      </h3>
                    </>
                  )}

                  {/* Buy details */}
                  {ele.buy && (
                    <>
                      <h3 className="text-gray-600">
                        Sell Price: ₹{ele.buy.sellPrice}
                      </h3>
                      <h3 className="text-gray-800 font-semibold">
                        Total Amount: ₹
                        {ele.buy.sellPrice +
                          ele.buy.platformFee +
                          ele.buy.deliveryFee}
                      </h3>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h4 className="text-2xl font-bold text-gray-800 text-center mt-6">
            Total: ₹{totalAmount}
          </h4>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleOrder}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
            >
              Pay-{totalAmount}/-
            </button>
          </div>
        </>
      )}
    </div>
  );
}