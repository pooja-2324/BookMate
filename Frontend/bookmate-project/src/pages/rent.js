import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRentDetails, assignEditId } from "../slices/rentSlice";
import { useEffect,useContext } from "react";
import { Link } from "react-router-dom";
import { AiOutlineUser,AiOutlineShoppingCart, } from "react-icons/ai";
import AuthContext from "../context/authContext";


export default function Rent() {
    const {handleLogout}=useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookData } = useSelector((state) => state.books);
  const { rentData, editId } = useSelector((state) => state.rents);
  const { bid } = useParams();

  const selectedBook = Array.isArray(bookData) && bookData?.find((ele) => ele._id == bid);
  const rentDetails = Array.isArray(rentData) && rentData?.find((ele) => ele.book == bid);

  useEffect(() => {
    dispatch(fetchRentDetails(bid));
  }, [dispatch, bid]);

  const handleRentEdit = () => {
    dispatch(assignEditId(rentDetails._id));
    navigate(`/book/${bid}/uploadRentDetails`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <header className="w-full bg-orange-500 text-white p-4 flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold">Bookmate</h1>
        <div className="ml-auto flex gap-4">
          <Link to="/profile" className="flex items-center gap-2 text-white hover:underline">
            <AiOutlineUser size={24} /> Profile
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-white hover:underline">
            <AiOutlineShoppingCart size={24} /> Cart

          </Link>
          <li><button onClick={()=>{
        const confirm=window.confirm('Logged out?')
        if(confirm){
          handleLogout()
          localStorage.removeItem('token')
          navigate('/login')
        }
       
       }
       }>Logout</button></li>
        </div>
      </header>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rent Details</h2>
      {selectedBook ? (
        <div className="mb-6">
          <img
            src={selectedBook.coverImage}
            alt={selectedBook.modifiedTitle}
            className="w-60 h-64 object-cover rounded-lg"
          />
          <h3 className="text-xl font-medium text-gray-700 mt-4">Title: {selectedBook.modifiedTitle}</h3>
          <p className="text-gray-600">Author: <b>{selectedBook.author}</b></p>
          <p className="text-gray-600">Published Year: <b>{selectedBook.publishedYear}</b></p>
        </div>
      ) : (
        <p className="text-red-500">No book found</p>
      )}

      {rentDetails ? (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700">Renting Period: <b>{rentDetails?.period}</b></p>
          <p className="text-gray-700">Caution Deposit: <b>{rentDetails?.pricing?.cautionDeposit}</b></p>
          <p className="text-gray-700">Reading Fee: <b>{rentDetails?.pricing?.readingFee}</b></p>
          <button
            onClick={handleRentEdit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Rent Details
          </button>
        </div>
      ) : (
        <p className="text-gray-500">No rent details available</p>
      )}
    </div>
  );
}
