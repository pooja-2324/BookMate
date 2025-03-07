import { useContext, useState, useRef } from "react";
import AuthContext from "../context/authContext";
import axios from "../config/axios";
import { AiOutlineMoneyCollect, AiOutlineBook ,AiOutlineLogout,AiOutlineProduct} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { userState, handleUpdate, handleLogout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); // Ref for the file input

  const [form, setForm] = useState({
    name: userState.user.name,
    email: userState.user.email,
    phone: userState.user.phone,
    location: {
      city: userState?.user?.location?.city,
      state: userState?.user?.location?.state,
    },
  });

  console.log("user", userState.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updatedUser = {
        ...userState.user,
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: {
          city: form.location.city,
          state: form.location.state,
        },
      };

      const response = await axios.put("/api/user/update", updatedUser, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      handleUpdate(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await axios.post("/api/user/profilePic", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      handleUpdate(response.data); // Update the user state with the new profile picture
      setLoading(false);
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError(err.response?.data?.message || "Failed to upload profile picture");
      setLoading(false);
    }
  };
  console.log("profilepic", userState.user?.profilePic?.url);

  return (
    <div className="min-h-screen bg-[#F4F1DE]">
      {/* Header */}
      <header className="w-full h-16 bg-[#2C3E50] text-white p-4 flex justify-between items-center px-6 left-0 top-0 shadow-md">
        <h1 className="text-2xl font-bold">Bookmate</h1>
        <div className="ml-auto flex gap-4">
          {userState.user.role=='client'?<><Link to='/my-orders'>
            <AiOutlineProduct size={24}/>My orders</Link></>:<></>}
          
          <button
            onClick={() => {
              const confirm = window.confirm("Logged out?");
              if (confirm) {
                handleLogout();
                localStorage.removeItem("token");
                navigate("/login");
              }
            }}
            className="text-white hover:underline"
          >
            <AiOutlineLogout size={24}/>
            Logout
          </button>
        </div>
      </header>

      {/* Main Profile Section */}
      <main className="w-full max-w-4xl mx-auto p-6">
        <h4 className="text-3xl font-bold text-[#1A1A1A] mb-6 text-center">
          Profile
        </h4>
        <div className="bg-[#F8F8F8] p-8 shadow-lg rounded-lg">
          {/* Profile Picture Section */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img
                src={userState?.user?.profilePic?.url}
                alt={userState?.user?.name}
                className="w-32 h-32 rounded-full border-4 border-[#3D405B] object-cover"
              />
              {/* Edit Button */}
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-[#E07A5F] text-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-white hover:bg-[#D56A4F] transition-colors"
              >
                +
              </button>
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-[#1A1A1A] font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                placeholder="Enter Name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[#1A1A1A] font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                placeholder="Enter Email"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-[#1A1A1A] font-medium mb-2">
                Phone
              </label>
              <input
                type="number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-3 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                placeholder="Enter Phone Number"
              />
            </div>

            {/* City Field */}
            <div>
              <label className="block text-[#1A1A1A] font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                value={form.location.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: { ...form.location, city: e.target.value },
                  })
                }
                className="w-full p-3 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                placeholder="Enter City"
              />
            </div>

            {/* State Field */}
            <div>
              <label className="block text-[#1A1A1A] font-medium mb-2">
                State
              </label>
              <input
                type="text"
                value={form.location.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: { ...form.location, state: e.target.value },
                  })
                }
                className="w-full p-3 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                placeholder="Enter State"
              />
            </div>

            {/* Save Changes Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3 text-white rounded-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#3D405B] hover:bg-[#2C3E50]"
                } transition-colors`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <p className="text-[#E07A5F] mt-4 text-center">{error}</p>
          )}
        </div>
      </main>
    </div>
  );
}