import { useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEarnings, uploadedBooks } from "../slices/bookSlice";
import { Chart } from "react-google-charts";
import {AiOutlineUpload,AiOutlineLogout,AiOutlineUser} from 'react-icons/ai'
import {Link,useNavigate} from 'react-router-dom'
import AuthContext from "../context/authContext";


export default function Earnings() {
  const {handleLogout}=useContext(AuthContext)
  const dispatch = useDispatch();
  const navigate=useNavigate()
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
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="w-full h-14 bg-red-700 text-white p-4 flex justify-between items-center px-6 left-0 top-0">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Bookmate</h1>
                <nav>
                  <ul className="flex space-x-4 items-center">
                    <li>
                      <Link to="/profile">
                        <AiOutlineUser size={24} /> Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate("/upload")}
                        className="text-white px-4 py-2 rounded-md hover:bg-red-500"
                      >
                        <AiOutlineUpload size={24}/>
                        Upload Book
                      </button>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="hover:underline">
                        <AiOutlineLogout size={24} />
                        Log Out
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Earnings</h2>
      <h4 className="text-lg font-medium text-gray-700">Total Earnings: <span className="font-bold">{totalEarnings}</span></h4>
      <h4 className="text-lg font-medium text-gray-700 mb-4">Total Uploaded Books: <span className="font-bold">{bookData.length}</span></h4>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-grey-400 text-grey">
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
              <tr key={i} className="border-b hover:bg-orange-100">
                <td className="py-2 px-4">{i + 1}</td>
                <td className="py-2 px-4">{stats.book?.modifiedTitle || "Unknown Book"}</td>
                <td className="py-2 px-4">{new Date(stats.book?.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 font-bold text-green-600">₹{stats.earnings}</td>
                <td className="py-2 px-4">{stats.book?.rentCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <Chart chartType="PieChart" data={chartData} options={chartOptions} width="100%" height="400px" />
      </div>
    </div>
  );
}
