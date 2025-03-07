// import { useSelector,useDispatch } from "react-redux"
// import { fetchRentDetails } from "../slices/rentSlice"
// import '../App.css'
// import { verifiedBooks } from "../slices/bookSlice"

// import { addToCart } from "../slices/cartSlice"
// import { useEffect,useState } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// export default function RentNow(){
//     const [errorMessage,setErrorMessage]=useState(null)
//     const dispatch=useDispatch()
//     const navigate=useNavigate()
//     const {bookData}=useSelector(state=>state.books)
//     const {all}=useSelector(state=>state.rents)
//     const {serverError}=useSelector(state=>state.carts)
//     const {bid}=useParams()
//     useEffect(()=>{
//         dispatch(fetchRentDetails(bid))
//         dispatch(verifiedBooks())

//     },[dispatch,bid])
//     const book=bookData?.find(ele=>ele._id==bid)
//     console.log('bid',bid)
    

//     const rent=Array.isArray(all)?all?.find(ele=>ele.book==bid):null
//     // const handleCart=async ()=>{
//     //     try {
//     //         const response = await dispatch(addToCart(bid)).unwrap();
//     //         console.log("Cart Response:", response);
//     //         navigate("/cart");
//     //     } catch (error) {
//     //         console.log("Error:", error);
//     //         setErrorMessage(error?.error || "Something went wrong");
//     //     }
//     // }
//     const handleCart = async (bid, action) => {
//         try {
//             await dispatch(addToCart({ bid, action })); // action can be "buy" or "rent"
//             alert(`Added to cart for ${action}`);
//             navigate("/cart");
//         } catch (error) {
//             console.error("Error adding to cart:", error);
//         }
//     };
    
//     const handleRent=(id)=>{
//         navigate(`/book/${id}/orderplacing`)
//     }
//     return (
//         <div className="rent-container">
           
          
          
//             <h2>Rent-Details</h2>
//             <img style={{
//                 width: "160px",
//                 textAlign: "center",
//                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                 borderRadius: "8px",
//                 padding: "10px",
//                 backgroundColor: "#FEF3C7"
//             }}
//             src={book?.coverImage}
//             alt={book?.modifiedTitle}/>
//             <div className="details-container">
//             <p>{book?.modifiedTitle}</p>
//             <p>Rent Duration-{rent?.period}</p>
//             <p> CautionDeposit-{rent?.pricing?.cautionDeposit}</p>
//             <p>Delivery Charge-{rent?.pricing?.deliveryFee}</p>
//             <p>Reading Fee-{rent?.pricing?.readingFee}</p>
//             <p>Platform Fee-{rent?.pricing?.platformFee}</p>
//             <h4>Total-{rent?.pricing?.cautionDeposit+rent?.pricing?.deliveryFee+rent?.pricing?.readingFee+rent?.pricing?.platformFee}</h4>

//             <p className="caution-note">Caution Deposit is refundable after you return the book within the duration of {rent?.period}.If 
//                 you make delay in returning or make any damages in book leads the deduction of lateFee /damage fee from the cautionDeposit.
//             </p>
//             <button onClick={()=>handleRent(book._id)}>Rent Now</button>
//             <button onClick={()=>handleCart(book._id,'rent')}>Add To Cart</button>
//             </div>
           
           
//             {errorMessage&&<p style={{color:'red'}}>{errorMessage}</p>}
//         </div>
//     )
// }
import { useSelector, useDispatch } from "react-redux";
import { fetchRentDetails } from "../slices/rentSlice";
import { verifiedBooks } from "../slices/bookSlice";
import { addToCart } from "../slices/cartSlice";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import AuthContext from "../context/authContext";

export default function RentNow() {
  const { handleLogout } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookData } = useSelector((state) => state.books);
  const { all } = useSelector((state) => state.rents);
  const { serverError } = useSelector((state) => state.carts);
  const { bid } = useParams();
  console.log("bid", bid);

  useEffect(() => {
    dispatch(verifiedBooks());
    dispatch(fetchRentDetails({ bid }));
  }, [dispatch, bid]);

  console.log("rent details", all);
  const book = bookData?.find((ele) => ele._id === bid);
  console.log("book", book);
  const rent = Array.isArray(all) ? all?.find((ele) => ele.book === bid) : null;

  const handleCart = async (bid, action) => {
    try {
      dispatch(addToCart({ bid, action })); // action can be "buy" or "rent"
      alert(`Added to cart for ${action}`);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setErrorMessage(error?.error || "Something went wrong");
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
          Rent Details
        </h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Image */}
          <div className="flex-shrink-0">
            <img
              src={book?.coverImage}
              alt={book?.modifiedTitle}
              className="w-48 h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Rent Details */}
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
              {book?.modifiedTitle}
            </h3>
            <div className="space-y-3">
              <p className="text-[#3D405B]">
                <span className="font-semibold">Rent Duration:</span> {rent?.period}
              </p>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Caution Deposit:</span> ₹
                {rent?.pricing?.cautionDeposit}
              </p>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Delivery Charge:</span> ₹
                {rent?.pricing?.deliveryFee}
              </p>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Reading Fee:</span> ₹
                {rent?.pricing?.readingFee}
              </p>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Platform Fee:</span> ₹
                {rent?.pricing?.platformFee}
              </p>
              <h4 className="text-lg font-bold text-[#1A1A1A]">
                <span className="font-semibold">Total:</span> ₹
                {rent?.pricing?.cautionDeposit +
                  rent?.pricing?.deliveryFee +
                  rent?.pricing?.readingFee +
                  rent?.pricing?.platformFee}
              </h4>
            </div>

            {/* Note */}
            <p className="mt-6 text-sm text-[#3D405B] bg-[#F4F1DE] p-4 rounded-lg">
              <span className="font-semibold">Note:</span> Caution Deposit is
              refundable after you return the book within the duration of{" "}
              {rent?.period}. If you make a delay in returning or cause any damage
              to the book, a late fee or damage fee will be deducted from the
              caution deposit.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
             
              <button
                onClick={() => handleCart(book._id, "rent")}
                className="bg-[#3D405B] text-white px-6 py-2 rounded-lg hover:bg-[#3D405B] transition-colors"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="mt-6 text-[#E07A5F] text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}