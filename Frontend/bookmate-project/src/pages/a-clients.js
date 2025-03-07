import { useContext, useEffect, useState } from "react";
import axios from "../config/axios";
import { useSelector, useDispatch } from 'react-redux';
import { verifiedClients, blockedClients, updateClient } from "../slices/clientSlice";
import { Link,useNavigate } from "react-router-dom";

import { AiOutlineUser,AiOutlineLogout } from "react-icons/ai";
import AuthContext from "../context/authContext";

export default function Clients() {
    const navigate=useNavigate()
    const {handleLogout}=useContext(AuthContext)
    const { verified, blocked } = useSelector(state => state.clients);
    const dispatch = useDispatch();
    const [userCount, setUserCount] = useState(null);

    useEffect(() => {
       
        dispatch(verifiedClients());
        dispatch(blockedClients());
    }, [dispatch, verified.length, blocked.length]);

    const handleCheckboxChange = (cid, isApproved) => {
        dispatch(updateClient({ cid, isApproved: !isApproved }));
        dispatch(verifiedClients());
        dispatch(blockedClients());
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
                }} className="flex items-center gap-2 text-white hover:underline">
                                                    <AiOutlineLogout size={24} /> Logout
                                                  </button>
                                                </li>
                                </ul>
                            </nav>
                        </header>
           
            <h2 className="text-xl font-bold text-gray-700 mt-6">Verified Clients ({verified.length})</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {verified.map(client => (
                    <li key={client._id} className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                            <img
                                src={client.client.profilePic?.url}
                                alt={`${client.client.name}'s profile`}
                                className="w-16 h-16 object-cover rounded-full"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">{client.client.name}</p>
                                <p className="text-sm text-gray-600">{client.client.email}</p>
                                <p className="text-sm text-gray-600">{client.client.phone}</p>
                                <p className="text-sm text-gray-600">Created: {new Date(client.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <label className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={client.isApproved}
                                onChange={() => handleCheckboxChange(client._id, client.isApproved)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-gray-700">Verified</span>
                        </label>
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-bold text-gray-700 mt-8">Blocked Clients ({blocked.length})</h2>
            {blocked.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blocked.map(client => (
                        <li key={client._id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={client.client.profilePic?.url}
                                    alt={`${client.client.name}'s profile`}
                                    className="w-16 h-16 object-cover rounded-full"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{client.client.name}</p>
                                    <p className="text-sm text-gray-600">{client.client.email}</p>
                                    <p className="text-sm text-gray-600">{client.client.phone}</p>
                                    <p className="text-sm text-gray-600">Created: {new Date(client.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <label className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={client.isApproved}
                                    onChange={() => handleCheckboxChange(client._id, client.isApproved)}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">Verified</span>
                            </label>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">No blocked clients found.</p>
            )}
            {/* <footer className="w-full h-auto bg-[#2C3E50] text-white p-4 text-center">
                <p>&copy; 2025 Admin Panel. All rights reserved.</p>
            </footer> */}
        </div>
    );
}
