// import { useSelector, useDispatch } from "react-redux";
// import { fetchCart,removeFromCart,clearCart } from "../slices/cartSlice";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Cart() {
//     const navigate=useNavigate()
//     const dispatch = useDispatch();
    
    
//     useEffect(()=>{
//         dispatch(fetchCart())
//     },[dispatch])
//     const { cartData } = useSelector(state => state.carts);
//     console.log('cartData',cartData)
//     const handleRemove=(id)=>{
//         const confirm=window.confirm('Are you sure ?')
//         if(confirm){
//             dispatch(removeFromCart(id))
//         }
//     }
//     const handleClear=()=>{
//         const confirm=window.confirm('Are you sure ?')
//         if(confirm){
//             dispatch(clearCart())
//         }
//     }
//     const handleContinue=()=>{
//         navigate('/order-placing')
//     }
//     return (
//         <div>
//             <h2>My Cart</h2>
//             {cartData?.length === 0 ? (
//                 <p>Your cart is empty</p>
//             ) : (
//                 <>
//                     {cartData?.map(ele => (
//                         <div key={ele.id}>
//                             <img style={{
//                 width: "160px",
//                 textAlign: "center",
//                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                 borderRadius: "8px",
//                 padding: "10px",
//                 backgroundColor: "#FEF3C7"
//             }}
//                             src={ele.book?.coverImage} alt={ele.title} />
//                             <div>
//                                 <h2>{ele.book?.modifiedTitle}</h2>
//                                 <h3>Vendor: {ele.book?.vendor}</h3>
//                                 <h3>Duration: {ele.rent?.period} days</h3>
//                                 <h3>
//                                     Amount to Pay: ₹
//                                     {ele.rent?.pricing.cautionDeposit +
//                                         ele.rent?.pricing.deliveryFee +
//                                         ele.rent?.pricing.platformFee +
//                                         ele.rent?.pricing.readingFee}
//                                 </h3>
//                                 <button onClick={() => handleRemove(ele._id)}>
//                                     Remove
//                                 </button>
//                             </div>
                          
//                         </div>
                        
//                     ))}
                
//                 {cartData?.length > 0 ? (<>
//                     <button onClick={handleClear}>Clear</button><br/>
//                     <button onClick={handleContinue}>continue</button>
//                 </>
                       
//                     ):<p>your cart is empty</p>}
//                 </>
//             )}
//         </div>
//     );
// }
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCart, clearCart } from "../slices/cartSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const { cartData } = useSelector((state) => state.carts);
  console.log("cartData", cartData);

  const handleRemove = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(removeFromCart(id));
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure?")) {
      dispatch(clearCart());
    }
  };

  const handleRent = () => {
    navigate("/order-placing");
  };

  const handleBuy = () => {
    navigate("/order-placing");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          My Cart
        </h2>

        {cartData?.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty</p>
        ) : (
          <>
            {/* Cart Items */}
            {cartData?.map((ele) => (
              <div
                key={ele._id}
                className="flex flex-col md:flex-row gap-6 border border-gray-200 rounded-lg p-4 mb-4"
              >
                {/* Book Cover Image */}
                <img
                  src={ele.book?.coverImage}
                  alt={ele.book?.modifiedTitle}
                  className="w-32 h-48 object-cover rounded-lg shadow-md"
                />

                {/* Book Details */}
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {ele.book?.modifiedTitle}
                  </h2>
                  <h3 className="text-gray-600">Vendor: {ele.book?.vendor}</h3>

                  {/* Rent Details */}
                  {ele.rent && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-gray-700">
                        <span className="font-semibold">Duration:</span> {ele.rent?.period} days
                      </h3>
                      <h3 className="text-gray-700">
                        <span className="font-semibold">Amount to Pay:</span> ₹
                        {ele.rent?.pricing.cautionDeposit +
                          ele.rent?.pricing.deliveryFee +
                          ele.rent?.pricing.platformFee +
                          ele.rent?.pricing.readingFee}
                      </h3>
                    </div>
                  )}

                  {/* Buy Details */}
                  {ele.buy && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-gray-700">
                        <span className="font-semibold">Sell Price:</span> ₹{ele.book?.sellPrice}
                      </h3>
                      <h3 className="text-gray-700">
                        <span className="font-semibold">Total Amount to Pay:</span> ₹
                        {ele.book?.sellPrice + 10 + 30}
                      </h3>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(ele._id)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            {cartData?.length > 0 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleClear}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}

            {/* Proceed Buttons */}
            {cartData?.length > 0 && (
              <div className="flex justify-end gap-4 mt-6">
                {cartData.some((item) => item.rent) && (
                  <button
                    onClick={handleRent}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Proceed to Rent
                  </button>
                )}
                {cartData.some((item) => item.buy) && (
                  <button
                    onClick={handleBuy}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Proceed to Buy
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}