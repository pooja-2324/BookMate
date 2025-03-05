import { useContext, useState } from "react";
import axios from "../config/axios";
import AuthContext from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);
  const formInitialValue = {
    email: "",
    password: "",
  };
  const [form, setForm] = useState(formInitialValue);
  const [role, setRole] = useState("client"); // Default role is "client"
  const [clientError, setClientError] = useState({});
  const [serverError, setServerError] = useState([]);
  const errors = {};

  // Client-side validation
  const runClientValidation = () => {
    if (form.email.trim().length === 0) {
      errors.email = "*Email is required";
    }
    if (form.password.trim().length === 0) {
      errors.password = "*Password is required";
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    runClientValidation();
    if (Object.keys(errors).length === 0) {
      try {
        const result = await axios.post("/api/user/login", form, { withCredentials: true });
        localStorage.setItem("token", result?.data?.token);

        const response = await axios.get("/api/user/account", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        handleLogin(response?.data);
        if (response?.data?.role === "vendor") {
          navigate("/vhome");
        } else if(response?.data?.role==='admin'){
          navigate("/admin-dashboard");
        }else{
          navigate('/')
        }
      } catch (err) {
        console.log(err.response?.data);
        setServerError(err.response?.data?.errors || [{ msg: "Failed to log in" }]);
      }
    } else {
      setClientError(errors);
    }
  };

 

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="w-full h-8 bg-red-700 text-white p-4 flex justify-between items-center px-6 left-0 top-0">
        <h1 className="text-2xl font-bold">Bookmate</h1>
        <Link to="/register" className="text-white hover:underline">
          Register
        </Link>
      </header>

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          {serverError &&
            serverError.map((ele) => (
              <li key={ele._id} className="text-red-500 text-sm mb-4">
                {ele.msg}
              </li>
            ))}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {clientError.email && (
                <p className="text-red-500 text-sm mt-1">{clientError.email}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {clientError.password && (
                <p className="text-red-500 text-sm mt-1">{clientError.password}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Login
            </button>
          </form>

         
          {/* Sign in with OTP Link */}
          <div className="mt-4 text-center">
            <Link to="/get-otp" className="text-blue-500 hover:underline">
              <i>Sign in with OTP</i>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Bookmate. All rights reserved.</p>
      </footer>
    </div>
  );
}
  //(
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       {/* Header */}
//       <header className="w-full bg-orange-500 text-white p-4 text-center flex justify-between items-center px-6">
//         <h1 className="text-2xl font-bold">Bookmate</h1>
//         <Link to="/register" className="text-white hover:underline">
//           Register
//         </Link>
//       </header>

//       {/* Login Form */}
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-6">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
//         {serverError.length > 0 && (
//           <ul className="text-red-500 text-sm mb-4">
//             {serverError.map((ele, index) => (
//               <li key={index}>{ele.msg}</li>
//             ))}
//           </ul>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//             {clientError.email && (
//               <p className="text-red-500 text-sm mt-1">{clientError.email}</p>
//             )}
//           </div>
//           <div>
//             <input
//               type="password"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               placeholder="Enter your password"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//             {clientError.password && (
//               <p className="text-red-500 text-sm mt-1">{clientError.password}</p>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );

