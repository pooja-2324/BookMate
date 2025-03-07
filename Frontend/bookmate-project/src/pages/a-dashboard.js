import { Link, useNavigate } from "react-router-dom";
import { allUsers } from "../slices/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState ,useContext} from "react";
import axios from "../config/axios";
import { AiOutlineUser,AiOutlineLogout } from "react-icons/ai";
import AuthContext from "../context/authContext";

export default function AdminDashBoard() {
    const navigate=useNavigate()
        const {handleLogout}=useContext(AuthContext)
    
    const [userCount, setUserCount] = useState(0);
    const dispatch = useDispatch();
    const { adminData } = useSelector(state => state.admin);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await axios.get("/api/user/count");
                setUserCount(response.data.count);
            } catch (error) {
                console.error("Error fetching user count:", error);
            }
        };
        fetchUserCount();
        dispatch(allUsers());
    }, [dispatch]);

    return (
        <div className="min-h-screen flex flex-col bg-[#F4F1DE]">
            {/* Header */}
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

            {/* Main Content */}
            <div className="flex-grow p-6">
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Admin Dashboard</h2>
                <h4 className="text-lg font-medium text-[#3D405B]">
                    Total Registered Users: <span className="font-bold text-[#E07A5F]">{userCount}</span>
                </h4>

           
               

                {/* Users List */}
                {adminData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adminData.map(ele => (
                            <div key={ele._id} className="border rounded-lg p-4 shadow-md bg-white flex flex-col items-center">
                                <img src={ele.profilePic?.url} alt="Profile" className="w-20 h-20 rounded-full" />
                                <p className="text-lg font-semibold mt-2">{ele.name}</p>
                                <p className="text-gray-600">{ele.email}</p>
                                <p className="text-gray-600">{ele.phone}</p>
                                <p className="text-gray-600">{ele.location?.city}, {ele.location?.state}</p>
                                <p className="text-blue-700 font-semibold mt-2">{ele.role}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No users found.</p>
                )}
            </div>

            {/* Footer */}
            <footer className="w-full bg-[#2C3E50] text-white p-4 text-center">
                <p>&copy; 2025 Admin Panel. All rights reserved.</p>
            </footer>
        </div>
    );
}
