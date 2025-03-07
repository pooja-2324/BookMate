import { useEffect, useState,useContext } from "react";
import axios from "../config/axios";
import { useSelector, useDispatch } from "react-redux";
import { verifiedVendors, blockedVendors, updateVendor } from "../slices/vendorSlice";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser,AiOutlineLogout } from "react-icons/ai";
import AuthContext from "../context/authContext";
export default function Vendors() {
    const navigate=useNavigate()
        const {handleLogout}=useContext(AuthContext)
    
    const { verified, blocked } = useSelector((state) => state.vendors);
    const dispatch = useDispatch();
    const [userCount, setUserCount] = useState(null);

    // Fetch user count and vendor data on component mount
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
        dispatch(verifiedVendors());
        dispatch(blockedVendors());
    }, [dispatch]);

    // Calculate total earnings for a vendor
    const calculateTotalEarnings = (vendor) => {
        return vendor.totalEarnings.reduce((total, earning) => total + earning.earnings, 0);
    };

    // Handle checkbox toggle for vendor verification
    const handleCheckboxChange = (vid, isApproved) => {
        dispatch(updateVendor({ vid, isApproved: !isApproved })).then(() => {
            dispatch(verifiedVendors());
            dispatch(blockedVendors());
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F4F1DE]">
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
                }}> <AiOutlineLogout size={24}/>Logout</button>
                                   </li>
                                </ul>
                            </nav>
                        </header>
           

            {/* Verified Vendors Section */}
            <h2 className="text-lg font-semibold mb-2">
                Verified Vendors - {verified ? verified.length : "Loading..."}
            </h2>
            <ul className="space-y-4">
                {verified.map((vendor, index) => (
                    <li key={index} className="p-4 bg-white rounded-lg shadow-md flex items-center gap-4">
                        <img
                            src={vendor.vendor.profilePic?.url}
                            alt={`${vendor.vendor.name}'s profile`}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <p className="font-semibold">{vendor.vendor.name}</p>
                            <p className="text-sm text-gray-600">{vendor.vendor.email}</p>
                            <p className="text-sm text-gray-600">{vendor.vendor.phone}</p>
                            <p className="text-sm font-medium">Total Earnings: Rs{calculateTotalEarnings(vendor)}</p>
                            <p className="text-sm text-gray-500">
                                Created At: {new Date(vendor.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={vendor.isApproved}
                                onChange={() => handleCheckboxChange(vendor._id, vendor.isApproved)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-gray-700">Verified</span>
                        </label>
                    </li>
                ))}
            </ul>

            {/* Blocked Vendors Section */}
            <h2 className="text-lg font-semibold mt-6">
                Blocked Vendors - {blocked ? blocked.length : "Loading..."}
            </h2>
            {blocked.length > 0 ? (
                <ul className="space-y-4 mt-4">
                    {blocked.map((vendor, index) => (
                        <li key={index} className="p-4 bg-white rounded-lg shadow-md flex items-center gap-4">
                            <img
                                src={vendor.vendor.profilePic?.url}
                                alt={`${vendor.vendor.name}'s profile`}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">{vendor.vendor.name}</p>
                                <p className="text-sm text-gray-600">{vendor.vendor.email}</p>
                                <p className="text-sm text-gray-600">{vendor.vendor.phone}</p>
                                <p className="text-sm font-medium">Total Earnings: Rs{Math.floor(calculateTotalEarnings(vendor))}</p>
                                <p className="text-sm text-gray-500">
                                    Created At: {new Date(vendor.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={vendor.isApproved}
                                    onChange={() => handleCheckboxChange(vendor._id, vendor.isApproved)}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">Verified</span>
                            </label>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600 mt-4">No blocked vendors found</p>
            )}
            <footer className="w-full bg-[#2C3E50] text-white p-4 text-center">
                <p>&copy; 2025 Admin Panel. All rights reserved.</p>
            </footer>
        </div>
    );
}