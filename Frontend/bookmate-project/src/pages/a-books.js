import { verifiedBooks, blockedBooks, verify } from '../slices/bookSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineUser ,AiOutlineLogout} from 'react-icons/ai';
import AuthContext from '../context/authContext';
export default function AdminBooks() {
  const navigate=useNavigate()
  const {handleLogout}=useContext(AuthContext)
  const dispatch = useDispatch();
  const { bookData, blocked } = useSelector(state => state.books);
  const [showReviews, setShowReviews] = useState({});

  useEffect(() => {
    dispatch(verifiedBooks());
    dispatch(blockedBooks());
  }, [dispatch, bookData.length, blocked.length]);

  const handleCheckboxChange = (bid, isVerified) => {
    dispatch(verify({ bid, isVerified: !isVerified }));
    dispatch(verifiedBooks());
    dispatch(blockedBooks());
  };

  const toggleReviews = (bookId) => {
    setShowReviews(prev => ({ ...prev, [bookId]: !prev[bookId] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1DE]">
      <header className="w-full h-16 bg-[#2C3E50] text-white p-4 flex justify-between items-center px-6 shadow-md">
                      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                      <nav>
                          <ul className="flex space-x-4 items-center">
                              <li><Link to="/admin-users" className="text-lg font-medium text-white-600 hover:text-blue-800">Vendors</Link></li>
                          <li><Link to="/admin-clients" className="text-lg font-medium text-white-600 hover:text-blue-800">Clients</Link></li>
                          <li><Link to="/admin-books" className="text-lg font-medium text-white-600 hover:text-blue-800">Books</Link></li>
                      
                              <li>
                                  <Link to="/admin-profile" className="flex items-center gap-2 text-white hover:underline">
                                      <AiOutlineUser size={24} /> Profile
                                  </Link>
                              </li>
                               <li>
                                  <button  onClick={() => {
                  const confirm = window.confirm("Logged out?");
                  if (confirm) {
                    handleLogout();
                    localStorage.removeItem("token");
                    navigate("/login");
                  }
                }} className="flex items-center gap-2 text-white hover:underline">
                                 <AiOutlineLogout size={24} /> Logout
                                    </button>
                                </li>
                          </ul>
                      </nav>
                  </header>
      
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Verified Books({bookData.length})</h2>
      {bookData.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookData.map(ele => (
            <li key={ele._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex">
                <div className="w-1/3">
                  <img
                    src={ele.coverImage}
                    alt={ele.modifiedTitle}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-lg font-semibold text-gray-800">{ele.modifiedTitle}</p>
                </div>
                <div className="w-2/3 pl-4">
                  <p className="text-sm text-gray-600">Vendor: {ele.vendor.name}</p>
                  <p className="text-sm text-gray-600">Rent At: Rs{ele.rentPrice}</p>
                  {ele.sellingPrice > 0 && (
                    <p className="text-sm text-gray-600">Sale At: Rs{ele.sellingPrice}</p>
                  )}
                  <p className="text-sm text-gray-600">Rent Count: {ele.rentCount}</p>
                  <p className="text-sm text-gray-600">Rating: {Math.round(ele.totalRating, 2)}</p>
                  <p className="text-sm text-gray-600">Created At: {new Date(ele.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Status: {ele.status}</p>
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={ele.isVerified}
                      onChange={() => handleCheckboxChange(ele._id, ele.isVerified)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Verified</span>
                  </label>
                </div>
              </div>
              <button onClick={() => toggleReviews(ele._id)} className="mt-4 text-blue-600 underline">
                {showReviews[ele._id] ? "Hide Reviews" : "See All Reviews"}
              </button>
              {showReviews[ele._id] && ele.reviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-lg font-semibold text-gray-800">Reviews</p>
                  <ul className="mt-2 space-y-2">
                    {ele.reviews.map(rev => (
                      <li key={rev._id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <img
                            src={rev.reviewBy?.profilePic?.url || "https://via.placeholder.com/40"}
                            alt={rev.reviewBy?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-800">{rev.reviewBy?.name}</p>
                            <p className="text-xs text-gray-600">Rating: {rev.rating}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{rev.reviewText}</p>
                        {rev.photo?.length > 0 && (
                          <div className="flex space-x-2 mt-2">
                            {rev.photo.map((img, index) => (
                              <img
                                key={index}
                                src={img.url}
                                alt="Review Image"
                                className="w-16 h-16 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No verified books found.</p>
      )}
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Blocked Books({blocked.length})</h2>
      {blocked.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocked.map(ele => (
            <li key={ele._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex">
                {/* Left Side: Image and Title */}
                <div className="w-1/3">
                  <img
                    src={ele.coverImage}
                    alt={ele.modifiedTitle}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-lg font-semibold text-gray-800">{ele.modifiedTitle}</p>
                </div>

                {/* Right Side: Details */}
                <div className="w-2/3 pl-4">
                  <p className="text-sm text-gray-600">Vendor: {ele.vendor.name}</p>
                  <p className="text-sm text-gray-600">Rent At: ${ele.rentPrice}</p>
                  {ele.sellingPrice > 0 && (
                    <p className="text-sm text-gray-600">Sale At: ${ele.sellingPrice}</p>
                  )}
                  <p className="text-sm text-gray-600">Rent Count: {ele.rentCount}</p>
                  <p className="text-sm text-gray-600">Rating: {Math.round(ele.totalRating, 2)}</p>
                  <p className="text-sm text-gray-600">Created At: {new Date(ele.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Status: {ele.status}</p>
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={ele.isVerified}
                      onChange={() => handleCheckboxChange(ele._id, ele.isVerified)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Verified</span>
                  </label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No blocked books found.</p>
      )}
    </div>
  );
}
