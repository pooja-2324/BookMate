import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { uploadRentDetails, updateRentDetails } from "../slices/rentSlice";
import { AiOutlineAccountBook, AiOutlineLogout } from "react-icons/ai";
import AuthContext from "../context/authContext";
import { useContext } from "react";

export default function RentDetails() {
  const { handleLogout } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bid } = useParams();
  const { all,rentData, editId } = useSelector((state) => state.rents);

  const formInitialValue = {
    period: "",
    pricing: {
      cautionDeposit: "",
      readingFee: "",
      deliveryFee: "",
      platformFee: "",
    },
  };

  const [form, setForm] = useState(formInitialValue);
 
  useEffect(() => {
    if (editId && all.length) {
      const rent = all.find((ele) => String(ele._id) === String(editId));
      if (rent) {
        setForm({ ...rent });
      }
    }
  }, [editId, rentData]);
  
 console.log('edit id',editId)
  const resetForm = () => {
    setForm(formInitialValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editId) {
      dispatch(uploadRentDetails({ bid, form, resetForm })).then(() => {
        navigate("/vhome");
      });
    } else {
      dispatch(updateRentDetails({ id: editId, form, resetForm })).then(() => {
        navigate(`/book/${bid}/rent`);
      });
    }
  };
  console.log('rentData',all)

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1DE]">
      {/* Header */}
      <header className="w-full h-16 bg-[#2C3E50] text-white p-4 flex justify-between items-center px-6 left-0 top-0 shadow-md">
        <h1 className="text-2xl font-bold">Bookmate</h1>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link to="/profile" className="flex items-center gap-2 text-white hover:underline">
                <AiOutlineAccountBook size={24} /> Profile
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

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="bg-[#F8F8F8] p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#1A1A1A] mb-6">
            {editId ? "Edit" : "Create"} Rent Details
          </h2>

          {/* Rent Details Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Period Field */}
            <div>
              <input
                type="number"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                placeholder="Enter Period (in days)"
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
            </div>

            {/* Caution Deposit Field */}
            <div>
              <input
                type="number"
                value={form.pricing?.cautionDeposit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pricing: { ...form.pricing, cautionDeposit: e.target.value },
                  })
                }
                placeholder="Enter Caution Deposit"
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
            </div>

            {/* Delivery Fee Field */}
            <div>
              <input
                type="number"
                value={form.pricing?.deliveryFee}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pricing: { ...form.pricing, deliveryFee: e.target.value },
                  })
                }
                placeholder="Enter Delivery Fee"
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
            </div>

            {/* Platform Fee Field */}
            <div>
              <input
                type="number"
                value={form.pricing?.platformFee}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pricing: { ...form.pricing, platformFee: e.target.value },
                  })
                }
                placeholder="Enter Platform Fee"
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#3D405B] text-white py-2 rounded-lg hover:bg-[#2C3E50] transition-colors"
            >
              {editId ? "Update" : "Create"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#2C3E50] text-white p-4 text-center">
        <p>&copy; 2025 Bookmate. All rights reserved.</p>
      </footer>
    </div>
  );
}