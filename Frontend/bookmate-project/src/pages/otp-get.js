import { useContext, useState } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext";

export default function Otp() {
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1: Get OTP, 2: Verify OTP
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const handleGetOtp = async () => {
    try {
      // Validate phone number
      if (!phone || phone.length < 10) {
        setMessage("Please enter a valid phone number");
        return;
      }

      // Send request to generate OTP
      const response = await axios.post("/api/user/getOtp", { phone }, { withCredentials: true });
      setMessage(response.data.message);
      setStep(2); // Move to OTP verification step
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // Validate OTP
      if (!otp || otp.length !== 6) {
        setMessage("Please enter a valid 6-digit OTP");
        return;
      }

      // Send request to verify OTP
      console.log("phone", phone, otp);
      const response = await axios.post("/api/user/verifyOtp", { phone, otp }, { withCredentials: true });
      setMessage("OTP verified successfully!");

      // Save the token to localStorage or context
      localStorage.setItem("token", response.data.token);
      const responses = await axios.get("/api/user/account", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      handleLogin(response.data);

      // Redirect based on role
      if (responses?.data?.role === "vendor") {
        navigate("/vhome");
      } else {
        navigate("/");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to verify OTP");
      setStep(1); // Reset to the initial step
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1DE]">
      {/* Header */}
      <header className="w-full h-16 bg-[#2C3E50] text-white p-4 flex justify-between items-center px-6 left-0 top-0 shadow-md">
        <h1 className="text-2xl font-bold">Bookmate</h1>
      </header>

      {/* OTP Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-[#F8F8F8] p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#1A1A1A] mb-6">
            Sign in with OTP
          </h2>

          {/* Step 1: Get OTP */}
          {step === 1 && (
            <>
              <input
                type="text"
                value={phone}
                placeholder="Enter your phone number"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
              <button
                onClick={handleGetOtp}
                className="w-full bg-[#3D405B] text-white py-2 mt-4 rounded-lg hover:bg-[#2C3E50] transition-colors"
              >
                Get OTP
              </button>
            </>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <>
              <input
                type="text"
                value={otp}
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-[#3D405B] text-white py-2 mt-4 rounded-lg hover:bg-[#3D405B] transition-colors"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Message Display */}
          {message && (
            <p
              className={`mt-4 text-sm text-center ${
                message.includes("successfully") ? "text-green-600" : "text-[#E07A5F]"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#2C3E50] text-white p-4 text-center">
        <p>&copy; 2025 Bookmate. All rights reserved.</p>
      </footer>
    </div>
  );
}