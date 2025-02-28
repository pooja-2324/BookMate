// import { useEffect } from "react"
// import { useParams,useLocation } from "react-router-dom"
// import { Elements } from "@stripe/react-stripe-js"
// import { loadStripe } from "@stripe/stripe-js"
// import { useDispatch,useSelector } from "react-redux"
// import { toast } from 'react-toastify';
// import { makePayment } from "../slices/paymentSlice"


// export default async function Payment(){
//     const location=useLocation()
//     const order=location.state
//     const dispatch=useDispatch()
//     console.log('order',order)
//     try{
//         const body={
//             orderId:order.newOrder._id,
//             amount:order.newOrder.totalAmount
//         }
//         const response=await dispatch(makePayment(body)).unwrap()
//         if(!response||!response.url){
//             toast.error("payment processing failed")
//             return
//         }
//         window.location.href=response.url
//     }catch(err){
//         console.error(err)
//         toast.error('payment failed,try again')
//     }
// }
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
        console.log('body',body)

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
    <div>
      <h1>Processing Payment...</h1>
      <p>Please wait while we redirect you to the payment gateway.</p>
    </div>
  );
}