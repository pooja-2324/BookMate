import { useSelector, useDispatch } from "react-redux";
import { myOrders } from "../slices/orderSlice";
import { returnBook } from "../slices/rentSlice";
import { createReviews } from "../slices/reviewSlice";
import { useEffect, useContext, useState } from "react";
import { Rating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import AuthContext from "../context/authContext";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineUser,AiOutlineHome, AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { orderData } = useSelector((state) => state.orders);
  const [reviewText, setReviewText] = useState({});
  const [rating, setRating] = useState({});
  const [photos, setPhotos] = useState({}); // State to store selected photos
  const [submittedReviews, setSubmittedReviews] = useState({}); // State to store submitted reviews
  const [returnedBooks, setReturnedBooks] = useState({}); // Track returned books
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
      try {
        // Disable the return button immediately
        setReturnedBooks((prevState) => ({
          ...prevState,
          [id]: "pending", // Mark as pending
        }));

        // Dispatch the returnBook action
        await dispatch(returnBook(id)).unwrap();

        // Update the state to mark the book as returned
        setReturnedBooks((prevState) => ({
          ...prevState,
          [id]: "returned", // Mark as returned
        }));
      } catch (error) {
        console.error("Error returning book:", error);
        // Re-enable the return button if the action fails
        setReturnedBooks((prevState) => ({
          ...prevState,
          [id]: undefined,
        }));
        alert("Failed to return the book. Please try again.");
      }
    }
  };

  const handleSubmit = async (bookId) => {
    if (!reviewText[bookId] || !rating[bookId]) {
      alert("Please provide both reviews and ratings");
      return;
    }

    try {
      const reviewData = {
        reviewFor: "Book",
        reviewEntityId: bookId,
        reviewText: reviewText[bookId],
        rating: rating[bookId],
      };

      // Dispatch the createReviews action
      const response = await dispatch(createReviews({ review: reviewData })).unwrap();

      console.log("Review submitted successfully:", response); // Log the response

      // Store the submitted review data in state
      setSubmittedReviews((prevState) => ({
        ...prevState,
        [bookId]: response.review._id, // Ensure response contains the review data
      }));

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

  const handlePhotos = (bookId) => {
    const reviewId = submittedReviews[bookId];
    console.log("review id", bookId); // Get the review ID from the submitted reviews
    if (reviewId) {
      navigate(`/review-photo/${reviewId}`); // Navigate to the ReviewPhotos component with the review ID
    } else {
      alert("Please submit the review first before adding photos.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1DE] p-6">
      {/* Header */}
      <header className="w-full h-16 bg-[#2C3E50] text-white p-4 flex justify-between items-center px-6 left-0 top-0 shadow-md">
        <h1 className="text-2xl font-bold">Bookmate</h1>
        <div className="ml-auto flex gap-4">
          <Link to="/profile" className="flex items-center gap-2 text-white hover:underline">
            <AiOutlineUser size={24} /> Profile
          </Link>
          <Link to='/home'><AiOutlineHome size={24}/>Home</Link>
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
              <AiOutlineLogout size={24}/>
              Logout
            </button>
          </li>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mt-6">
        <h3 className="text-2xl font-bold text-[#1A1A1A] text-center mb-6">
          My Orders - {orderData.length}
        </h3>

        {orderData.map((ele) => {
          const orderType = ele.rent ? "rent" : "buy";
          const isReturned = returnedBooks[ele.book?._id] === "returned";
          const isReturnPending = returnedBooks[ele.book?._id] === "pending";

          return (
            <div
              key={ele._id}
              className="bg-[#F8F8F8] shadow-md rounded-lg p-6 mb-6"
            >
              <div className="flex gap-6">
                {/* Book Cover Image */}
                <img
                  className="w-32 h-48 object-cover rounded-md shadow-sm"
                  src={ele.book?.coverImage}
                  alt="Book Cover"
                />

                {/* Book Details */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">
                    {ele.book?.modifiedTitle}
                  </h2>
                  <p className="text-[#3D405B]">Vendor: {ele.vendor?.name}</p>
                  <p className="text-[#3D405B]">
                    Order placed on:{" "}
                    {(ele.rent?.rentalStartDate || ele.buy?.updatedAt)?.split("T")[0]}
                  </p>
                  {orderType === "rent" && (
                    <p className="text-[#3D405B]">
                      Due On: {ele.rent?.dueDate?.split("T")[0]}
                    </p>
                  )}
                  {orderType === "buy" && (
                    <p className="text-[#3D405B]">
                      Purchase Date: {ele.buy?.updatedAt?.split("T")[0]}
                    </p>
                  )}

                  {/* Return Button */}
                  {orderType === "rent" && (
                    <>
                      <button
                        onClick={() => handleReturn(ele.book._id)}
                        disabled={isReturned || isReturnPending}
                        className={`mt-4 px-4 py-2 rounded-lg text-white font-semibold ${
                          isReturned || isReturnPending
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#E07A5F] hover:bg-[#D56A4F]"
                        } transition-colors`}
                      >
                        {isReturnPending ? "Returning..." : "Return"}
                      </button>
                      {isReturned && (
                        <p className="text-green-600 italic mt-2">
                          Book returned successfully
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Review Section */}
              <div className="mt-6">
                <p className="text-[#1A1A1A] font-semibold">Add Your Comments</p>
                <textarea
                  className="w-full border border-[#3D405B] rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  placeholder="Write your reviews"
                  value={reviewText[ele.book?._id] || ""}
                  onChange={(e) => {
                    setReviewText({ ...reviewText, [ele.book?._id]: e.target.value });
                  }}
                  disabled={isReturned}
                />
                <div className="flex justify-center items-center mt-3">
                  <Rating
                    style={{ maxWidth: 150 }}
                    value={rating[ele.book?._id] || 0}
                    onChange={(value) => setRating({ ...rating, [ele.book?._id]: value })}
                    itemShapes={ThinStar}
                    activeFillColor="#ffb700"
                    inactiveFillColor="#ccc"
                    disabled={isReturned}
                  />
                </div>

                {/* Submit Review Button */}
                <button
                  onClick={() => handleSubmit(ele.book?._id)}
                  //disabled={ !reviewText[ele.book?._id]}
                  className="mt-4 px-4 py-2 bg-[#3D405B] text-white rounded-lg hover:bg-[#2C3E50] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>

                {/* Add Photos Button */}
                <button
                  onClick={() => handlePhotos(ele.book?._id)}
                  //disabled={!submittedReviews[ele.book?._id]}
                  className="mt-4 px-4 py-2 bg-[#E07A5F] text-white rounded-lg hover:bg-[#D56A4F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Photos
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}