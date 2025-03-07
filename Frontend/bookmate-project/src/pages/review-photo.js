import { useSelector, useDispatch } from 'react-redux';
import { oneReview, reviewPhoto } from '../slices/reviewSlice';
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

export default function ReviewPhotos() {
    const { handleLogout } = useContext(AuthContext);
    const { reviewData } = useSelector((state) => state.reviews);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { rid } = useParams();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const formData = new FormData();
            for (const file of files) {
                formData.append('photo', file); // Append each file to the form data
            }

            setUploading(true);
            setError(null);
            setSuccess(false);

            try {
                await dispatch(reviewPhoto({ rid, formData })).unwrap(); // Dispatch the action and wait for it to complete
                setSuccess(true); // Set success state
            } catch (err) {
                console.log(err.response?.data?.error);
                setError(err.message || 'Failed to upload photos'); // Set error state
            } finally {
                setUploading(false); // Reset uploading state
            }
        }
    };

    const handleContinue = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-[#F4F1DE] flex flex-col items-center justify-start p-6"> {/* Warm Beige background */}
            <header className="w-full h-16 bg-[#2C3E50] text-white p-4 flex justify-between items-center px-6 fixed top-0 left-0 shadow-md z-10">
                <h1 className="text-2xl font-bold">Bookmate</h1>
                <div className="ml-auto flex gap-4">
                    <li>
                        <button
                            onClick={() => {
                                const confirm = window.confirm("Are you sure you want to log out?");
                                if (confirm) {
                                    handleLogout();
                                    localStorage.removeItem("token");
                                    navigate("/login");
                                }
                            }}
                            className="text-white hover:underline"
                        >
                            Logout
                        </button>
                    </li>
                </div>
            </header>

            {/* Main Content Container */}
            <div className="w-full max-w-3xl mt-20 bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">Add Photos</h3> {/* Dark Charcoal text */}

                {/* File Upload Section */}
                <div className="w-full flex flex-col items-center">
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                    />
                    <label
                        htmlFor="file-input"
                        className="px-6 py-3 bg-[#E07A5F] text-[#F8F8F8] rounded-lg cursor-pointer hover:bg-[#D2694E] transition-colors text-center" /* Soft Coral button */
                    >
                        {uploading ? 'Uploading...' : 'Choose Photos'}
                    </label>
                    <p className="text-sm text-gray-500 mt-2">Upload one or more photos</p>
                </div>

                {/* Display success or error messages */}
                {success && (
                    <p className="text-green-500 mt-4 text-center">Photos uploaded successfully!</p>
                )}
                {error && (
                    <p className="text-red-500 mt-4 text-center">{error}</p>
                )}

                {/* Display uploaded photos if available */}
                {reviewData?.photo && (
                    <div className="w-full mt-6">
                        <h4 className="text-lg font-semibold text-[#1A1A1A] mb-4 text-center">Uploaded Photos:</h4> {/* Dark Charcoal text */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {reviewData.photo.map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo.url}
                                    alt={`Review Photo ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-[#3D405B]" /* Muted Teal border */
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Continue button */}
                <button
                    onClick={handleContinue}
                    className="mt-8 px-6 py-3 bg-[#3D405B] text-[#F8F8F8] rounded-lg hover:bg-[#2C3E50] transition-colors" /* Muted Teal button */
                >
                    Continue
                </button>
            </div>
        </div>
    );
}