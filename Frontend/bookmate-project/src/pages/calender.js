import { format } from "date-fns";
import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { activeRent } from "../slices/rentSlice";
import { AiOutlineUpload, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext";

export default function DueDateCalendar() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { rentData } = useSelector((state) => state.rents);
  const [dueDates, setDueDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateDetails, setSelectedDateDetails] = useState([]);

  useEffect(() => {
    dispatch(activeRent()).then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (rentData?.length > 0) {
      setDueDates(
        rentData?.map((ele) => ({
          date: format(new Date(ele.dueDate), "yyyy-MM-dd"),
          clientName: ele.client?.name,
          book: ele.book?.modifiedTitle,
          rentalStartDate: ele.rentalStartDate,
          dueDate: ele.dueDate,
          period: ele.period,
        }))
      );
    }
  }, [rentData]);

  const handleDateClick = (date) => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    const details = rentData.filter(
      (ele) => format(new Date(ele.dueDate), "yyyy-MM-dd") === formattedDate
    );
    setSelectedDateDetails(details);
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
              }}assName="flex items-center gap-2 text-white hover:underline">
                <AiOutlineLogout size={24} /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Due Date Calendar</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Calendar Section */}
          <div className="w-full md:w-1/2 bg-[#F8F8F8] p-6 rounded-lg shadow-md">
            {loading ? (
              <p className="text-[#3D405B]">Loading due dates...</p>
            ) : (
              <Calendar
                className="border border-[#3D405B] rounded-lg p-4 shadow-md w-full"
                tileClassName={({ date }) => {
                  if (!date || isNaN(date.getTime())) return "";
                  const formattedDate = format(new Date(date), "yyyy-MM-dd");
                  return dueDates.some((ele) => ele.date === formattedDate)
                    ? "bg-[#E07A5F] text-white rounded-full"
                    : "";
                }}
                onClickDay={handleDateClick}
              />
            )}
          </div>

          {/* Rent Details Section */}
          <div className="w-full md:w-1/2 bg-[#F8F8F8] p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Rent Details</h3>
            {selectedDateDetails.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#3D405B] text-white">
                    <th className="p-3 text-left">Book</th>
                    <th className="p-3 text-left">Client</th>
                    <th className="p-3 text-left">Start Date</th>
                    <th className="p-3 text-left">Due Date</th>
                    <th className="p-3 text-left">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDateDetails.map((ele, index) => (
                    <tr key={index} className="border-b hover:bg-[#F4F1DE] transition-colors">
                      <td className="p-3 text-[#1A1A1A]">{ele.book?.modifiedTitle}</td>
                      <td className="p-3 text-[#1A1A1A]">{ele.client?.name}</td>
                      <td className="p-3 text-[#1A1A1A]">
                        {format(new Date(ele.rentalStartDate), "yyyy-MM-dd")}
                      </td>
                      <td className="p-3 text-[#1A1A1A]">
                        {format(new Date(ele.dueDate), "yyyy-MM-dd")}
                      </td>
                      <td className="p-3 text-[#1A1A1A]">{ele.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-[#3D405B]">Select a date to view details</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#2C3E50] text-white p-4 text-center">
        <p>&copy; 2025 Bookmate. All rights reserved.</p>
      </footer>
    </div>
  );
}