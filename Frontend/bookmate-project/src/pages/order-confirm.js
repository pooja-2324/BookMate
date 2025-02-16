import { AiOutlineCheckCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function OrderConfirm() {
    const navigate=useNavigate()
    const handleClick=()=>{
        navigate('/')
    }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <AiOutlineCheckCircle size={50} className="text-green-500 mb-4" />
        <h4 className="text-2xl font-semibold text-gray-700">
          Your Order is Confirmed!
        </h4>
        <p className="text-gray-600 mt-2">Thank you for shopping with us.</p>
      </div>
      <button onClick={handleClick}>Continue Shopping</button>
    </div>
  );
}
