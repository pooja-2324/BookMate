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
import { AiOutlineLogout, AiOutlineSearch, AiOutlineAccountBook ,AiOutlineUpload} from "react-icons/ai";

export default function MyBooks() {
  const [open, setOpen] = useState(false); // Drawer state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("availability");
  const [filters, setFilters] = useState({
    sellBooks: false,
    rentBooks: false,
    categories: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(3); // Number of books per page
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookData, clientCount } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(uploadedBooks());
    dispatch(fetchClientCount());
  }, [dispatch]);
  console.log('bookData',bookData)
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
  console.log('bookData',bookData)
  // Apply filters and search
  let filteredBooks = bookData?.filter((ele) => {
    const matchesSearch =
      ele.modifiedTitle?.toLowerCase().includes(searchTerm?.toLowerCase() ?? "") ||
      ele.author?.toLowerCase().includes(searchTerm?.toLowerCase() ?? "") ||
      ele.genre?.some((g) => g?.toLowerCase().includes(searchTerm?.toLowerCase() ?? ""));

    const matchesFilters =
      (!filters.sellBooks || ele.isSelling) &&
      (!filters.rentBooks || ele.status === "available") &&
      (filters.categories.length === 0 || filters.categories.some((cat) => ele.genre?.includes(cat)));

    return matchesSearch && matchesFilters;
  });

  // Sorting logic
  if (sortOption === "ratings") {
    filteredBooks = filteredBooks.sort((a, b) => b.totalRating - a.totalRating);
  } else if (sortOption === "availability") {
    filteredBooks = filteredBooks.sort((a, b) => (a.status === "available" ? -1 : 1));
  } else if (sortOption === "rentPrice") {
    filteredBooks = filteredBooks.sort((a, b) => a.rentPrice - b.rentPrice);
  } else if (sortOption === "sellPrice") {
    filteredBooks = filteredBooks.sort((a, b) => a.sellPrice - b.sellPrice);
  }

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      if (filterType === "categories") {
        const updatedCategories = prevFilters.categories.includes(value)
          ? prevFilters.categories.filter((cat) => cat !== value)
          : [...prevFilters.categories, value];
        return { ...prevFilters, categories: updatedCategories };
      } else {
        return { ...prevFilters, [filterType]: value };
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full h-14 bg-red-700 text-white p-4 flex justify-between items-center px-6 left-0 top-0">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bookmate</h1>
          <nav>
            <ul className="flex space-x-4 items-center">
              <li>
                <Link to="/profile">
                  <AiOutlineAccountBook size={24} /> Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => navigate("/upload")}
                  className="text-white px-4 py-2 rounded-md hover:bg-red-500"
                >
                  <AiOutlineUpload size={24}/>
                  Upload Book
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:underline">
                  <AiOutlineLogout size={24} />
                  Log Out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Search and Sort Bar */}
      <div className="bg-white p-4 shadow-md flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <AiOutlineSearch
            size={24}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
          />
        </div>
        <select
          className="border border-gray-300 rounded-md px-3 py-2"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="availability">Availability</option>
          <option value="ratings">Ratings (High to Low)</option>
          <option value="rentPrice">Rent Price (Low to High)</option>
          <option value="sellPrice">Sell Price (Low to High)</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`bg-gray-100 text-gray-700 w-60 min-h-screen p-4 ${
            open ? "block" : "hidden"
          } md:block`}
        >
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate("/earnings")}
                className="w-full text-left px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                My Earnings
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/calender")}
                className="w-full text-left px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Due Dates
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/clientBook")}
                className="w-full text-left px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Statics
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/currentBooks")}
                className="w-full text-left px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Current Books
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 mt-2"
              >
                Logout
              </button>
            </li>
          </ul>

          {/* Filters Section in Sidebar */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              {/* Sell Books Filter */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.sellBooks}
                    onChange={(e) => handleFilterChange("sellBooks", e.target.checked)}
                    className="mr-2"
                  />
                  Sell Books
                </label>
              </div>

              {/* Rent Books Filter */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.rentBooks}
                    onChange={(e) => handleFilterChange("rentBooks", e.target.checked)}
                    className="mr-2"
                  />
                  Rent Books
                </label>
              </div>

              {/* Category Filters */}
              <div>
                <h3 className="font-semibold mb-2">Categories</h3>
                {["Juvenile Fiction", "Science", "Fiction", "Business & Economics"].map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleFilterChange("categories", category)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
          </div>
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

          {/* Book List */}
          <div className="flex flex-wrap gap-6 justify-center p-6">
            {currentBooks.length > 0 ? (
              currentBooks.map((ele) => (
                <div
                  key={ele._id}
                  className="book-card w-48 h-100 text-center shadow-xl rounded-lg p-4 bg-white flex flex-col relative group"
                >
                  <LazyLoad height={200} offset={100} once>
                    <img
                      src={ele.coverImage}
                      alt={ele.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </LazyLoad>
                  <h2 className="font-semibold mt-2">{ele.modifiedTitle}</h2>
                  
                  {/* Inline Buttons */}
                  <div className="mt-2 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(ele._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-green-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ele._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-500 text-sm"
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
              ))
            ) : (
              <p className="text-gray-700 text-lg">No books found</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded-md ${
                  currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2023 Bookmate. All rights reserved.</p>
      </footer>
    </div>
  );
}