// import { useSelector ,useDispatch} from "react-redux"
// import { verifiedBooks } from "../slices/bookSlice"
// import { getReviews } from "../slices/reviewSlice"
// import { useEffect ,useState} from "react"
// import { useNavigate } from "react-router-dom"
// import {Rating,ThinStar} from '@smastrom/react-rating'
// import '@smastrom/react-rating/style.css';

// export default function Home(){
//     const dispatch=useDispatch()
//     const navigate=useNavigate()
//     const {bookData} =useSelector(state=>state.books)
//     const {reviewData}=useSelector(state=>state.reviews)
//      const[bookRating,setBookrating]=useState({})
//     useEffect(()=>{
//         dispatch(verifiedBooks())
        
//     },[])
  
    
            
            
//     console.log('bookrat',bookRating)
//     const handleRent=(id)=>{
//         navigate(`/book/${id}/rentnow`)
//     }
//     const handleSell=(id)=>{
//         navigate(`/review/${id}`)

//     }
//     const handleImageClick=(bid)=>{
//         navigate(`/review/${bid}`)
//     }
//   const trendingBooks=bookData.filter(ele=>ele.rentCount>4).sort((a,b)=>b.rentCount-a.rentCount)
//   const fiction=bookData.filter(ele=>ele.genre[0]=='Fiction')
//   const science=bookData.filter(ele=>ele.genre[0]=='Science')
//   const kids=bookData.filter(ele=>ele.genre[0]=='Juvenile Fiction')
//   const economics=bookData.filter(ele=>ele.genre[0]=='Business & Economics')
//   const excluded=['Fiction','Science','Juvenile Fiction','Business & Economics']
//   const others=bookData.filter(ele=>!excluded.includes(ele.genre[0]))
//     return (
//         <div>
//         <h2>Trending Now...</h2>
//         <div style={{
//             display: "flex", 
//             flexWrap: "wrap", 
//             gap: "16px",
//             justifyContent: "center",
//             padding: "10px"
//         }}>
            
//             {trendingBooks?.map(ele => (
                
//                 <div key={ele._id}
//                     style={{
//                         width: "160px",
//                         textAlign: "center",
//                         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                         borderRadius: "8px",
//                         padding: "10px",
//                         backgroundColor: "#FEF3C7"
//                     }}>
//                     <div onClick={()=>handleImageClick(ele._id)} style={{cursor:'pointer'}}>
//                     <img src={ele.coverImage}
//                         alt="Book Cover"
//                         style={{
//                             width: "100%",
//                             height: "auto",
//                             borderRadius: "8px 8px 0 0",
//                         }} />

//                     </div>
                   
//                         <h3>{ele.modifiedTitle}</h3>
//                         <h4>Author:{ele.author}</h4>
//                         <Rating
//                                     value={ele.totalRating}
//                                     itemShapes={ThinStar}
//                                     readOnly // Make the rating read-only
//                                     style={{ maxWidth: 100}}
//                                 />
//                         <i>{ele.status}</i><br/>
//                         {ele.status=='available'?<button onClick={()=>handleRent(ele._id)}>Rent Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<button onClick={()=>handleSell(ele._id)}>Buy Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<p>sell At-{ele.sellPrice}</p>:<></>}
//                         <p>Rent At-{ele.rentPrice}/-</p>
//                 </div>
//             ))}
//         </div>


//         <h2>Fiction</h2>
//         <div style={{
//             display: "flex", 
//             flexWrap: "wrap", 
//             gap: "16px",
//             justifyContent: "center",
//             padding: "10px"
//         }}>
            
//             {fiction?.map(ele => (
                
//                 <div key={ele._id}
//                     style={{
//                         width: "160px",
//                         textAlign: "center",
//                         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                         borderRadius: "8px",
//                         padding: "10px",
//                         backgroundColor: "#FEF3C7"
//                     }}>
//                     <div onClick={()=>handleImageClick(ele._id)} style={{cursor:'pointer'}}>
//                     <img src={ele.coverImage}
//                         alt="Book Cover"
//                         style={{
//                             width: "100%",
//                             height: "auto",
//                             borderRadius: "8px 8px 0 0",
//                         }} />

//                     </div>
                   
//                         <h3>{ele.modifiedTitle}</h3>
//                         <h4>Author:{ele.author}</h4>
//                         <Rating
//                                     value={ele.totalRating}
//                                     itemShapes={ThinStar}
//                                     readOnly // Make the rating read-only
//                                     style={{ maxWidth: 100}}
//                                 />
//                         <i>{ele.status}</i><br/>
//                         {ele.status=='available'?<button onClick={()=>handleRent(ele._id)}>Rent Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<button onClick={()=>handleSell(ele._id)}>Buy Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<p>sell At-{ele.sellPrice}</p>:<></>}
//                         <p>Rent At-{ele.rentPrice}/-</p>
//                 </div>
//             ))}
//         </div>

//         <h2>Science</h2>
//         <div style={{
//             display: "flex", 
//             flexWrap: "wrap", 
//             gap: "16px",
//             justifyContent: "center",
//             padding: "10px"
//         }}>
            
//             {science?.map(ele => (
                
//                 <div key={ele._id}
//                     style={{
//                         width: "160px",
//                         textAlign: "center",
//                         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                         borderRadius: "8px",
//                         padding: "10px",
//                         backgroundColor: "#FEF3C7"
//                     }}>
//                     <div onClick={()=>handleImageClick(ele._id)} style={{cursor:'pointer'}}>
//                     <img src={ele.coverImage}
//                         alt="Book Cover"
//                         style={{
//                             width: "100%",
//                             height: "auto",
//                             borderRadius: "8px 8px 0 0",
//                         }} />

//                     </div>
                   
//                         <h3>{ele.modifiedTitle}</h3>
//                         <h4>Author:{ele.author}</h4>
//                         <Rating
//                                     value={ele.totalRating}
//                                     itemShapes={ThinStar}
//                                     readOnly // Make the rating read-only
//                                     style={{ maxWidth: 100}}
//                                 />
//                         <i>{ele.status}</i><br/>
//                         {ele.status=='available'?<button onClick={()=>handleRent(ele._id)}>Rent Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<button onClick={()=>handleSell(ele._id)}>Buy Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<p>sell At-{ele.sellPrice}</p>:<></>}
//                         <p>Rent At-{ele.rentPrice}/-</p>
//                 </div>
//             ))}
//         </div>


//         <h2>Kidz</h2>
//         <div style={{
//             display: "flex", 
//             flexWrap: "wrap", 
//             gap: "16px",
//             justifyContent: "center",
//             padding: "10px"
//         }}>
            
//             {kids?.map(ele => (
                
//                 <div key={ele._id}
//                     style={{
//                         width: "160px",
//                         textAlign: "center",
//                         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                         borderRadius: "8px",
//                         padding: "10px",
//                         backgroundColor: "#FEF3C7"
//                     }}>
//                     <div onClick={()=>handleImageClick(ele._id)} style={{cursor:'pointer'}}>
//                     <img src={ele.coverImage}
//                         alt="Book Cover"
//                         style={{
//                             width: "100%",
//                             height: "auto",
//                             borderRadius: "8px 8px 0 0",
//                         }} />

//                     </div>
                   
//                         <h3>{ele.modifiedTitle}</h3>
//                         <h4>Author:{ele.author}</h4>
//                         <Rating
//                                     value={ele.totalRating}
//                                     itemShapes={ThinStar}
//                                     readOnly // Make the rating read-only
//                                     style={{ maxWidth: 100}}
//                                 />
//                         <i>{ele.status}</i><br/>
//                         {ele.status=='available'?<button onClick={()=>handleRent(ele._id)}>Rent Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<button onClick={()=>handleSell(ele._id)}>Buy Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<p>sell At-{ele.sellPrice}</p>:<></>}
//                         <p>Rent At-{ele.rentPrice}/-</p>
//                 </div>
//             ))}
//         </div>

//         <h2>Economics</h2>
//         <div style={{
//             display: "flex", 
//             flexWrap: "wrap", 
//             gap: "16px",
//             justifyContent: "center",
//             padding: "10px"
//         }}>
            
//             {economics?.map(ele => (
                
//                 <div key={ele._id}
//                     style={{
//                         width: "160px",
//                         textAlign: "center",
//                         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                         borderRadius: "8px",
//                         padding: "10px",
//                         backgroundColor: "#FEF3C7"
//                     }}>
//                     <div onClick={()=>handleImageClick(ele._id)} style={{cursor:'pointer'}}>
//                     <img src={ele.coverImage}
//                         alt="Book Cover"
//                         style={{
//                             width: "100%",
//                             height: "auto",
//                             borderRadius: "8px 8px 0 0",
//                         }} />

//                     </div>
                   
//                         <h3>{ele.modifiedTitle}</h3>
//                         <h4>Author:{ele.author}</h4>
//                         <Rating
//                                     value={ele.totalRating}
//                                     itemShapes={ThinStar}
//                                     readOnly // Make the rating read-only
//                                     style={{ maxWidth: 100}}
//                                 />
//                         <i>{ele.status}</i><br/>
//                         {ele.status=='available'?<button onClick={()=>handleRent(ele._id)}>Rent Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<button onClick={()=>handleSell(ele._id)}>Buy Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<p>sell At-{ele.sellPrice}</p>:<></>}
//                         <p>Rent At-{ele.rentPrice}/-</p>
//                 </div>
//             ))}
//         </div>

//         <h2>Others</h2>
//         <div style={{
//             display: "flex", 
//             flexWrap: "wrap", 
//             gap: "16px",
//             justifyContent: "center",
//             padding: "10px"
//         }}>
            
//             {others?.map(ele => (
                
//                 <div key={ele._id}
//                     style={{
//                         width: "160px",
//                         textAlign: "center",
//                         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                         borderRadius: "8px",
//                         padding: "10px",
//                         backgroundColor: "#FEF3C7"
//                     }}>
//                     <div onClick={()=>handleImageClick(ele._id)} style={{cursor:'pointer'}}>
//                     <img src={ele.coverImage}
//                         alt="Book Cover"
//                         style={{
//                             width: "100%",
//                             height: "auto",
//                             borderRadius: "8px 8px 0 0",
//                         }} />

//                     </div>
                   
//                         <h3>{ele.modifiedTitle}</h3>
//                         <h4>Author:{ele.author}</h4>
//                         <Rating
//                                     value={ele.totalRating}
//                                     itemShapes={ThinStar}
//                                     readOnly // Make the rating read-only
//                                     style={{ maxWidth: 100}}
//                                 />
//                         <i>{ele.status}</i><br/>
//                         {ele.status=='available'?<button onClick={()=>handleRent(ele._id)}>Rent Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<button onClick={()=>handleSell(ele._id)}>Buy Now</button>:<></>}
//                         {ele.status=='available'&&ele.isSelling?<p>sell At-{ele.sellPrice}</p>:<></>}
//                         <p>Rent At-{ele.rentPrice}/-</p>
//                 </div>
//             ))}
//         </div>
//     </div>
//     )
// }
// import { useSelector, useDispatch } from "react-redux";
// import { verifiedBooks } from "../slices/bookSlice";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Rating, ThinStar } from "@smastrom/react-rating";
// import "@smastrom/react-rating/style.css";

// export default function Home() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { bookData } = useSelector(state => state.books);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [currentPage,setCurrentPage]=useState(1)

//     useEffect(() => {
//         dispatch(verifiedBooks());
//     }, [dispatch]);

//     const handleRent = (id) => {
//         navigate(`/book/${id}/rentnow`);
//     };

//     const handleSell = (id) => {
//         navigate(`/review/${id}`);
//     };

//     const handleImageClick = (bid) => {
//         navigate(`/review/${bid}`);
//     };

//     // Filter books based on the search term
//     const filteredBooks = bookData.filter(ele =>
//         ele.modifiedTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         ele.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         ele.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//     const booksPerPage=4
//     const lastBookIndex=currentPage*booksPerPage
//     const firstBookIndex=lastBookIndex-booksPerPage
//     const currentBooks=filteredBooks.slice(firstBookIndex,lastBookIndex)
//     const totalPages=Math.ceil(filteredBooks.length/booksPerPage)
//     return (
//         <div >
//             <h2>Search Books</h2>
//             <input
//                 type="text"
//                 placeholder="Search by title, author, or genre..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{
//                     width: "80%",
//                     padding: "10px",
//                     marginBottom: "20px",
//                     borderRadius: "5px",
//                     border: "1px solid gray"
//                 }}
//             />

//             <h2>Books</h2>
//             <div style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: "16px",
//                 justifyContent: "center",
//                 padding: "10px"
//             }}>
//                 {currentBooks.length > 0 ? (
//                     currentBooks.map(ele => (
//                         <div key={ele._id}
//                             style={{
//                                 width: "200px",
                               
//                                 textAlign: "center",
//                                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                                 borderRadius: "8px",
//                                 padding: "10px",
//                                 backgroundColor: "red"
//                             }}>
//                             <div onClick={() => handleImageClick(ele._id)} style={{ cursor: 'pointer' }}>
//                                 <img src={ele.coverImage}
//                                     alt="Book Cover"
//                                     style={{
//                                         width: "700px",
//                                         height: "200px",
//                                         borderRadius: "8px 8px 0 0",
//                                     }} />
//                             </div>
//                             <h3><b>{ele.modifiedTitle}</b></h3>
//                             {/* <h4>Author: {ele.author}</h4> */}
//                             <Rating
//                                 value={ele.totalRating}
//                                 itemShapes={ThinStar}
//                                 readOnly
//                                 style={{ maxWidth: 100 ,marginLeft:30 }}
//                             />
//                             <i>{ele.status}</i><br />
//                             {ele.status === "available" ? <button onClick={() => handleRent(ele._id)}>Rent Now</button> : null}
//                             {ele.status === "available" && ele.isSelling ? <button onClick={() => handleSell(ele._id)}>Buy Now</button> : null}
//                             {ele.status === "available" && ele.isSelling ? <p>Sell At - {ele.sellPrice}</p> : null}
//                             <p>Rent At - {ele.rentPrice}/-</p>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No books found</p>
//                 )}
//             </div>
//             <div>
//                 {currentPage>1&&(
//                     <button onClick={()=>setCurrentPage(currentPage-1)}>Previous</button> 
//                 )}
//                 <span>Page {currentPage}of {totalPages}</span>
//                 {currentPage<totalPages&&(
//                     <button onClick={()=>setCurrentPage(currentPage+1)}>Next</button>
//                 )}
//             </div>
//         </div>
//     );
// }
// import { useSelector, useDispatch } from "react-redux";
// import { verifiedBooks } from "../slices/bookSlice";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Rating, ThinStar } from "@smastrom/react-rating";
// import "@smastrom/react-rating/style.css";

// export default function Home({ searchTerm }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { bookData } = useSelector((state) => state.books);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     dispatch(verifiedBooks());
//   }, [dispatch]);

//   const handleRent = (id) => {
//     navigate(`/book/${id}/rentnow`);
//   };

//   const handleSell = (id) => {
//     navigate(`/review/${id}`);
//   };

//   const handleImageClick = (bid) => {
//     navigate(`/review/${bid}`);
//   };

//   const filteredBooks = bookData.filter(
//     (ele) =>
//       ele.modifiedTitle?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
//       ele.author?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
//       ele.genre.some((g) => g.toLowerCase().includes(searchTerm?.toLowerCase()))
//   );

//   const booksPerPage = 4;
//   const lastBookIndex = currentPage * booksPerPage;
//   const firstBookIndex = lastBookIndex - booksPerPage;
//   const currentBooks = filteredBooks.slice(firstBookIndex, lastBookIndex);
//   const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

//   return (
//     <div style={{ backgroundColor: "#F5F5F5", padding: "20px" }}>
//       <h2 style={{ color: "#2C3E50" }}>Books</h2>
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: "16px",
//           justifyContent: "center",
//           padding: "10px",
//         }}
//       >
//         {currentBooks.length > 0 ? (
//           currentBooks.map((ele) => (
//             <div
//   key={ele._id}
//   className="book-card w- h-100 text-center shadow-lg rounded-lg p-4 bg-red flex flex-col"
// >
//   <div
//     onClick={() => handleImageClick(ele._id)}
//     className="cursor-pointer w-30 h-30"
//   >
//     <img
//       src={ele.coverImage}
//       alt="Book Cover"
//       className="w-70 h-20 object-cover rounded-t-lg" 
//     />
//   </div>
//   <h3 className="text-lg  font-semibold mb-1 truncate">{ele.modifiedTitle}</h3>
//   <Rating
//     value={ele.totalRating}
//     itemShapes={ThinStar}
//     readOnly
//     style={{ maxWidth: 100, marginLeft: 30 }}
//   />
//   <i className="text-sm text-gray-600">{ele.status}</i>
//   <div className="mt-auto pt-4"> {/* Ensures buttons are aligned at the bottom */}
//     {ele.status === "available" && (
//       <div className="flex gap-3">
//         <button
//           onClick={() => handleRent(ele._id)}
//           className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex-1"
//         >
//           Rent Now - {ele.rentPrice}/-
//         </button>
//         {ele.isSelling && (
//           <button
//             onClick={() => handleSell(ele._id)}
//             className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex-1"
//           >
//             Buy Now - {ele.sellPrice}/-
//           </button>
//         )}
//       </div>
//     )}
//   </div>
// </div>
// //             <div
// //               key={ele._id}
// //               className="book-card"
// //               style={{
// //                 width: "200px",
// //                 textAlign: "center",
// //                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //                 borderRadius: "8px",
// //                 padding: "10px",
// //                 backgroundColor: "white",
// //               }}
// //             >
// //               <div
// //                 onClick={() => handleImageClick(ele._id)}
// //                 style={{ cursor: "pointer" }}
// //               >
// //                 <img
// //                   src={ele.coverImage}
// //                   alt="Book Cover"
// //                   style={{
// //                     width: "100%",
// //                     height: "200px",
// //                     borderRadius: "8px 8px 0 0",
// //                   }}
// //                 />
// //               </div>
// //               <h3>{ele.modifiedTitle}</h3>
// //               <Rating
// //                 value={ele.totalRating}
// //                 itemShapes={ThinStar}
// //                 readOnly
// //                 style={{ maxWidth: 100, marginLeft: 30 }}
// //               />
// //               <i>{ele.status}</i>
// //               <br />
// //               {ele.status === "available" && (
// //   <div className="flex gap-3 mt-3">
// //     <button
// //       onClick={() => handleRent(ele._id)}
// //       className="bg-orange-300 text-white px-3 py-2 rounded-md hover:bg-orange-600 transition-colors"
// //     >
// //       Rent{ele.rentPrice}/-
// //     </button>
// //     {ele.isSelling && (
// //       <button
// //         onClick={() => handleSell(ele._id)}
// //         className="bg-orange-500 text-white px-2 py-2 rounded-md hover:bg-orange-600 transition-colors"
// //       >
// //         Buy{ele.sellPrice}/-
// //       </button>
// //     )}
// //   </div>
// // )}
             
// //             </div>
//           ))
//         ) : (
//           <p>No books found</p>
//         )}
//       </div>
//       <div className="pagination">
//         {currentPage > 1 && (
//           <button onClick={() => setCurrentPage(currentPage - 1)}>
//             Previous
//           </button>
//         )}
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         {currentPage < totalPages && (
//           <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
//         )}
//       </div>
//     </div>
//   );
// }
// import { useSelector, useDispatch } from "react-redux";
// import { verifiedBooks } from "../slices/bookSlice";
// import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Rating, ThinStar } from "@smastrom/react-rating";
// import "@smastrom/react-rating/style.css";
// import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
// import { Link } from "react-router-dom";
// import AuthContext from "../context/authContext";

// export default function Home() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { bookData } = useSelector((state) => state.books);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("availability"); // Sorting state
//   const {handleLogout}=useContext(AuthContext)

//   const handleSearch = (term) => setSearchTerm(term);

//   useEffect(() => {
//     dispatch(verifiedBooks());
//   }, [dispatch]);

//   const handleRent = (id) => navigate(`/book/${id}/rentnow`);
//   const handleSell = (id) => navigate(`/review/${id}`);
//   const handleImageClick = (id) => navigate(`/review/${id}`);

//   let filteredBooks = bookData.filter(
//     (ele) =>
//       ele.modifiedTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ele.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ele.genre.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   // Sorting logic
//   if (sortOption === "ratings") {
//     filteredBooks = filteredBooks.sort((a, b) => b.totalRating - a.totalRating);
//   } else if (sortOption === "availability") {
//     filteredBooks = filteredBooks.sort((a, b) => (a.status === "available" ? -1 : 1));
//   } else if (sortOption === "rentPrice") {
//     filteredBooks = filteredBooks.sort((a, b) => a.rentPrice - b.rentPrice);
//   } else if (sortOption === "sellPrice") {
//     filteredBooks = filteredBooks.sort((a, b) => a.sellPrice - b.sellPrice);
//   }

//   const booksPerPage = 4;
//   const lastBookIndex = currentPage * booksPerPage;
//   const firstBookIndex = lastBookIndex - booksPerPage;
//   const currentBooks = filteredBooks.slice(firstBookIndex, lastBookIndex);
//   const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       {/* Header */}
//       <header className="w-full bg-orange-500 text-white p-4 flex justify-between items-center px-6">
//         <h1 className="text-2xl font-bold">Bookmate</h1>
//         <div className="ml-auto flex gap-4">
//           <Link to="/profile" className="flex items-center gap-2 text-white hover:underline">
//             <AiOutlineUser size={24} /> Profile
//           </Link>
//           <Link to="/cart" className="flex items-center gap-2 text-white hover:underline">
//             <AiOutlineShoppingCart size={24} /> Cart

//           </Link>
//           <li><button onClick={()=>{
//         const confirm=window.confirm('Logged out?')
//         if(confirm){
//           handleLogout()
//           localStorage.removeItem('token')
//           navigate('/login')
//         }
       
//        }
//        }>Logout</button></li>
//         </div>
//       </header>

//       {/* Sorting Dropdown */}
//       <div className="bg-white p-4 shadow-md flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-gray-800">Books</h2>
//         <select
//           className="border border-gray-300 rounded-md px-3 py-2"
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//         >
//           <option value="availability">Availability</option>
//           <option value="ratings">Ratings (High to Low)</option>
          
//           <option value="rentPrice">Rent Price (Low to High)</option>
//           <option value="sellPrice">Sell Price (Low to High)</option>
//         </select>
//       </div>

//       {/* Books Display */}
//       <div className="flex flex-wrap gap-4 justify-center p-4">
//         {currentBooks.length > 0 ? (
//           currentBooks.map((ele) => (
//             <div
//               key={ele._id}
//               className="book-card w-40 h-100 text-center shadow-lg rounded-lg p-4 bg-white flex flex-col relative group"
//             >
//               <div onClick={() => handleImageClick(ele._id)} className="cursor-pointer w-30 h-30">
//                 <img src={ele.coverImage} alt="Book Cover" className="w-70 h-20 object-cover rounded-t-lg" />
//               </div>
//               <h3 className="text-lg font-semibold mb-1 truncate">{ele.modifiedTitle}</h3>
//               <Rating value={ele.totalRating} itemShapes={ThinStar} readOnly style={{ maxWidth: 100, marginLeft: 30 }} />
//               <i className="text-sm text-gray-600">{ele.status}</i>

//               {ele.status === "available" && (
//                 <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
//                   <div className="flex gap-3">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleRent(ele._id);
//                       }}
//                       className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
//                     >
//                       Rent Now - {ele.rentPrice}/-
//                     </button>
//                     {ele.isSelling && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleSell(ele._id);
//                         }}
//                         className="bg-white-100 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
//                       >
//                         Buy Now - {ele.sellPrice}/-
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No books found</p>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="pagination flex justify-center gap-4 mt-4">
//         {currentPage > 1 && (
//           <button onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400">
//             Previous
//           </button>
//         )}
//         <span className="text-lg font-semibold">
//           Page {currentPage} of {totalPages}
//         </span>
//         {currentPage < totalPages && (
//           <button onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400">
//             Next
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
import { useSelector, useDispatch } from "react-redux";
import {  verifiedBooks } from "../slices/bookSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

export default function MyBooks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookData } = useSelector((state) => state.books);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(verifiedBooks());
  }, [dispatch]);

  const booksPerPage = 4;
  const lastBookIndex = currentPage * booksPerPage;
  const firstBookIndex = lastBookIndex - booksPerPage;
  const currentBooks = bookData?.slice(firstBookIndex, lastBookIndex);
  const totalPages = Math.ceil(bookData.length / booksPerPage);

  const handleImageClick = (id) => navigate(`/review/${id}`);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="w-full bg-orange-500 text-white p-4 flex justify-center">
        <h1 className="text-2xl font-bold">My Books</h1>
      </header>

      <div className="flex flex-wrap gap-4 justify-center p-4">
        {currentBooks.length > 0 ? (
          currentBooks.map((ele) => (
            <div
              key={ele._id}
              className="book-card w-40 h-100 text-center shadow-lg rounded-lg p-4 bg-white flex flex-col relative group"
            >
              <div onClick={() => handleImageClick(ele._id)} className="cursor-pointer w-30 h-30">
                <img src={ele.coverImage} alt="Book Cover" className="w-70 h-20 object-cover rounded-t-lg" />
              </div>
              <h3 className="text-lg font-semibold mb-1 truncate">{ele.modifiedTitle}</h3>
              <Rating value={ele.totalRating} itemShapes={ThinStar} readOnly style={{ maxWidth: 100, marginLeft: 30 }} />
              <i className="text-sm text-gray-600">{ele.status}</i>
            </div>
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>

      <div className="pagination flex justify-center gap-4 mt-4">
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Previous
          </button>
        )}
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        {currentPage < totalPages && (
          <button onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
