import { fetchClientBookRentDetails } from "../slices/clientSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/authContext";
import { AiOutlineUpload, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

export default function ClientBook() {
  const { userState, handleLogout } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientData } = useSelector((state) => state.clients);
  const [visibleRows, setVisibleRows] = useState(10); // State to control visible rows
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const flatData = clientData?.flat();
  console.log('client data',clientData)
console.log('flat data',flatData)
  useEffect(() => {
    dispatch(fetchClientBookRentDetails());
  }, [dispatch]);

  // Function to load more rows when scrolling
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const threshold = 50; // Adjust this value as needed
    if (scrollHeight - (scrollTop + clientHeight) < threshold && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleRows((prev) => prev + 10); // Increase visible rows by 10
        setIsLoading(false);
      }, 500); // Simulate a delay for loading
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
                onClick={() => navigate("/upload")}
                className="flex items-center gap-2 text-white hover:underline"
              >
                <AiOutlineUpload size={24} /> Upload Book
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

      {/* Main Content */}
      <div className="flex-grow p-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Books&Client</h2>
        <div
          className="overflow-x-auto bg-[#F8F8F8] rounded-lg shadow-md"
          onScroll={handleScroll}
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-[#3D405B] text-white">
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Book</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">Due Date</th>
                <th className="p-3 text-left">Returned Date</th>
                <th className="p-3 text-left">Late Fee</th>
                <th className="p-3 text-left">Damage Fee</th>
              </tr>
            </thead>
            <tbody>
              {flatData
                ?.filter((ele) => ele.book?.vendor === userState.user._id)
                .slice(0, visibleRows) // Limit rows to `visibleRows`
                .map((ele, i) => (
                  <tr key={ele._id} className="border-b hover:bg-[#F4F1DE] transition-colors">
                    <td className="p-3 text-[#1A1A1A]">{ele.rent?.client?.name}</td>
                    <td className="p-3 text-[#1A1A1A]">{ele.book?.modifiedTitle}</td>
                    <td className="p-3 text-[#1A1A1A]">{ele.rent?.rentedBookStatus}</td>
                    <td className="p-3 text-[#1A1A1A]">{ele.rent?.rentalStartDate.split("T")[0]}</td>
                    <td className="p-3 text-[#1A1A1A]">{ele.rent?.dueDate.split("T")[0]}</td>
                    <td className="p-3 text-[#1A1A1A]">
                      {ele.rent?.rentedBookStatus === "completed" ? (
                        ele.rent?.returnedDate.split("T")[0]
                      ) : (
                        <p className="text-[#E07A5F]">Not returned</p>
                      )}
                    </td>
                    <td className="p-3 text-[#1A1A1A]">{ele.rent?.lateFee}</td>
                    <td className="p-3 text-[#1A1A1A]">{ele.rent?.damageFee}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isLoading && (
            <div className="p-3 text-center text-[#3D405B]">Loading more...</div>
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