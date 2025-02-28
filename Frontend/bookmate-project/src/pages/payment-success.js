import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from '../config/axios';

export default function PaymentSuccess() {
  const navigate=useNavigate()
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (!sessionId) {
          throw new Error("Session ID not found in the URL");
        }

        // Call the backend API to fetch payment details
        const response = await axios.get("/api/paymentDetails", {
          params: { session_id: sessionId },
          headers: { Authorization: localStorage.getItem('token') }
        });

        if (!response.data) {
          throw new Error("No payment details found");
        }

        // Update state with payment details
        setPaymentDetails(response.data);
        setLoading(false);

        // Show success or error message based on payment status
        if (response.data.status === "paid") {
          toast.success("Payment successful!");
        } else {
          toast.error("Payment failed or incomplete.");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
        toast.error("Error fetching payment details.");
      }
    };

    fetchPaymentDetails();
  }, [sessionId]); // Dependency on sessionId

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Payment Status</h1>

        {/* Display the session_id from the query parameters */}
        <div className="mb-6">
          <p className="text-gray-700">
            <span className="font-semibold">Session ID:</span> {sessionId}
          </p>
        </div>

        {paymentDetails ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Transaction ID:</span> {paymentDetails.transactionId}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Amount:</span> {paymentDetails.amount / 100} {paymentDetails.currency.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    paymentDetails.status === "paid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {paymentDetails.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Order ID:</span> {paymentDetails.orderId}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-700">No payment details found.</p>
        )}
      </div>
      <button onClick={()=>navigate('/my-orders')}>My Orders</button>
    </div>
  );
}