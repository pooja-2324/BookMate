import { useEffect, useState } from "react";
import axios from "../config/axios";
import { useSelector, useDispatch } from 'react-redux';
import { verifiedVendors, blockedVendors, updateVendor } from "../slices/vendorSlice";

export default function Vendors() {
    const { verified, blocked } = useSelector(state => state.vendors);
    const dispatch = useDispatch();
    const [userCount, setUserCount] = useState(null);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await axios.get('/api/user/count');
                setUserCount(response.data.count);
            } catch (error) {
                console.error("Error fetching user count:", error);
            }
        };

        fetchUserCount();
        dispatch(verifiedVendors());
        dispatch(blockedVendors());
    }, [dispatch, verified.length, blocked.length]);

    const calculateTotalEarnings = (vendor) => {
        return vendor.totalEarnings.reduce((total, earning) => total + earning.earnings, 0);
    };

    const handleCheckboxChange = (vid, isApproved) => {
        dispatch(updateVendor({ vid, isApproved: !isApproved }));
        dispatch(verifiedVendors());
        dispatch(blockedVendors());
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-semibold mb-4">Total Registered Users - {userCount !== null ? userCount : "Loading..."}</h2>

            <h2 className="text-lg font-semibold mb-2">Verified Vendors - {verified ? verified.length : "Loading..."}</h2>
            <ul className="space-y-4">
                {verified && verified.map((vendor, index) => (
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
                            <p className="text-sm text-gray-500">Created At: {new Date(vendor.createdAt).toLocaleDateString()}</p>
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

            <h2 className="text-lg font-semibold mt-6">Blocked Vendors - {blocked ? blocked.length : "Loading..."}</h2>
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
                                <p className="text-sm font-medium">Total Earnings: Rs{calculateTotalEarnings(vendor)}</p>
                                <p className="text-sm text-gray-500">Created At: {new Date(vendor.createdAt).toLocaleDateString()}</p>
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
        </div>
    );
}
