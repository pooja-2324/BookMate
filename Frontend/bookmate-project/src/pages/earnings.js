import { useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEarnings, uploadedBooks } from "../slices/bookSlice";
import { Chart } from "react-google-charts";
import { AiOutlineUpload, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext";

export default function Earnings() {
  const { handleLogout } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookData, earningsData } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(uploadedBooks());
    dispatch(fetchEarnings());
  }, [dispatch]);

  const totalEarnings = useMemo(() => {
    if (!earningsData || !Array.isArray(earningsData)) return 0;
    return earningsData.reduce((sum, stats) => sum + (stats.earnings || 0), 0);
  }, [earningsData]);

  const chartData = useMemo(() => {
    if (!earningsData || !Array.isArray(earningsData)) return [["Book", "Earnings"]];
    return [
      ["Book", "Earnings"],
      ...earningsData.map((stats) => [
        stats.book?.modifiedTitle || "Unknown Book",
        stats.earnings || 0,
      ]),
    ];
  }, [earningsData]);

  const chartOptions = {
    title: "Earnings by Book",
    pieHole: 0.4,
    is3D: false,
    titleTextStyle: {
      color: "#1A1A1A",
      fontSize: 18,
      bold: true,
    },
    legend: {
      textStyle: {
        color: "#1A1A1A",
      },
    },
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
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">My Earnings</h2>
        <h4 className="text-lg font-medium text-[#3D405B]">
          Total Earnings: <span className="font-bold text-[#E07A5F]">₹{totalEarnings}</span>
        </h4>
        <h4 className="text-lg font-medium text-[#3D405B] mb-6">
          Total Uploaded Books: <span className="font-bold text-[#E07A5F]">{bookData.length}</span>
        </h4>

        {/* Earnings Table */}
        <div className="overflow-x-auto bg-[#F8F8F8] rounded-lg shadow-md">
          <table className="w-full">
            <thead className="bg-[#3D405B] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Sl. No</th>
                <th className="py-3 px-4 text-left">Books</th>
                <th className="py-3 px-4 text-left">Uploaded At</th>
                <th className="py-3 px-4 text-left">Earnings</th>
                <th className="py-3 px-4 text-left">Rent Count</th>
              </tr>
            </thead>
            <tbody>
              {earningsData && Array.isArray(earningsData) && earningsData.map((stats, i) => (
                <tr key={i} className="border-b hover:bg-[#F4F1DE] transition-colors">
                  <td className="py-3 px-4 text-[#1A1A1A]">{i + 1}</td>
                  <td className="py-3 px-4 text-[#1A1A1A]">{stats.book?.modifiedTitle || "Unknown Book"}</td>
                  <td className="py-3 px-4 text-[#1A1A1A]">
                    {new Date(stats.book?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#E07A5F]">₹{stats.earnings}</td>
                  <td className="py-3 px-4 text-[#1A1A1A]">{stats.book?.rentCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Earnings Chart */}
        <div className="mt-6 bg-[#F8F8F8] p-6 rounded-lg shadow-md">
          <Chart
            chartType="PieChart"
            data={chartData}
            options={chartOptions}
            width="100%"
            height="400px"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#2C3E50] text-white p-4 text-center">
        <p>&copy; 2025 Bookmate. All rights reserved.</p>
      </footer>
    </div>
  );
}