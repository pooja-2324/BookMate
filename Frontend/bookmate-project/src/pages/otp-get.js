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
            console.log('phone', phone, otp);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h4 className="text-2xl font-bold mb-6 text-gray-800">Sign in with OTP</h4>
            {step === 1 ? (
                <>
                    <input
                        type="text"
                        value={phone}
                        placeholder="Enter your phone number"
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-80 p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleGetOtp}
                        className="w-80 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Get OTP
                    </button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        value={otp}
                        placeholder="Enter OTP"
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-80 p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleVerifyOtp}
                        className="w-80 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                        Verify OTP
                    </button>
                </>
            )}
            {message && (
                <p className={`mt-4 text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}