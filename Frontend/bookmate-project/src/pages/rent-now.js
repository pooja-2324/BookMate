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
//     const {rentData}=useSelector(state=>state.rents)
//     const {serverError}=useSelector(state=>state.carts)
//     const {bid}=useParams()
//     useEffect(()=>{
//         dispatch(fetchRentDetails(bid))
//         dispatch(verifiedBooks())

//     },[dispatch,bid])
//     const book=bookData?.find(ele=>ele._id==bid)
//     console.log('bid',bid)
    

//     const rent=Array.isArray(rentData)?rentData?.find(ele=>ele.book==bid):null
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RentNow() {
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookData } = useSelector((state) => state.books);
  const { rentData } = useSelector((state) => state.rents);
  const { serverError } = useSelector((state) => state.carts);
  const { bid } = useParams();

  useEffect(() => {
    dispatch(fetchRentDetails(bid));
    dispatch(verifiedBooks());
  }, [dispatch, bid]);

  const book = bookData?.find((ele) => ele._id === bid);
  const rent = Array.isArray(rentData) ? rentData?.find((ele) => ele.book === bid) : null;

  const handleCart = async (bid, action) => {
    try {
      await dispatch(addToCart({ bid, action })); // action can be "buy" or "rent"
      alert(`Added to cart for ${action}`);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setErrorMessage(error?.error || "Something went wrong");
    }
  };

  const handleRent = (id) => {
    navigate(`/book/${id}/orderplacing`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Rent Details
        </h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Cover Image */}
          <div className="flex-shrink-0">
            <img
              src={book?.coverImage}
              alt={book?.modifiedTitle}
              className="w-48 h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Rent Details */}
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {book?.modifiedTitle}
            </h3>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-semibold">Rent Duration:</span> {rent?.period}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Caution Deposit:</span> ₹{rent?.pricing?.cautionDeposit}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Delivery Charge:</span> ₹{rent?.pricing?.deliveryFee}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Reading Fee:</span> ₹{rent?.pricing?.readingFee}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Platform Fee:</span> ₹{rent?.pricing?.platformFee}
              </p>
              <h4 className="text-lg font-bold text-gray-800">
                <span className="font-semibold">Total:</span> ₹
                {rent?.pricing?.cautionDeposit +
                  rent?.pricing?.deliveryFee +
                  rent?.pricing?.readingFee +
                  rent?.pricing?.platformFee}
              </h4>
            </div>

            {/* Caution Note */}
            <p className="mt-6 text-sm text-gray-600 bg-yellow-50 p-4 rounded-lg">
              <span className="font-semibold">Note:</span> Caution Deposit is refundable after you return the book within the duration of{" "}
              {rent?.period}. If you make a delay in returning or cause any damage to the book, a late fee or damage fee will be deducted from the
              caution deposit.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleRent(book._id)}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Rent Now
              </button>
              <button
                onClick={() => handleCart(book._id, "rent")}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="mt-6 text-red-500 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}