import { useSelector, useDispatch } from "react-redux";
import { pendingRents } from "../slices/rentSlice";
import { acceptReturn } from "../slices/paymentSlice";
import { useEffect, useState,useContext } from "react";
import AuthContext from "../context/authContext";

export default function ReturnAccept() {
  const { rentData } = useSelector((state) => state.rents);
  const [isDamaged, setIsDamaged] = useState({}); // Track damage status for each return
  const { userState } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch pending returns for the vendor
    dispatch(pendingRents());
  }, [dispatch]);

  const handleAccept = async (rid) => {
    const confirm = window.confirm("Are you sure you want to accept this return?");
    if (confirm) {
      try {
        // Send isDamaged status to the backend
        await dispatch(acceptReturn({rid}));
        alert("Return accepted successfully");
        // Refresh the list of pending returns
        dispatch(pendingRents());
      } catch (error) {
        console.error("Error accepting return:", error);
        alert("Failed to accept return. Please try again.");
      }
    }
  };

  if (!pendingRents || pendingRents.length === 0) {
    return <div className="min-h-screen bg-gray-100 p-6">No pending returns.</div>;
  }
  console.log('rent data',rentData)
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Pending Returns
      </h3>

      {rentData.map((rent) => (
        <div key={rent._id} className="bg-white shadow-md rounded-lg p-4 mb-6 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <img
              className="w-32 h-40 object-cover rounded-md shadow-sm bg-yellow-100 p-2"
              src={rent.book?.coverImage}
              alt="Book Cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-700">
                {rent.book?.modifiedTitle}
              </h2>
              <p className="text-gray-600">Client: {rent.client?.name}</p>
              <p className="text-gray-600">
                Rental Start Date: {rent.rentalStartDate?.split("T")[0]}
              </p>
              <p className="text-gray-600">
                Due Date: {rent.dueDate?.split("T")[0]}
              </p>
              <p className="text-gray-600">
                Return Date: {rent.returnDate?.split("T")[0]}
              </p>
              <p className="text-gray-600">
                Reading Fee: ₹{rent.pricing.readingFee}
              </p>
              <p className="text-gray-600">
                Caution Deposit: ₹{rent.pricing.cautionDeposit}
              </p>
              <div className="mt-2">
                <label className="flex items-center text-gray-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={isDamaged[rent._id] || false}
                    onChange={(e) =>
                      setIsDamaged((prev) => ({
                        ...prev,
                        [rent._id]: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  Is there any damage? (₹50 will be charged if checked)
                </label>
              </div>
              <button
                onClick={() => handleAccept(rent._id)}
                className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
              >
                Accept Return
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}