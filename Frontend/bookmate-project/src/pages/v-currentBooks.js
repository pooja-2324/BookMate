import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { currentRentBooks, toDelivered } from "../slices/rentSlice";
import { currentPurchasedBooks, SaleToDelivered } from "../slices/buySlice";
import { AiOutlineUpload, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext";

export default function CurrentBooks() {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [initialRentData, setInitialRentData] = useState([]);
  const [initialSellData, setInitialSellData] = useState([]);
  const dispatch = useDispatch();
  const { rentData } = useSelector((state) => state.rents);
  const { buyData } = useSelector((state) => state.buys);

  useEffect(() => {
    // Fetch rented books
    dispatch(currentRentBooks()).then((action) => {
      if (action.payload) {
        setInitialRentData(action.payload); // Store the initial rentData
      }
    });

    // Fetch purchased books
    dispatch(currentPurchasedBooks()).then((action) => {
      if (action.payload) {
        setInitialSellData(action.payload); // Store the initial sellData
      }
    });
  }, [dispatch]);

  const handleDeliver = (id) => {
    const rent = initialRentData.find((ele) => ele._id === id);
    const confirm = window.confirm(
      `The ${rent.book?.modifiedTitle} is delivered to ${rent.client?.name}`
    );
    if (confirm) {
      dispatch(toDelivered(id)).then(() => {
        // Remove the delivered item from the state
        setInitialRentData((prevData) => prevData.filter((ele) => ele._id !== id));
      });
    }
  };

  const handleDeliverSale = (id) => {
    const sale = initialSellData.find((ele) => ele._id === id);
    const confirm = window.confirm(
      `The ${sale?.book?.modifiedTitle} is delivered to ${sale?.client?.name}`
    );
    if (confirm) {
      dispatch(SaleToDelivered(id)).then(() => {
        // Remove the delivered item from the state
        setInitialSellData((prevData) => prevData.filter((ele) => ele._id !== id));
      });
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
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Current Books</h2>

        {/* Rented Books Table */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Rented Books</h3>
          <div className="overflow-x-auto bg-[#F8F8F8] rounded-lg shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-[#3D405B] text-white">
                  <th className="p-3 text-left">Book</th>
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Rent Starts On</th>
                  <th className="p-3 text-left">Rent Ends On</th>
                  <th className="p-3 text-left">Duration</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {initialRentData?.map((ele) => (
                  <tr key={ele._id} className="border-b hover:bg-[#F4F1DE] transition-colors">
                    <td className="p-3 text-[#1A1A1A]">{ele.book?.modifiedTitle}</td>
                    <td className="p-3 text-[#1A1A1A]">{ele.client?.name}</td>
                    <td className="p-3 text-[#1A1A1A]">{ele.rentalStartDate.split("T")[0]}</td>
                    <td className="p-3 text-[#1A1A1A]">{ele.dueDate.split("T")[0]}</td>
                    <td className="p-3 text-[#1A1A1A]">{ele.period}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeliver(ele._id)}
                        className="px-4 py-2 bg-[#E07A5F] text-white rounded-lg hover:bg-[#D2694E] transition-colors"
                      >
                        Deliver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchased Books Table */}
        <div>
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Purchased Books</h3>
          <div className="overflow-x-auto bg-[#F8F8F8] rounded-lg shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-[#3D405B] text-white">
                  <th className="p-3 text-left">Book</th>
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {initialSellData?.map((ele) => (
                  <tr key={ele._id} className="border-b hover:bg-[#F4F1DE] transition-colors">
                    <td className="p-3 text-[#1A1A1A]">{ele.book?.modifiedTitle}</td>
                    <td className="p-3 text-[#1A1A1A]">{ele.client?.name}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeliverSale(ele._id)}
                        className="px-4 py-2 bg-[#E07A5F] text-white rounded-lg hover:bg-[#D2694E] transition-colors"
                      >
                        Deliver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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