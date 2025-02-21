// import { useSelector,useDispatch} from "react-redux"
// import { fetchClient } from "../slices/clientSlice"
// import { returnBook } from "../slices/rentSlice"
// import { createReviews } from "../slices/reviewSlice"
// import { useEffect,useContext,useState } from "react"
// import {Rating,ThinStar} from '@smastrom/react-rating'
// import '@smastrom/react-rating/style.css';


// import AuthContext from "../context/authContext"
// export default function MyOrders(){
//     const {clientData}=useSelector(state=>state.clients)
//     const [returnMsg,setReturnMsg]=useState({})
//     const [reviewText,setreviewText]=useState({})
//     const [rating,setRating]=useState({})
//     const {userState}=useContext(AuthContext)
//     const dispatch=useDispatch()
   
//     const {rentData}=useSelector(state=>state.rents)
//      console.log('returmsg',returnMsg)
//     useEffect(()=>{
//         dispatch(fetchClient({id:userState.user._id}))
        
//     },[])
//     const handleReturn=async(id)=>{
//         const confirm=window.confirm('Are you sure?')
//         if(confirm){
//             await dispatch(returnBook(id))
//             setReturnMsg((prevState) => ({
//                 ...prevState,
//                 [id]: 'Book returned successfully',
//               }));
           
            

//         }
        
//     }
//     const handleSubmit=(bookId)=>{
//         if(!reviewText[bookId]||!rating[bookId]){
//             alert('please provide both reviews and ratings')
//             return
//         }
//         const reviewData={
//             reviewFor:'Book',
//             reviewEntityId:bookId,
//             reviewText:reviewText[bookId],
//             rating:rating[bookId]
//         }
//         dispatch(createReviews({review:reviewData}))
//         alert('review submitted')
//         setRating({...rating,[bookId]:""})
//         setreviewText({...reviewText,[bookId]:''})

//     }
//     console.log('clientdatabook',clientData.rentedBooks)
//     return(
//         <div>
//             <h3>My Orders-{clientData?.rentedBooks?.length}</h3>
            
//           {clientData?.rentedBooks?.map(ele=>(
//             <div key={ele._id}><img style={{
//                 width: "160px",
//                 textAlign: "center",
//                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                 borderRadius: "8px",
//                 padding: "10px",
//                 backgroundColor: "#FEF3C7"
//             }}
//              src={ele.book?.coverImage}/>
//             <p>vendor:{ele.rent?.vendor}</p>
//             <p>order placed on :{ele.rent?.updatedAt.split('T')[0]}</p>
//             <p>Due On:{ele.rent?.dueDate.split('T')[0]}</p>
//             <button onClick={()=>{handleReturn(ele.book._id)}}
//                 disabled={ele?.rent?.rentedBookStatus=='completed'}>Return</button>
           
//            {ele.rent?.rentedBookStatus=='completed'&&<p style={{color:'green',fontStyle:'italic'}}>Book returned Successfully</p>}

//            <div>
//             <p>Add Your Comments</p>
//             <textarea
//             placeholder="Write your reviews"
//             value={reviewText[ele.book?._id]}
//             onChange={(e)=>{
//                 const updatedReviews={...reviewText}
//                 updatedReviews[ele.book._id]=e.target.value
//                 setreviewText(updatedReviews)
//             }}
//             />
//              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
//                             <Rating
//                                 style={{ maxWidth: 150 }}
//                                 value={rating[ele.book._id] || 0}
//                                 onChange={(value) => {
//                                     const updatedRatings = { ...rating };
//                                     updatedRatings[ele.book._id] = value;
//                                     setRating(updatedRatings);
//                                 }}
//                                 itemShapes={ThinStar}
//                                 activeFillColor="#ffb700"
//                                 inactiveFillColor="#ccc"
//                             />
//                         </div>
//             <button onClick={()=>{handleSubmit(ele.book._id)}}
//                 disabled={!reviewText[ele.book._id]}>
//                     Submit</button>
//            </div>
//            <hr/>
//             </div>
            
//           ))}
        
//         </div>
//     )
// }

// import { useSelector, useDispatch } from "react-redux";
// import { myOrders } from "../slices/orderSlice";
// import { returnBook } from "../slices/rentSlice";
// import { createReviews } from "../slices/reviewSlice";
// import { useEffect, useContext, useState } from "react";
// import { Rating, ThinStar } from "@smastrom/react-rating";
// import "@smastrom/react-rating/style.css";
// import AuthContext from "../context/authContext";

// export default function MyOrders() {
//   const { orderData } = useSelector((state) => state.orders);
//   const [returnMsg, setReturnMsg] = useState({});
//   const [reviewText, setReviewText] = useState({});
//   const [rating, setRating] = useState({});
//   const [uploadedImages, setUploadedImages] = useState({});
//   const [submittedReviews, setSubmittedReviews] = useState({});
//   const { userState } = useContext(AuthContext);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(myOrders());
//   }, [dispatch]);

//   const handleReturn = async (id) => {
//     const confirm = window.confirm("Are you sure?");
//     if (confirm) {
//       await dispatch(returnBook(id));
//       setReturnMsg((prevState) => ({
//         ...prevState,
//         [id]: "Book returned successfully",
//       }));
//     }
//   };

//   const handleSubmit = async (bookId) => {
//     if (!reviewText[bookId] || !rating[bookId]) {
//       alert("Please provide both reviews and ratings");
//       return;
//     }

//     const reviewData = new FormData();
//     reviewData.append("reviewFor", "Book");
//     reviewData.append("reviewEntityId", bookId);
//     reviewData.append("reviewText", reviewText[bookId]);
//     reviewData.append("rating", rating[bookId]);
//     if (uploadedImages[bookId]) {
//       reviewData.append("photo", uploadedImages[bookId]);
//     }

//     await dispatch(createReviews(reviewData));
//     alert("Review submitted");
//     setSubmittedReviews({ ...submittedReviews, [bookId]: true });
//   };

//   const handleFileChange = (e, bookId) => {
//     setUploadedImages({ ...uploadedImages, [bookId]: e.target.files[0] });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
//         My Orders - {orderData.length}
//       </h3>

//       {orderData.map((ele) => {
//         const orderType = ele.rent ? "rent" : "buy";

//         return (
//           <div
//             key={ele._id}
//             className="bg-white shadow-md rounded-lg p-4 mb-6 max-w-4xl mx-auto"
//           >
//             <div className="flex gap-4">
//               <img
//                 className="w-32 h-40 object-cover rounded-md shadow-sm bg-yellow-100 p-2"
//                 src={ele.book?.coverImage}
//                 alt="Book Cover"
//               />
//               <div className="flex-1">
//                 <h2 className="text-xl font-semibold text-gray-700">
//                   {ele.book?.modifiedTitle}
//                 </h2>
//                 <p className="text-gray-600">
//                   Vendor: {ele.book?.vendor?.name}
//                 </p>
//                 <p className="text-gray-600">
//                   Order placed on: {ele.rent?.updatedAt?.split("T")[0]}
//                 </p>
//                 {orderType === "rent" && (
//                   <p className="text-gray-600">
//                     Due On: {ele.rent?.dueDate?.split("T")[0]}
//                   </p>
//                 )}

//                 {orderType === "rent" && (
//                   <>
//                     <button
//                       onClick={() => handleReturn(ele.book._id)}
//                       disabled={ele?.rent?.rentedBookStatus === "completed"}
//                       className={`mt-2 px-4 py-2 rounded-lg text-white font-semibold ${
//                         ele?.rent?.rentedBookStatus === "completed"
//                           ? "bg-gray-400 cursor-not-allowed"
//                           : "bg-red-500 hover:bg-red-600"
//                       } transition duration-300`}
//                     >
//                       Return
//                     </button>
//                     {ele.rent?.rentedBookStatus === "completed" && (
//                       <p className="text-green-600 italic mt-2">
//                         Book returned successfully
//                       </p>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>

//             <div className="mt-4">
//               <p className="text-gray-700 font-semibold">Add Your Comments</p>
//               <textarea
//                 className="w-full border rounded-lg p-2 mt-2"
//                 placeholder="Write your review"
//                 value={reviewText[ele.book?._id] || ""}
//                 onChange={(e) =>
//                   setReviewText({ ...reviewText, [ele.book?._id]: e.target.value })
//                 }
//                 // disabled={submittedReviews[ele.book?._id]}
//               />
//               <div className="flex justify-center items-center mt-3">
//                 <Rating
//                   style={{ maxWidth: 150 }}
//                   value={rating[ele.book?._id] || 0}
//                   onChange={(value) =>
//                     setRating({ ...rating, [ele.book?._id]: value })
//                   }
//                   itemShapes={ThinStar}
//                   activeFillColor="#ffb700"
//                   inactiveFillColor="#ccc"
//                   // disabled={submittedReviews[ele.book?._id]}
//                 />
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileChange(e, ele.book?._id)}
//                 // disabled={submittedReviews[ele.book?._id]}
//                 className="mt-2"
//               />
//               <button
//                 onClick={() => handleSubmit(ele.book?._id)}
//                 // disabled={submittedReviews[ele.book?._id] || !reviewText[ele.book?._id]}
//                 className={`mt-3 px-4 py-2 rounded-lg text-white font-semibold ${
//                   submittedReviews[ele.book?._id]
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-500 hover:bg-blue-600"
//                 } transition duration-300`}
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


import { useSelector, useDispatch } from "react-redux";
import { myOrders } from "../slices/orderSlice";
import { returnBook } from "../slices/rentSlice";
import { createReviews } from "../slices/reviewSlice";
import { useEffect, useContext, useState } from "react";
import { Rating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import AuthContext from "../context/authContext";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const navigate=useNavigate()
  const { orderData } = useSelector((state) => state.orders);
  const [returnMsg, setReturnMsg] = useState({});
  const [reviewText, setReviewText] = useState({});
  const [rating, setRating] = useState({});
  const [photos, setPhotos] = useState({}); // State to store selected photos
  const { userState } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch]);

  console.log("Order Data:", orderData); // Debugging: Log order data

  const handleReturn = async (id) => {
    console.log("Returning book with ID:", id); // Debugging: Log book ID
    const confirm = window.confirm("Are you sure?");
    if (confirm) {
      await dispatch(returnBook(id));
      setReturnMsg((prevState) => ({
        ...prevState,
        [id]: "Book returned successfully",
      }));
    }
  };

  // const handleFileChange = (bookId, event) => {
  //   const files = Array.from(event.target.files); // Convert FileList to an array
  //   setPhotos((prevPhotos) => ({
  //     ...prevPhotos,
  //     [bookId]: files, // Store the selected files for the specific book
  //   }));
  // };

  // const uploadPhotos = async (bookId, files) => {
  //   const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append("photo", file); // Append each file to the FormData object
  //   });

  //   try {
  //     const response = await axios.post(
  //       `/api/review/book/${bookId}/photo`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: localStorage.getItem("token"),
  //         },
  //       }
  //     );
  //     console.log("Uploaded Photos:", response.data);
  //     return response.data.photos; // Return array of uploaded photo URLs
  //   } catch (error) {
  //     console.log("Error uploading photos:", error);
  //     throw error;
  //   }
  // };

  const handleSubmit = async (bookId) => {
    if (!reviewText[bookId] || !rating[bookId]) {
      alert("Please provide both reviews and ratings");
      return;
    }

    try {
      // let uploadedPhotoUrls = [];

      // // Check if photos exist and upload them first
      // if (photos[bookId]?.length > 0) {
      //   uploadedPhotoUrls = await uploadPhotos(bookId, photos[bookId]);
      // }

      const reviewData = {
        reviewFor: "Book",
        reviewEntityId: bookId,
        reviewText: reviewText[bookId],
        rating: rating[bookId],
        //photos: uploadedPhotoUrls, // Attach uploaded photo URLs
      };

      dispatch(createReviews({ review: reviewData }));
      alert("Review submitted successfully");

      // Reset form states
      setRating({ ...rating, [bookId]: "" });
      setReviewText({ ...reviewText, [bookId]: "" });
      setPhotos({ ...photos, [bookId]: [] });
    } catch (error) {
      console.error("Error submitting review:", error.response?.data || error);
      alert("Failed to submit review. Please try again.");
    }
  };
  const handlePhotos=(id)=>{
    navigate(`/review-photo/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
        My Orders - {orderData.length}
      </h3>

      {orderData.map((ele) => {
        const orderType = ele.rent ? "rent" : "buy";

        return (
          <div
            key={ele._id}
            className="bg-white shadow-md rounded-lg p-4 mb-6 max-w-4xl mx-auto"
          >
            <div className="flex gap-4">
              <img
                className="w-32 h-40 object-cover rounded-md shadow-sm bg-yellow-100 p-2"
                src={ele.book?.coverImage}
                alt="Book Cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-700">
                  {ele.book?.modifiedTitle}
                </h2>
                <p className="text-gray-600">
                  Vendor: {ele.book?.vendor?.name}
                </p>
                <p className="text-gray-600">
                  Order placed on:{" "}
                  {(ele.rent?.updatedAt || ele.buy?.updatedAt)?.split("T")[0]}
                </p>
                {orderType === "rent" && (
                  <p className="text-gray-600">
                    Due On: {ele.rent?.dueDate?.split("T")[0]}
                  </p>
                )}
                {orderType === "buy" && (
                  <p className="text-gray-600">
                    Purchase Date: {ele.buy?.updatedAt?.split("T")[0]}
                  </p>
                )}

                {orderType === "rent" && (
                  <>
                    <button
                      onClick={() => handleReturn(ele.book._id)}
                      disabled={ele?.rent?.rentedBookStatus === "completed"}
                      className={`mt-2 px-4 py-2 rounded-lg text-white font-semibold ${
                        ele?.rent?.rentedBookStatus === "completed"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      } transition duration-300`}
                    >
                      Return
                    </button>
                    {ele.rent?.rentedBookStatus === "completed" && (
                      <p className="text-green-600 italic mt-2">
                        Book returned successfully
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-700 font-semibold">Add Your Comments</p>
              <textarea
                className="w-full border rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Write your reviews"
                value={reviewText[ele.book?._id] || ""}
                onChange={(e) => {
                  setReviewText({ ...reviewText, [ele.book?._id]: e.target.value });
                }}
              />
              <div className="flex justify-center items-center mt-3">
                <Rating
                  style={{ maxWidth: 150 }}
                  value={rating[ele.book?._id] || 0}
                  onChange={(value) => setRating({ ...rating, [ele.book?._id]: value })}
                  itemShapes={ThinStar}
                  activeFillColor="#ffb700"
                  inactiveFillColor="#ccc"
                />
              </div>

              {/* File Upload Section
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(ele.book?._id, e)}
                  className="hidden"
                  id={`file-input-${ele.book?._id}`}
                />
                <label
                  htmlFor={`file-input-${ele.book?._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
                >
                  Add Photos
                </label>
              </div> */}

              <button
                onClick={() => handleSubmit(ele.book?._id)}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
            </div>
            <button onClick={()=>handlePhotos(ele._id)}> Add Photos</button>
          </div>
        );
      })}
    </div>
  );
}
// import { useSelector, useDispatch } from "react-redux";
// import { myOrders } from "../slices/orderSlice";
// import { returnBook } from "../slices/rentSlice";
// import { createReviews } from "../slices/reviewSlice";
// import { useEffect, useContext, useState } from "react";
// import { Rating, ThinStar } from "@smastrom/react-rating";
// import "@smastrom/react-rating/style.css";
// import AuthContext from "../context/authContext";

// export default function MyOrders() {
//   const { orderData } = useSelector((state) => state.orders);
//   const [returnMsg, setReturnMsg] = useState({});
//   const [reviewText, setReviewText] = useState({});
//   const [rating, setRating] = useState({});
//   const [photos, setPhotos] = useState({});
//   const { userState } = useContext(AuthContext);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(myOrders());
//   }, [dispatch]);

//   const handleReturn = async (id) => {
//     if (window.confirm("Are you sure?")) {
//       await dispatch(returnBook(id));
//       setReturnMsg((prev) => ({ ...prev, [id]: "Book returned successfully" }));
//     }
//   };

//   const handleFileChange = (bookId, event) => {
//     setPhotos((prevPhotos) => ({
//       ...prevPhotos,
//       [bookId]: event.target.files,
//     }));
//   };

//   const handleSubmit = async (bookId) => {
//     if (!reviewText[bookId] || !rating[bookId]) {
//       alert("Please provide both review and rating");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("reviewFor", "Book");
//     formData.append("reviewEntityId", bookId);
//     formData.append("reviewText", reviewText[bookId]);
//     formData.append("rating", rating[bookId]);

//     if (photos[bookId]?.length) {
//       Array.from(photos[bookId]).forEach((file) => {
//         formData.append("photos", file);
//       });
//     }

//     try {
//       await dispatch(createReviews({ review: formData }));
//       alert("Review submitted successfully");
//       setReviewText({ ...reviewText, [bookId]: "" });
//       setRating({ ...rating, [bookId]: 0 });
//       setPhotos({ ...photos, [bookId]: [] });
//     } catch (error) {
//       alert("Failed to submit review. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
//         My Orders - {orderData.length}
//       </h3>

//       {orderData.map((ele) => (
//         <div key={ele._id} className="bg-white shadow-md rounded-lg p-4 mb-6 max-w-4xl mx-auto">
//           <div className="flex gap-4">
//             <img className="w-32 h-40 object-cover rounded-md" src={ele.book?.coverImage} alt="Book Cover" />
//             <div className="flex-1">
//               <h2 className="text-xl font-semibold">{ele.book?.modifiedTitle}</h2>
//               <p>Vendor: {ele.book?.vendor?.name}</p>
//               <p>Order placed on: {ele.rent?.updatedAt?.split("T")[0]}</p>
//               {ele.rent && <p>Due On: {ele.rent?.dueDate?.split("T")[0]}</p>}
//               <button
//                 onClick={() => handleReturn(ele.book._id)}
//                 disabled={ele?.rent?.rentedBookStatus === "completed"}
//                 className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
//               >
//                 Return
//               </button>
//               {returnMsg[ele.book._id] && <p className="text-green-600">{returnMsg[ele.book._id]}</p>}
//             </div>
//           </div>

//           <div className="mt-4">
//             <textarea
//               className="w-full border rounded-lg p-2 mt-2"
//               placeholder="Write your reviews"
//               value={reviewText[ele.book?._id] || ""}
//               onChange={(e) => setReviewText({ ...reviewText, [ele.book?._id]: e.target.value })}
//             />
//             <div className="flex justify-center mt-3">
//               <Rating
//                 style={{ maxWidth: 150 }}
//                 value={rating[ele.book?._id] || 0}
//                 onChange={(value) => setRating({ ...rating, [ele.book?._id]: value })}
//                 itemShapes={ThinStar}
//               />
//             </div>

//             <div className="mt-3">
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={(e) => handleFileChange(ele.book?._id, e)}
//                 className="hidden"
//                 id={`file-input-${ele.book?._id}`}
//               />
//               <label htmlFor={`file-input-${ele.book?._id}`} className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
//                 Add Photos
//               </label>
//             </div>

//             <button onClick={() => handleSubmit(ele.book?._id)} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg">
//               Submit
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
