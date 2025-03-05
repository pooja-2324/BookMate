import { Link } from "react-router-dom";
import { allUsers } from "../slices/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "../config/axios";

export default function AdminDashBoard() {
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
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h2>
            
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-6 border-b pb-2 mb-4">
                <Link to="/admin-users" className="text-lg font-medium text-blue-600 hover:text-blue-800">Users</Link>
                <Link to="/admin-clients" className="text-lg font-medium text-blue-600 hover:text-blue-800">Clients</Link>
                <Link to="/admin-books" className="text-lg font-medium text-blue-600 hover:text-blue-800">Books</Link>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Total Registered Users: {userCount !== null ? userCount : "Loading..."}</h2>
            
            {adminData.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminData.map(ele => (
                        <li key={ele._id} className="border rounded-lg p-4 shadow-md bg-white">
                            <img src={ele.profilePic?.url} alt="Profile" className="w-16 h-16 rounded-full mx-auto" />
                            <p className="text-lg font-semibold text-center mt-2">{ele.name}</p>
                            <p className="text-gray-600 text-center">{ele.email}</p>
                            <p className="text-gray-600 text-center">{ele.phone}</p>
                            <p className="text-gray-600 text-center">{ele.location?.city}, {ele.location?.state}</p>
                            <p className="text-blue-700 text-center font-semibold mt-2">{ele.role}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No users found.</p>
            )}
        </div>
    );
}