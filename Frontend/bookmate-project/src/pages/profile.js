import { useContext } from "react";
import AuthContext from "../context/authContext";

export default function Profile() {
    const { userState } = useContext(AuthContext);
    console.log('user', userState.user);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h4 className="text-3xl font-bold text-center mb-8 text-gray-800">Profile</h4>

                {/* Profile Picture */}
                <div className="flex justify-center mb-8">
                    <img
                        src={userState.user.profilePic}
                        alt={userState.user.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                </div>

                {/* Profile Information */}
                <div className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            defaultValue={userState.user.name}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            defaultValue={userState.user.email}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            defaultValue={userState.user.phone}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            defaultValue={`${userState.user.location.city}, ${userState.user.location.state}`}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}