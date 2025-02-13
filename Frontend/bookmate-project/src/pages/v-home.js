// import { useDispatch, useSelector } from "react-redux";
// import { useEffect ,useState} from "react";
// import { uploadedBooks, deleteBook,assignEditId,fetchClientCount } from "../slices/bookSlice";
// import { useNavigate } from "react-router-dom";
// import LazyLoad from "react-lazyload";
// import axios from "../config/axios";

// export default function MyBooks() {
//     const [clientCounts,setClientCounts]=useState({})
//   const navigate = useNavigate();
//   const { bookData ,clientCount} = useSelector((state) => state.books);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(uploadedBooks());
//     dispatch(fetchClientCount())
//   }, []);

  
//   const handleUpload = () => {
//     navigate("/upload");
//   };

//   const handleDelete = (id) => {
//     const confirm = window.confirm("Are you sure?");
//     if (confirm) {
//       dispatch(deleteBook(id));
//     }
//   };
//   const handleEdit=(id)=>{
//     dispatch(assignEditId(id))
//     navigate('/upload')
//   }

//   return (
//     <div>
//       <h3>My Books</h3>
//       <button onClick={handleUpload}>Upload</button>
//       <h4>Total Uploaded Books: {bookData.length}</h4>
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           justifyContent: "center",
//           gap: "20px",
//           padding: "10px",
//         }}
//       >
//         {bookData.map((ele) => (
//           <div
//             key={ele._id}
//             style={{
//               width: "160px",
//               textAlign: "center",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//               borderRadius: "8px",
//               padding: "10px",
//               backgroundColor: "#FEF3C7",
//             }}
//           >
//             <LazyLoad
//               height={200}
//               offset={100}
//               once
//               placeholder={<div style={{ height: "2px", background: "red" }}>Loading...</div>}
//             >
//               <img
//                 src={ele.coverImage}
//                 alt={ele.title}
//                 style={{
//                   width: "100%",
//                   height: "auto",
//                   borderRadius: "8px 8px 0 0",
//                 }}
//               />
//             </LazyLoad>
//             <h5>{ele.modifiedTitle}</h5>
//             <p>Published Year: {ele.publishedYear}</p>
//             <p>Author: {ele.author}</p>

//             <button onClick={()=>handleEdit(ele._id)}>Edit</button>
//             <button onClick={() => handleDelete(ele._id)}>withdraw</button>
//             <p>Used by:{clientCount[ele._id]}</p>
           
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadedBooks,
  deleteBook,
  assignEditId,
  fetchClientCount,
} from "../slices/bookSlice";
import LazyLoad from "react-lazyload";

export default function MyBooks() {
  const [open, setOpen] = useState(false); // Drawer state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookData, clientCount } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(uploadedBooks());
    dispatch(fetchClientCount());
  }, [dispatch]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleEdit = (id) => {
    dispatch(assignEditId(id));
    navigate("/upload");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteBook(id)).then(() => {
        dispatch(uploadedBooks());
      });
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-60 min-h-screen p-4 ${
          open ? "block" : "hidden"
        } md:block`}
      >
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate("/earnings")}
              className="w-full text-left px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              My Earnings
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 bg-red-600 rounded-md hover:bg-red-500 mt-2"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden bg-gray-800 text-white px-3 py-2 rounded-md"
        >
          ☰ Menu
        </button>

        <h1 className="text-2xl font-bold my-4">My Books</h1>
        <button
          onClick={() => navigate("/upload")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-500"
        >
          Upload Book
        </button>
        <p className="text-lg">Total Uploaded Books: {bookData.length}</p>

        {/* Book List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {Array.isArray(bookData) &&
            bookData?.map((ele) => (
              <div
                key={ele._id}
                className="bg-orange-300 p-4 rounded-lg shadow-md text-center"
              >
                <LazyLoad height={200} offset={100} once>
                  <img
                    src={ele.coverImage}
                    alt={ele.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </LazyLoad>
                <h2 className="font-semibold mt-2">{ele.modifiedTitle}</h2>
                <p className="text-gray-700">Published Year: {ele.publishedYear}</p>
                <p className="text-gray-700">Author: {ele.author}</p>

                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEdit(ele._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ele._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500"
                  >
                    Withdraw
                  </button>
                </div>

                <p
                  className={`mt-2 ${
                    ele.status === "available" ? "text-green-600" : "text-red-600"
                  } font-semibold`}
                >
                  {ele.status === "available" ? "Available" : "Not Available"}
                </p>
                <p className="text-gray-600">Used by: {clientCount[ele._id]}</p>
                <Link to={`/book/${ele._id}/rent`} className="text-blue-500 hover:underline">
                  Rent Details
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
