import { getReviews } from "../slices/reviewSlice";
import { verifiedBooks } from "../slices/bookSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Rating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

export default function ReviewDetails() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { bid } = useParams();
  const dispatch = useDispatch();
  const { reviewData } = useSelector((state) => state.reviews);
  const { bookData } = useSelector((state) => state.books);
  const [bookRating, setBookrating] = useState(0);

  useEffect(() => {
    dispatch(getReviews({ bid }));
    dispatch(verifiedBooks());
  }, [dispatch, bid]);

  const oneBook = bookData.find((ele) => ele._id === bid);
  console.log("oneBook", oneBook);

  useEffect(() => {
    const average = reviewData?.map((ele) => ele.rating) || [];
    if (average.length > 0) {
      const total = average.reduce((acc, cv) => acc + cv, 0);
      const avgRating = total / average.length;
      setBookrating(avgRating);
    } else {
      setBookrating(0);
    }
  }, [reviewData]);

  const handleRent = (id) => {
    navigate(`/book/${id}/rentnow`);
  };

  const handleBuy = (id) => {
    navigate(`/book/${id}/orderplacing`, { state: { price: oneBook.sellPrice, type: "buy" } });
  };

  if (!oneBook) return <p className="text-center text-lg font-semibold">Book not found.</p>;

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
      <div className="max-w-6xl mx-auto p-6">
        {/* Book Image and Details */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Image (Left Side) */}
          <div className="flex-shrink-0 w-full md:w-1/2">
            <img
              className="w-full h-auto max-w-md rounded-lg shadow-md bg-[#F8F8F8] p-4"
              src={oneBook?.coverImage}
              alt="Book Cover"
            />
          </div>

          {/* Book Details (Right Side) */}
          <div className="flex-grow w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">{oneBook.modifiedTitle}</h2>

            {/* Rent and Buy Buttons */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => handleRent(oneBook._id)}
                disabled={oneBook.status === "notAvailable"}
                className={`mt-3 px-4 py-2 rounded-md transition-colors font-semibold ${
                  oneBook.status === "notAvailable"
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-[#3D405B] text-white hover:bg-[#2C3E50]"
                }`}
              >
                Rent at ₹{oneBook.rentPrice}/-
              </button>

              {oneBook.isSelling && (
                <button
                  onClick={() => handleBuy(oneBook._id)}
                  disabled={oneBook.status === "notAvailable"}
                  className={`mt-3 px-4 py-2 rounded-md transition-colors font-semibold ${
                    oneBook.status === "notAvailable"
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-[#E07A5F] text-white hover:bg-[#D56A4F]"
                  }`}
                >
                  Buy at ₹{oneBook.sellPrice}/-
                </button>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <p className="text-[#3D405B]">
                <strong>Rating:</strong> {bookRating.toFixed(1)}
                <Rating
                  value={bookRating}
                  itemShapes={ThinStar}
                  readOnly
                  style={{ maxWidth: 100, marginLeft: 10 }}
                />
              </p>
              <p className="text-[#3D405B]"><strong>Author:</strong> {oneBook.author}</p>
              <p className="text-[#3D405B]"><strong>Published Year:</strong> {oneBook.publishedYear}</p>
              {oneBook.genre?.length !== 0 && (
                <p className="text-[#3D405B]"><strong>Theme:</strong> {oneBook.genre.join(", ")}</p>
              )}
              {oneBook.pages && <p className="text-[#3D405B]"><strong>Pages:</strong> {oneBook.pages}</p>}
              <p className="text-[#3D405B]"><strong>Vendor:</strong> {oneBook.vendor.name}</p>
              <p className="text-[#3D405B]"><strong>Description:</strong> <i>{oneBook.description}</i></p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <hr className="my-6 border-[#3D405B]" />
        <h5 className="text-lg font-bold text-[#1A1A1A]">Customer Reviews</h5>
        <ul className="space-y-6 mt-4">
          {reviewData?.map((ele) => (
            <li key={ele._id} className="border border-[#3D405B] rounded-lg p-4 shadow-md bg-[#F8F8F8]">
              {/* Reviewer Name and Date */}
              <strong className="text-[#1A1A1A]">{ele.reviewBy.name}</strong>
              <p className="text-[#3D405B] text-sm">Posted on {ele.updatedAt.split("T")[0]}</p>

              {/* Review Text */}
              <p className="text-[#3D405B] mt-2">{ele.reviewText}</p>

              {/* Review Rating */}
              <div className="flex items-center mt-2">
                <Rating
                  value={ele.rating}
                  itemShapes={ThinStar}
                  readOnly
                  style={{ maxWidth: 100 }}
                />
                <span className="ml-2 px-2 py-1 bg-[#E07A5F] text-white text-sm rounded-md">
                  {ele.rating}
                </span>
              </div>

              {/* Review Photos */}
              {ele.photo?.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {ele.photo.map((image, index) => (
                    <img
                      key={index}
                      src={image.url} // Assuming `photo` contains objects with a `url` property
                      alt={`Review ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}