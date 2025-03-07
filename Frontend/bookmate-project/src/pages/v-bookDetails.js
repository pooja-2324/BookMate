import { useNavigate, useParams } from "react-router-dom";
import { uploadedBooks } from "../slices/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import { currentRentBooks } from "../slices/rentSlice";
import { fetchRentDetails } from "../slices/rentSlice";
import { verifiedVendors } from "../slices/vendorSlice";
import { useContext, useEffect } from "react";
import { AiOutlineUser,AiOutlineUpload,AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import AuthContext from "../context/authContext";

export default function BookDetails() {
    const {handleLogout}=useContext(AuthContext)
    const navigate=useNavigate()
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(uploadedBooks());
        dispatch(currentRentBooks());
        dispatch(verifiedVendors());
        dispatch(fetchRentDetails(bid))
    }, [dispatch]);

    const { bid } = useParams();
    console.log('bid',bid)
    const { rentData,all } = useSelector(state => state.rents);
    const { bookData } = useSelector(state => state.books);
    const { verified } = useSelector(state => state.vendors);
    const book = bookData?.find(ele => ele._id === bid);
    const active = rentData?.find(ele => ele.book?._id === bid);
    const bookOwner = verified?.find(ele => ele.vendor._id === book?.vendor._id);
    const earningsData = bookOwner?.totalEarnings.find(ele => ele.book === bid);
    const earnings = earningsData?.earnings;

    console.log('book owner', bookOwner);
    console.log('fetchrent',all)
    console.log('book details', book);
    console.log('currentRentedBooks', rentData);
    console.log('active', rentData);
    console.log('earnings', earningsData);

    return (
        <div className="min-h-screen flex flex-col bg-[#F4F1DE]">
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
                            onClick={() => navigate("/upload")}
                            className="flex items-center gap-2 text-white hover:underline"
                          >
                            <AiOutlineUpload size={24} /> Upload 
                          </button>
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
        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">Book Details</h2>
        {bookData.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side: Book Image, Basic Details, and Actively Rented By */}
            <div className="md:w-1/3">
              <img
                src={book?.coverImage}
                alt={book?.modifiedTitle}
                className="w-60 h-auto rounded-lg shadow-lg"
              />
              <p className="text-2xl font-semibold mt-4 text-[#1A1A1A]">{book?.modifiedTitle}</p>
              <p className="text-lg text-[#3D405B]">Rent Price: ₹{book?.rentPrice}</p>
              <p className="text-lg text-[#3D405B]">Vendor: {book?.vendor.name}</p>
              {book?.isSelling ? (
                <p className="text-lg text-[#3D405B]">Sale Price: ₹{book?.sellPrice}</p>
              ) : (
                <p className="text-lg text-[#E07A5F] italic">Book is not for sale</p>
              )}
              {book?.rentCount && (
                <p className="text-lg text-[#3D405B]">Rent Count: {book?.rentCount}</p>
              )}
              <p className="text-lg text-[#3D405B]">
                Uploaded on: {new Date(book?.createdAt).toLocaleDateString()}
              </p>
              <p className="text-lg text-[#3D405B]">Rating: {book?.totalRating}</p>
      
              {/* Actively Rented By Section */}
              {book?.status === "notAvailable" && (
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">Actively Rented By</h3>
                  <div className="flex items-center mt-4">
                    <img
                      src={active?.client.profilepic?.url}
                      alt={active?.client.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="ml-4">
                      <p className="text-lg font-semibold text-[#1A1A1A]">{active?.client.name}</p>
                      <p className="text-lg text-[#3D405B]">{active?.client.email}</p>
                      <p className="text-lg text-[#3D405B]">{active?.client.phone}</p>
                      <p className="text-lg text-[#3D405B]">
                        Due on: {new Date(all[0]?.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
      
            {/* Right Side: Additional Details */}
            <div className="md:w-2/3">
              <p className="text-lg text-[#3D405B]">Description:</p>
              <i className="text-[#3D405B]">{book?.description}</i>
              <p className="text-lg text-[#3D405B]">Rent Period: {all[0]?.period}</p>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mt-6">
                Total Earnings of Book: {earnings?earnings:0}/-
              </h3>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mt-6">
                Rent Count: {book.rentCount?book.rentCount:0}
              </h3>
      
              <h3 className="text-2xl font-bold text-[#1A1A1A] mt-6">Pricing</h3>
              <p className="text-lg text-[#3D405B]">
                Caution Deposit: ₹{all[0]?.pricing?.cautionDeposit || "N/A"}/-
              </p>
              <p className="text-lg text-[#3D405B]">
                Reading Fee: ₹{all[0]?.pricing?.readingFee || "N/A"}/-
              </p>
      
              <h3 className="text-2xl font-bold text-[#1A1A1A] mt-6">Reviews</h3>
              <ul className="space-y-4">
                {book?.reviews.map((ele) => (
                  <li key={ele._id} className="border-b pb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={ele.reviewBy?.profilePic?.url}
                        alt={ele.reviewBy.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="text-lg font-semibold text-[#1A1A1A]">{ele.reviewBy.name}</p>
                        <p className="text-sm text-[#3D405B]">
                          {new Date(ele.reviewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg text-[#3D405B] mt-2">{ele.reviewText}</p>
                    <p className="text-lg text-[#3D405B]">Rating: {ele.rating}</p>
                    {ele.photo?.length > 0 && (
                      <img
                        src={ele.photo[0].url}
                        alt="Review"
                        className="w-24 h-auto mt-2 rounded-lg"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-lg text-[#3D405B]">Book details not found</p>
        )}
        <footer className="w-full bg-[#2C3E50] text-white p-4 text-center">
        <p>&copy; 2025 Bookmate. All rights reserved.</p>
      </footer>
      </div>
    );
}