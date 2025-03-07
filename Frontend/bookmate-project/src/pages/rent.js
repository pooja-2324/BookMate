import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRentDetails, assignEditId } from "../slices/rentSlice";
import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import AuthContext from "../context/authContext";

export default function Rent() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookData } = useSelector((state) => state.books);
  const { all, editId ,rentData} = useSelector((state) => state.rents);
  const { bid } = useParams();

  const selectedBook = Array.isArray(bookData) && bookData?.find((ele) => ele._id == bid);
  const rentDetails = Array.isArray(all) && all?.find((ele) => ele.book == bid);

  useEffect(() => {
    dispatch(fetchRentDetails({ bid }));
  }, [dispatch, bid]);

  const handleRentEdit = () => {
    if (rentDetails?._id) {
      dispatch(assignEditId(rentDetails._id));
      navigate(`/book/${bid}/uploadRentDetails`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1DE]">
      {/* Header */}
      <header className="w-full h-16 bg-[#2C3E50] text-white p-4 flex justify-between items-center px-6 left-0 top-0 shadow-md">
        <h1 className="text-2xl font-bold">Bookmate</h1>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link to="/profile" className="flex items-center gap-2 text-white hover:underline">
                <AiOutlineUser size={24} /> Profile
              </Link>
            </li>
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
                className="flex items-center gap-2 text-white hover:underline"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="max-w-2xl mx-auto bg-[#F8F8F8] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Rent Details</h2>
          {selectedBook ? (
            <div className="mb-6">
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.modifiedTitle}
                className="w-60 h-64 object-cover rounded-lg shadow-md"
              />
              <h3 className="text-xl font-medium text-[#1A1A1A] mt-4">
                Title: {selectedBook.modifiedTitle}
              </h3>
              <p className="text-[#3D405B]">
                Author: <b>{selectedBook.author}</b>
              </p>
              <p className="text-[#3D405B]">
                Published Year: <b>{selectedBook.publishedYear}</b>
              </p>
            </div>
          ) : (
            <p className="text-[#E07A5F]">No book found</p>
          )}

          {rentDetails ? (
            <div className="p-6 bg-[#F4F1DE] rounded-lg shadow-md">
              <p className="text-[#1A1A1A]">
                Renting Period: <b>{rentDetails?.period}</b>
              </p>
              <p className="text-[#1A1A1A]">
                Caution Deposit: <b>{rentDetails?.pricing?.cautionDeposit || "N/A"}/-</b>
              </p>
              <p className="text-[#1A1A1A]">
                Reading Fee: <b>{rentDetails?.pricing?.readingFee || "N/A"}/-</b>
              </p>
              <button
                onClick={handleRentEdit}
                className="mt-4 px-4 py-2 bg-[#3D405B] text-white rounded-lg hover:bg-[#2C3E50] transition-colors"
              >
                Edit Rent Details
              </button>
            </div>
          ) : (
            <p className="text-[#3D405B]">No rent details available</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#2C3E50] text-white p-4 text-center">
        <p>&copy; 2025 Bookmate. All rights reserved.</p>
      </footer>
    </div>
  );
}