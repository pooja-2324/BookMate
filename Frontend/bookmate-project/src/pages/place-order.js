// import { useDispatch, useSelector } from "react-redux"
// import { fetchCart } from "../slices/cartSlice"
// import { useEffect } from "react"
// import { placeOrder } from "../slices/rentSlice"
// import { useNavigate } from "react-router-dom"
// export default function PlaceOrder(){
//     const navigate=useNavigate()
//     const {cartData}=useSelector(state=>state.carts)
//     const dispatch=useDispatch()
    
//     console.log('cart',cartData)
//     useEffect(()=>{
//         dispatch(fetchCart())
//     },[dispatch])
//     const totalAmount=cartData?.reduce((acc,cv)=>{
//         return acc+cv.rent.pricing.cautionDeposit+cv.rent.pricing.platformFee+cv.rent.pricing.readingFee+cv.rent.pricing.deliveryFee
//     },0)
//     const handleOrder=()=>{
//         dispatch(placeOrder()).then(()=>{navigate('/order-confirm')})
//     }
//     return(
//         <div>
//             <h3>Order-Placing</h3>
//             {cartData?.map(ele => (
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
//                                     Amount : ₹
//                                     {ele.rent?.pricing.cautionDeposit +
//                                         ele.rent?.pricing.deliveryFee +
//                                         ele.rent?.pricing.platformFee +
//                                         ele.rent?.pricing.readingFee}
//                                 </h3>
                               
//                             </div>
//                         </div>))}
//                         <h4>Total:{totalAmount}</h4>
//                         <button onClick={handleOrder}>Place Order</button>
                          
//         </div>
//     )
// }
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../slices/cartSlice";
import { useEffect } from "react";
import { placeOrder } from "../slices/rentSlice";
import { useNavigate } from "react-router-dom";

export default function PlaceOrder() {
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

  const handleOrder = () => {
    dispatch(placeOrder()).then(() => {
      navigate("/order-confirm");
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
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
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
