import { useDispatch, useSelector } from "react-redux";
import { upload, updateBook } from "../slices/bookSlice";
import { uploadBuy } from "../slices/buySlice";
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineAccountBook, AiOutlineLogout } from "react-icons/ai";
import AuthContext from "../context/authContext";

export default function Upload() {
  const { handleLogout } = useContext(AuthContext);
  const { serverError, editId, uploaded } = useSelector((state) => state.books);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formInitialValue = {
    title: "",
    rentPrice: "",
    sellPrice: "",
    condition: "",
    isSelling: true,
  };

  const [form, setForm] = useState(formInitialValue);
  const [clientError, setClientError] = useState({});

  const errors = {};
  const runClientValidation = () => {
    if (form.title.trim().length === 0) {
      errors.title = "*Title is required";
    }
    if (form.rentPrice < 0) {
      errors.rentPrice = "*Rent price must be positive";
    }
    if (form.sellPrice < 0) {
      errors.sellPrice = "*Sell price must be positive";
    }
    if (!form.condition) {
      errors.condition = "*Condition is required";
    }
  };

  useEffect(() => {
    if (editId) {
      const book = uploaded.find((ele) => ele._id === editId);
      setForm({ ...book });
    }
  }, [editId, uploaded]);

  const resetForm = () => {
    setForm(formInitialValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runClientValidation();
    if (Object.keys(errors).length === 0) {
      if (editId) {
        dispatch(updateBook({ form, id: editId }));
        navigate("/vhome");
      } else {
        dispatch(upload({ form, resetForm })).then((action) => {
          if (action?.payload?._id) {
            navigate(`/book/${action.payload._id}/uploadrentDetails`);
            dispatch(uploadBuy({ bid: action.payload._id }));
          }
        });
      }
    } else {
      setClientError(errors);
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
            Share Here..!
          </h2>

          {/* Server Error Messages */}
          {serverError && (
            <ul className="mb-4 text-[#E07A5F] text-sm">
              {Array.isArray(serverError) ? (
                serverError.map((ele, index) => <li key={index}>{ele}</li>)
              ) : (
                <li>{serverError}</li>
              )}
            </ul>
          )}

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter the Title.."
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
              {clientError.title && (
                <p className="text-[#E07A5F] text-sm mt-1">{clientError.title}</p>
              )}
            </div>

            {/* Is Selling Field */}
            <div>
              <label className="block text-[#1A1A1A] mb-2">Is Selling?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isSelling"
                    value="true"
                    checked={form.isSelling === true}
                    onChange={() => setForm({ ...form, isSelling: true })}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isSelling"
                    value="false"
                    checked={form.isSelling === false}
                    onChange={() => setForm({ ...form, isSelling: false })}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Condition Field */}
            <div>
              <label className="block text-[#1A1A1A] mb-2">Condition</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              >
                <option value="" disabled>Select</option>
                <option value="fair">Fair</option>
                <option value="new">New</option>
                <option value="good">Good</option>
              </select>
              {clientError.condition && (
                <p className="text-[#E07A5F] text-sm mt-1">{clientError.condition}</p>
              )}
            </div>

            {/* Rent Price Field */}
            <div>
              <input
                type="number"
                value={form.rentPrice}
                onChange={(e) => setForm({ ...form, rentPrice: e.target.value })}
                placeholder="Enter the Rent Price"
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
              {clientError.rentPrice && (
                <p className="text-[#E07A5F] text-sm mt-1">{clientError.rentPrice}</p>
              )}
            </div>

            {/* Sell Price Field (Conditional) */}
            {form.isSelling && (
              <div>
                <input
                  type="number"
                  value={form.sellPrice}
                  onChange={(e) => setForm({ ...form, sellPrice: e.target.value })}
                  placeholder="Enter the Sell Price"
                  className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                />
                {clientError.sellPrice && (
                  <p className="text-[#E07A5F] text-sm mt-1">{clientError.sellPrice}</p>
                )}
              </div>
            )}

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