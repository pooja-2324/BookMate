import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { makePayment } from "../slices/paymentSlice";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order = location.state?.newOrder; // Access `newOrder` from the `order` object

  console.log("order", order);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Check if `order` and required fields exist
        if (!order || !order._id || !order.totalAmount) {
          toast.error("Invalid order data");
          navigate("/"); // Redirect to home or another page
          return;
        }

        // Prepare the request body for the payment
        const body = {
          orderId: order._id, // Use `order._id` for the order ID
          amount: order.totalAmount, // Use `order.totalAmount` for the amount
        };
        console.log("body", body);

        // Dispatch the `makePayment` action
        const response = await dispatch(makePayment(body)).unwrap();

        // Check if the response contains the required URL
        if (!response || !response.url) {
          toast.error("Payment processing failed");
          return;
        }

        // Redirect to the payment URL
        window.location.href = response.url;
      } catch (err) {
        console.error(err);
        toast.error("Payment failed, try again");
      }
    };

    processPayment();
  }, [dispatch, navigate, order]);

  return (
    <div className="min-h-screen bg-[#F4F1DE] flex flex-col items-center justify-center p-6">
      {/* Payment Processing Message */}
      <div className="bg-[#F8F8F8] p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-4">
          Processing Payment...
        </h1>
        <p className="text-[#3D405B]">
          Please wait while we redirect you to the payment gateway.
        </p>

        {/* Loading Animation (Optional) */}
        <div className="mt-6">
          <div className="w-12 h-12 border-4 border-[#3D405B] border-t-[#E07A5F] rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}