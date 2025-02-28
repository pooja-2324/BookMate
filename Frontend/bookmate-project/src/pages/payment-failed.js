import React from "react";
import { toast } from "react-toastify";

export default function PaymentFailed() {
  return (
    <div>
      <h1>Payment Canceled</h1>
      <p>Your payment was not completed. Please try again.</p>
    </div>
  );
}