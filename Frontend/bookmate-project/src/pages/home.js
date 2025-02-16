import { useSelector, useDispatch } from "react-redux";
import { verifiedBooks } from "../slices/bookSlice";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { AiOutlineUser, AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import AuthContext from "../context/authContext";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookData } = useSelector((state) => state.books);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("availability");
  const [filters, setFilters] = useState({
    sellBooks: false,
    rentBooks: false,
    categories: [],
  });
  const { handleLogout } = useContext(AuthContext);

  useEffect(() => {
    dispatch(verifiedBooks());
  }, [dispatch]);

  const handleShop = (id) => navigate(`/review/${id}`);
  const handleSell = (id) => navigate(`/review/${id}`);
  const handleImageClick = (id) => navigate(`/review/${id}`);

  // Apply filters and search
  let filteredBooks = (bookData || []).filter((ele) => {
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

  const booksPerPage = 4;
  const lastBookIndex = currentPage * booksPerPage;
  const firstBookIndex = lastBookIndex - booksPerPage;
  const currentBooks = filteredBooks.slice(firstBookIndex, lastBookIndex);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

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
    <div className="min-h-screen flex flex-col bg-gray-300">
      {/* Header */}
      <header className="w-full h-8 bg-red-700 text-white p-4 flex justify-between items-center px-6 left-0 top-0">
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
      <div className="flex flex-1">
        {/* Filter Bar */}
        <div className="w-64 bg-grey-800 p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-4 ">Filters</h2>
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
              {["Juvenile Fiction", "Science", "Fiction","Business & Economics"].map((category) => (
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

        {/* Content Area */}
        <div className="flex-1">
          {/* Sorting Dropdown */}
          <div className="bg-white p-4 shadow-md flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Books</h2>
            <div className="relative w-full max-w-md">
              <AiOutlineSearch size={24} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200" />
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

          {/* Books Display */}
          <div className="flex flex-wrap gap-6 justify-center p-6">
            {currentBooks.length > 0 ? (
              currentBooks.map((ele) => (
                <div
                  key={ele._id}
                  className="book-card w-40 h-100 text-center shadow-xl rounded-lg p-4 bg-white-500 flex flex-col relative group"
                >
                  {/* Book Image */}
                  <div onClick={() => handleImageClick(ele._id)} className="cursor-pointer w-1000 h-30">
                    <img src={ele.coverImage} alt="Book Cover" className="w-1000 h-20 object-cover rounded-t-lg" />
                  </div>

                  {/* Title & Rating */}
                  <h3 className="text-lg font-semibold mt-2 truncate text-gray-800">{ele.modifiedTitle}</h3>
                  <Rating value={ele.totalRating} itemShapes={ThinStar} readOnly style={{ maxWidth: 100, margin: "auto" }} />
                  <i className="text-sm text-gray-700">{ele.status}</i>

                  {/* Hover Effect */}
                  {ele.status === "available" && (
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShop(ele._id);
                        }}
                        className="mt-3 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors font-semibold"
                      >
                        <p className="text-black text-sm font-bold">Rent at ₹{ele.rentPrice}/-</p>
                        {ele.isSelling && <p className="text-black text-sm font-bold">Buy at ₹{ele.sellPrice}/-</p>}
                        Shop Now
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-700 text-lg">No books found</p>
            )}
          </div>

          {/* Pagination */}
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
      </div>
    </div>
  );
}
// import { useSelector, useDispatch } from "react-redux";
// import {  verifiedBooks } from "../slices/bookSlice";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Rating, ThinStar } from "@smastrom/react-rating";
// import "@smastrom/react-rating/style.css";

// export default function MyBooks() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { bookData } = useSelector((state) => state.books);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     dispatch(verifiedBooks());
//   }, [dispatch]);

//   const booksPerPage = 4;
//   const lastBookIndex = currentPage * booksPerPage;
//   const firstBookIndex = lastBookIndex - booksPerPage;
//   const currentBooks = bookData?.slice(firstBookIndex, lastBookIndex);
//   const totalPages = Math.ceil(bookData.length / booksPerPage);

//   const handleImageClick = (id) => navigate(`/review/${id}`);

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       <header className="w-full bg-orange-500 text-white p-4 flex justify-center">
//         <h1 className="text-2xl font-bold">My Books</h1>
//       </header>

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
//             </div>
//           ))
//         ) : (
//           <p>No books found</p>
//         )}
//       </div>

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
