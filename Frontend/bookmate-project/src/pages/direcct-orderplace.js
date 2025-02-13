// import { useSelector,useDispatch } from "react-redux"
// import { useParams,useNavigate,useLocation } from "react-router-dom"
// import { placeSingleOrder } from "../slices/rentSlice"
// import { addToCart } from "../slices/cartSlice"
// import { verifiedBooks } from "../slices/bookSlice"
// import { useEffect } from "react"
// import {Rating,ThinStar} from '@smastrom/react-rating'
// import '@smastrom/react-rating/style.css';

// export default function DirectOrderPlacing(){
//     const location=useLocation()
//     const {cartdata}=useSelector(state=>state.carts)
//     const {bookData}=useSelector(state=>state.books)
//     const dispatch=useDispatch()
//     const navigate=useNavigate()
//     const {bid}=useParams()
// useEffect(()=>{
//     dispatch(verifiedBooks())
// },[dispatch])
// const selectedBook=bookData.find(ele=>ele._id==bid)
// console.log('singleplaceOrder-data',selectedBook)
// const {price,type}=location.state||{}
// const handlePlaceOrder=(id)=>{
//     dispatch(placeSingleOrder(id)).then(()=>navigate('/order-confirm'))
// }

//     const handleCart = async (bid, action) => {
//         try {
//             await dispatch(addToCart({ bid, action })); // action can be "buy" or "rent"
//             alert(`Added to cart for ${action}`);
//             navigate("/cart");
//         } catch (error) {
//             console.error("Error adding to cart:", error);
//         }
//     };

//     return(
//         <div>
//             <h2>Placing Single Order</h2>
//             <img src={selectedBook?.coverImage}
//              alt={selectedBook?.modifiedTitle}/>
//              <Rating
//              value={selectedBook?.totalRating}
//              itemsShapes={ThinStar}
//              readOnly
//              style={{maxWidth:100,marginLeft:'400px'}}/>
//                <p>Rating-{selectedBook?.totalRating}</p> 
//             <p>Vendor-{selectedBook?.vendor.name}</p>
//              <p>Pay-{price||selectedBook?.rentPrice}/-</p>
//              <p>Delivery Address-{selectedBook?.vendor.location?.city},{selectedBook?.vendor.location?.state}</p>
//              <button onClick={()=>handleCart(selectedBook._id,'buy')}>Add to cart</button>
//              <button onClick={()=>handlePlaceOrder(selectedBook._id)}>Place Order</button>
            

//         </div>
//     )
// }
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { placeSingleOrder } from "../slices/rentSlice";
import { addToCart } from "../slices/cartSlice";
import { verifiedBooks } from "../slices/bookSlice";
import { useEffect } from "react";
import { Rating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

export default function DirectOrderPlacing() {
  const location = useLocation();
  const { bookData } = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bid } = useParams();

  useEffect(() => {
    dispatch(verifiedBooks());
  }, [dispatch]);

  const selectedBook = bookData.find((ele) => ele._id == bid);
  console.log("singleplaceOrder-data", selectedBook);

  const { price, type } = location.state || {};

  const handlePlaceOrder = (id) => {
    dispatch(placeSingleOrder(id)).then(() => navigate("/order-confirm"));
  };

  const handleCart = async (bid, action) => {
    try {
      await dispatch(addToCart({ bid, action }));
      alert(`Added to cart for ${action}`);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Placing Single Order</h2>
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 flex flex-col items-center">
        <img
          src={selectedBook?.coverImage}
          alt={selectedBook?.modifiedTitle}
          className="w-48 h-64 object-cover rounded-md shadow-md mb-4"
        />
        <Rating
          value={selectedBook?.totalRating}
          itemsShapes={ThinStar}
          readOnly
          style={{ maxWidth: 100 }}
        />
        <p className="text-gray-700 mt-2">Rating: {selectedBook?.totalRating}</p>
        <p className="text-gray-700">Vendor: {selectedBook?.vendor.name}</p>
        <p className="text-lg font-semibold text-orange-500">Pay: ₹{price || selectedBook?.rentPrice}/-</p>
        <p className="text-gray-600 text-sm text-center mt-2">
          Delivery Address: {selectedBook?.vendor.location?.city}, {selectedBook?.vendor.location?.state}
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleCart(selectedBook._id, "buy")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={() => handlePlaceOrder(selectedBook._id)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
