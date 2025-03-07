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
import { Link } from "react-router-dom";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import AuthContext from "../context/authContext";
import { useContext } from "react";

export default function DirectOrderPlacing() {
  const { handleLogout } = useContext(AuthContext);
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
    <div className="min-h-screen bg-[#F4F1DE]">
      {/* Header */}
      <header className="w-full h-16 bg-[#2C3E50] text-white p-4 flex justify-between items-center px-6 left-0 top-0 shadow-md">
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-[#F8F8F8] p-8 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold text-center text-[#1A1A1A] mb-6">
          Placing Single Order
        </h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Image */}
          <div className="flex-shrink-0">
            <img
              src={selectedBook?.coverImage}
              alt={selectedBook?.modifiedTitle}
              className="w-48 h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Order Details */}
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
              {selectedBook?.modifiedTitle}
            </h3>
            <div className="space-y-3">
              <Rating
                value={selectedBook?.totalRating}
                itemsShapes={ThinStar}
                readOnly
                style={{ maxWidth: 100 }}
              />
              <p className="text-[#3D405B]">
                <span className="font-semibold">Rating:</span> {selectedBook?.totalRating}
              </p>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Vendor:</span> {selectedBook?.vendor.name}
              </p>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Price:</span> ₹{price || selectedBook?.rentPrice}
              </p>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Delivery Address:</span> {selectedBook?.vendor.location?.city}, {selectedBook?.vendor.location?.state}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleCart(selectedBook._id, "buy")}
                className="bg-[#3D405B] text-white px-6 py-2 rounded-lg hover:bg-[#3D405B] transition-colors"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
