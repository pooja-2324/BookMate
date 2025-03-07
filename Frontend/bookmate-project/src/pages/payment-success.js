import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../config/axios";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function PaymentSuccess() {
  const navigate = useNavigate();
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
          headers: { Authorization: localStorage.getItem("token") },
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
      <div className="flex justify-center items-center min-h-screen bg-[#F4F1DE]">
        <p className="text-lg text-[#3D405B]">Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F4F1DE]">
        <p className="text-lg text-[#E07A5F]">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1DE] p-6">
      <div className="max-w-2xl mx-auto bg-[#F8F8F8] p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-[#1A1A1A] mb-6">
          Payment Status
        </h1>

        {/* Display the session_id from the query parameters */}
        <div className="mb-6">
          <p className="text-[#3D405B]">
            <span className="font-semibold">Session ID:</span> {sessionId}
          </p>
        </div>

        {paymentDetails ? (
          <div className="space-y-4">
            <div>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Transaction ID:</span>{" "}
                {paymentDetails.transactionId}
              </p>
            </div>
            <div>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Amount:</span>{" "}
                {paymentDetails.amount / 100} {paymentDetails.currency.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    paymentDetails.status === "paid" ? "text-green-600" : "text-[#E07A5F]"
                  }`}
                >
                  {paymentDetails.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-[#3D405B]">
                <span className="font-semibold">Order ID:</span> {paymentDetails.orderId}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-[#3D405B]">No payment details found.</p>
        )}

        {/* My Orders Button */}
        <div className="mt-6 text-center">
          <AiOutlineCheckCircle size={50} className="text-green-500 mb-4" />
                  <h4 className="text-2xl font-semibold text-gray-700">
                    Your Order is Confirmed!
                  </h4>
          <button
            onClick={() => navigate("/my-orders")}
            className="bg-[#3D405B] text-white px-6 py-2 rounded-lg hover:bg-[#2C3E50] transition-colors"
          >
            My Orders
          </button>
        </div>
      </div>
    </div>
  );
}