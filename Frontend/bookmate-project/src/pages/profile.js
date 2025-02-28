// import { useContext, useState } from "react";
// import AuthContext from "../context/authContext";
// import axios from "../config/axios";

// export default function Profile() {
//     const { userState, handleUpdate } = useContext(AuthContext);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const [form, setForm] = useState({
//         name: userState.user.name,
//         email: userState.user.email,
//         phone: userState.user.phone,
//         location: {
//             city: userState.user.location.city,
//             state: userState.user.location.state,
//         },
//     });

//     console.log('user', userState.user);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         try {
//             const updatedUser = {
//                 ...userState.user,
//                 name: form.name,
//                 email: form.email,
//                 phone: form.phone,
//                 location: {
//                     city: form.location.city,
//                     state: form.location.state,
//                 },
//             };

//             const response = await axios.put('/api/user/update', updatedUser, {
//                 headers: { Authorization: localStorage.getItem('token') },
//             });

//             handleUpdate(response.data);
//             setLoading(false);
//         } catch (err) {
//             console.log(err);
//             setError(err.response?.data?.message || "An error occurred");
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             {/* Sidebar */}
//             <aside className="w-1/4 bg-red-700 text-white p-6">
//                 <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
//                 <ul>
//                     {userState.user.role === "client" ? (
//                         <li className="py-2 hover:bg-red-700 px-4 rounded">
//                             <a href="/my-orders">My Orders</a>
//                         </li>
//                     ) : (
//                         <li className="py-2 hover:bg-red-700 px-4 rounded">
//                             <a href="/my-earnings">My Earnings</a>
//                         </li>
//                     )}
                   
//                 </ul>
//             </aside>

//             {/* Main Profile Section */}
//             <main className="w-3/4 p-6">
//                 <h4 className="text-2xl font-semibold mb-4">Profile</h4>
//                 <div className="bg-white p-6 shadow-lg rounded-lg">
//                     <div className="mb-4 flex items-center">
//                         <img
//                             src={userState.user.profilePic.url }
//                             alt={userState.user.name}
//                             className="w-24 h-24 rounded-full border-2 border-gray-300"
//                         />
//                     </div>

//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <label className="block text-gray-700 font-medium">Name</label>
//                             <input
//                                 type="text"
//                                 value={form.name}
//                                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                                 className="w-full p-2 border border-gray-300 rounded"
//                                 placeholder="Enter Name"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-gray-700 font-medium">Email</label>
//                             <input
//                                 type="email"
//                                 value={form.email}
//                                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                                 className="w-full p-2 border border-gray-300 rounded"
//                                 placeholder="Enter Email"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-gray-700 font-medium">Phone</label>
//                             <input
//                                 type="number"
//                                 value={form.phone}
//                                 onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                                 className="w-full p-2 border border-gray-300 rounded"
//                                 placeholder="Enter Phone Number"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-gray-700 font-medium">City</label>
//                             <input
//                                 type="text"
//                                 value={form.location.city}
//                                 onChange={(e) =>
//                                     setForm({
//                                         ...form,
//                                         location: { ...form.location, city: e.target.value },
//                                     })
//                                 }
//                                 className="w-full p-2 border border-gray-300 rounded"
//                                 placeholder="Enter City"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-gray-700 font-medium">State</label>
//                             <input
//                                 type="text"
//                                 value={form.location.state}
//                                 onChange={(e) =>
//                                     setForm({
//                                         ...form,
//                                         location: { ...form.location, state: e.target.value },
//                                     })
//                                 }
//                                 className="w-full p-2 border border-gray-300 rounded"
//                                 placeholder="Enter State"
//                             />
//                         </div>

//                         <div>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className={`w-full p-2 text-white rounded ${
//                                     loading ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"
//                                 }`}
//                             >
//                                 {loading ? "Saving..." : "Save Changes"}
//                             </button>
//                         </div>
//                     </form>

//                     {error && <p className="text-red-500 mt-4">{error}</p>}
//                 </div>
//             </main>
//         </div>
//     );
// }
import { useContext, useState, useRef } from "react";
import AuthContext from "../context/authContext";
import axios from "../config/axios";
import {AiOutlineMoneyCollect,AiOutlineBook} from 'react-icons/ai'

export default function Profile() {
    const { userState, handleUpdate } = useContext(AuthContext);
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

    console.log('user', userState.user);

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

            const response = await axios.put('/api/user/update', updatedUser, {
                headers: { Authorization: localStorage.getItem('token') },
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
            formData.append('profilePic', file);

            const response = await axios.post('/api/user/profilePic', formData, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data',
                },
            });

            handleUpdate(response.data); // Update the user state with the new profile picture
            setLoading(false);
        } catch (err) {
            console.error('Error uploading profile picture:', err);
            setError(err.response?.data?.message || "Failed to upload profile picture");
            setLoading(false);
        }
    };
    console.log('profilepic',userState.user?.profilePic?.url)

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-1/4 bg-red-700 text-white p-6">
                <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
                <ul>
                    {userState.user.role === "client" ? (
                        <li className="py-2 hover:bg-red-700 px-4 rounded">
                            <a href="/my-orders">My Orders</a>
                        </li>
                    ) : (
                        <ul>
                        <li className="py-2 hover:bg-red-700 px-4 rounded">
                            <a href="/earnings"><AiOutlineMoneyCollect size={24}/> My Earnings</a>
                        </li>
                        <li className="py-2 hover:bg-red-700 px-4 rounded">
                            <a href="/vhome"><AiOutlineBook size={24}/> My Books</a>
                        </li>
                        </ul>
                    )}
                </ul>
            </aside>

            {/* Main Profile Section */}
            <main className="w-3/4 p-6">
                <h4 className="text-2xl font-semibold mb-4">Profile</h4>
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <div className="mb-4 flex items-center relative">
                        <div className="relative">
                            <img
                                src={userState?.user?.profilePic?.url}
                                alt={userState?.user?.name}
                                className="w-24 h-24 rounded-full border-2 border-gray-300"
                            />
                            {/* + Button */}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white hover:bg-red-700"
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter Name"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter Email"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Phone</label>
                            <input
                                type="number"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter Phone Number"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">City</label>
                            <input
                                type="text"
                                value={form.location.city}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        location: { ...form.location, city: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter City"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">State</label>
                            <input
                                type="text"
                                value={form.location.state}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        location: { ...form.location, state: e.target.value },
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter State"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full p-2 text-white rounded ${
                                    loading ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"
                                }`}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>

                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
            </main>
        </div>
    );
}