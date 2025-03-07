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
    <div className="min-h-screen flex flex-col bg-[#F4F1DE]">
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
      <div className="flex flex-1">
        {/* Filter Bar */}
        <div className="w-64 bg-[#3D405B] p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-white">Filters</h2>
          <div className="space-y-4">
            {/* Sell Books Filter */}
            <div>
              <label className="flex items-center text-white">
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
              <label className="flex items-center text-white">
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
              <h3 className="font-semibold mb-2 text-white">Categories</h3>
              {["Juvenile Fiction", "Science", "Fiction", "Business & Economics"].map((category) => (
                <label key={category} className="flex items-center text-white">
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
          <div className="bg-[#F8F8F8] p-4 shadow-md flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Books</h2>
            <div className="relative w-full max-w-md">
              <AiOutlineSearch size={24} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D405B] transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#3D405B] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-[#E07A5F] transition-all duration-200 hover:border-[#2C3E50]"
              />
            </div>
            <select
              className="border border-[#3D405B] rounded-md px-3 py-2 text-[#1A1A1A]"
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
                  className="book-card w-48 h-100 text-center shadow-xl rounded-lg p-4 bg-white flex flex-col relative group hover:shadow-2xl transition-shadow duration-200"
                >
                  {/* Book Image */}
                  <div onClick={() => handleImageClick(ele._id)} className="cursor-pointer w-full h-48">
                    <img src={ele.coverImage} alt="Book Cover" className="w-full h-full object-cover rounded-t-lg" />
                  </div>

                  {/* Title & Rating */}
                  <h3 className="text-lg font-semibold mt-2 truncate text-[#1A1A1A]">{ele.modifiedTitle}</h3>
                  <Rating value={ele.totalRating} itemShapes={ThinStar} readOnly style={{ maxWidth: 100, margin: "auto" }} />
                  <i className="text-sm text-[#3D405B]">{ele.status}</i>

                  {/* Hover Effect */}
                  {ele.status === "available" && (
                    <div className="absolute inset-0 bg-[#2C3E50] bg-opacity-90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShop(ele._id);
                        }}
                        className="mt-3 bg-[#E07A5F] text-white px-4 py-2 rounded-md hover:bg-[#D56A4F] transition-colors font-semibold"
                      >
                        <p className="text-white text-sm font-bold">Rent at ₹{ele.rentPrice}/-</p>
                        {ele.isSelling && <p className="text-white text-sm font-bold">Buy at ₹{ele.sellPrice}/-</p>}
                        Shop Now
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-[#3D405B] text-lg">No books found</p>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination flex justify-center gap-4 mt-4 mb-6">
            {currentPage > 1 && (
              <button onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-2 bg-[#3D405B] text-white rounded hover:bg-[#2C3E50] transition-colors">
                Previous
              </button>
            )}
            <span className="text-lg font-semibold text-[#1A1A1A]">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <button onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-2 bg-[#3D405B] text-white rounded hover:bg-[#2C3E50] transition-colors">
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}