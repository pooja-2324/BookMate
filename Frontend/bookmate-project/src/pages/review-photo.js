import { useSelector, useDispatch } from 'react-redux';
import { oneReview, reviewPhoto } from '../slices/reviewSlice';
import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';


export default function ReviewPhotos() {
    const { reviewData } = useSelector(state => state.reviews);
    const dispatch = useDispatch();
    const navigate=useNavigate()
    const { rid } = useParams();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

   
  console.log('rid',rid)
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
              console.log(err.response?.data?.error)
                setError(err.message || 'Failed to upload photos'); // Set error state
            } finally {
                setUploading(false); // Reset uploading state
            }
        }
    };
    const handleContinue=()=>{
      navigate('/')
    }
    return (
        <div>
            <h3>Add photos</h3>
            <div className="mt-3">
                <input
                    id="file-input" // Added id to match the htmlFor attribute
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange} // Pass the event to handleFileChange
                    className="hidden"
                    disabled={uploading} // Disable input while uploading
                />
                <label htmlFor="file-input" className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
                    {uploading ? 'Uploading...' : 'Add Photos'}
                </label>
            </div>

            {/* Display success or error messages */}
            {success && <p className="text-green-500 mt-2">Photos uploaded successfully!</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Display uploaded photos if available */}
            {reviewData?.photo && (
                <div className="mt-4">
                    <h4>Uploaded Photos:</h4>
                    <div className="flex flex-wrap gap-2">
                        {reviewData.photo.map((photo, index) => (
                            <img
                                key={index}
                                src={photo.url}
                                alt={`Review Photo ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                </div>
            )}
            <button onClick={handleContinue}>Continue</button>
        </div>
    );
}