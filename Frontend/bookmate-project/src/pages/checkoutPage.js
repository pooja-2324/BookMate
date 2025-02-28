// import React, { useState, useEffect } from 'react';
// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import { useDispatch, useSelector } from 'react-redux';
// import { createPaymentIntent, confirmPayment } from '../redux/slices/paymentSlice';
// import Swal from 'sweetalert2';

// const CheckoutForm = ({ orderId }) => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const dispatch = useDispatch();
//     const { clientSecret, loading } = useSelector((state) => state.payment);
//     const [paymentError, setPaymentError] = useState(null);

//     useEffect(() => {
//         if (orderId) {
//             dispatch(createPaymentIntent(orderId));
//         }
//     }, [orderId, dispatch]);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         setPaymentError(null);

//         if (!stripe || !elements) return;

//         if (!clientSecret) {
//             setPaymentError("Payment session expired. Please refresh and try again.");
//             return;
//         }

//         const cardElement = elements.getElement(CardElement);

//         try {
//             const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
//                 payment_method: { card: cardElement },
//             });

//             if (error) {
//                 setPaymentError(error.message);
//             } else if (paymentIntent && paymentIntent.status === 'succeeded') {
//                 // Dispatch confirmPayment with the property names that the backend expects.
//                 dispatch(confirmPayment({ 
//                     stripePaymentIntentId: paymentIntent.id, 
//                     orderId 
//                 }));
                
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Payment Successful!',
//                     text: 'Your payment has been processed successfully.',
//                     confirmButtonText: 'OK'
//                 });
//             }
//         } catch (err) {
//             setPaymentError("Something went wrong. Try again.");
//         }
//     };

//     const cardElementOptions = {
//         style: {
//             base: {
//                 fontSize: '16px',
//                 color: '#424770',
//                 '::placeholder': { color: '#aab7c4' },
//             },
//             invalid: { color: '#9e2146' },
//         },
//     };

//     return (
//         <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
//             <h2 className="text-center text-xl mb-4">Complete Your Payment</h2>
//             <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//                 <label className="text-sm">Card Details</label>
//                 <div className="p-3 border border-gray-300 rounded bg-gray-100">
//                     <CardElement options={cardElementOptions} />
//                 </div>
//                 {paymentError && <p className="text-red-500 text-sm">{paymentError}</p>}
//                 <button 
//                     type="submit" 
//                     className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
//                     disabled={!stripe || loading}
//                 >
//                     {loading ? 'Processing...' : 'Pay Now'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default CheckoutForm;
// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import { useDispatch, useSelector } from 'react-redux';
// import { paymentConfirm, paymentCreate } from '../slices/paymentSlice';
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import swal from 'sweetalert2';

// export default function CheckOut() {
//   const { oid } = useParams();
//   const stripe = useStripe();
//   const elements = useElements();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { paymentData } = useSelector((state) => state.payments);
//   const [paymentError, setPaymentError] = useState(null);

//   useEffect(() => {
//     dispatch(paymentCreate({ oid }));
//   }, [oid, dispatch]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;
//     if (!paymentData) {
//       console.log('payment session expired');
//       return;
//     }

//     const cardElement = elements.getElement(CardElement);

//     try {
//       const { paymentIntent, error } = await stripe.confirmCardPayment(paymentData.clientSecret, {
//         payment_method: { card: cardElement }
//       });

//       if (error) {
//         setPaymentError(error.message);
//         console.log('payment error', error.message);
//       } else if (paymentIntent && paymentIntent.status === 'succeeded') {
//         await dispatch(paymentConfirm({
//           oid,
//           stripePaymentIntentId: paymentIntent.id
//         })).unwrap();
//         console.log('payment data',paymentData)
//         swal.fire({
//           icon: 'success',
//           title: 'Payment successful!',
//           text: 'Your payment has been processed successfully.',
//           confirmButtonText: 'OK'
//         });

//         navigate("/order-confirm");
//       }
//     } catch (err) {
//       console.log(err.response?.data || err.message);
//       setPaymentError("Payment failed. Please try again.");
//     }
//   };

//   const cardElementOptions = {
//     style: {
//       base: {
//         fontSize: '16px',
//         color: '#424770',
//         '::placeholder': { color: '#aab7c4' },
//       },
//       invalid: { color: '#9e2146' },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h2 className="text-2xl font-bold text-center mb-4">Complete your payment</h2>
//       <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
//         <label className="block text-gray-700 mb-2">Card Details</label>
//         <CardElement options={cardElementOptions} className="mb-4 p-2 border rounded" />
//         {paymentError && <p className="text-red-500 mb-4">{paymentError}</p>}
//         <button
//           type="submit"
//           className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
//         >
//           Pay Now
//         </button>
//       </form>
//     </div>
//   );
// }