import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { useEffect, useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const formInitialValue = {
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    location: {
      city: "",
      state: "",
    },
  };

  const [count, setCount] = useState(0);
  const [form, setForm] = useState(formInitialValue);
  const [clientError, setClientError] = useState({});
  const [serverError, setServerError] = useState([]);
  const errors = {};

  const runClientValidation = () => {
    if (form.name.trim().length === 0) {
      errors.name = "*Name is required";
    }
    if (form.email.trim().length === 0) {
      errors.email = "*Email is required";
    }
    if (form.password.trim().length === 0) {
      errors.password = "*Password is required";
    }
    if (form.phone.trim().length === 0) {
      errors.phone = "*Phone number is required";
    }
    if (form.location.state.trim().length === 0) {
      errors.state = "*State is required";
    }
    if (form.location.city.trim().length === 0) {
      errors.city = "*City is required";
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/user/count");
        console.log("count", response.data.count);
        setCount(response.data.count);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    runClientValidation();
    if (Object.keys(errors).length === 0) {
      try {
        const responses = await axios.post("/api/user/register", form);
        console.log("registered user", responses.data);
        setForm(formInitialValue);
        navigate("/login");
      } catch (err) {
        console.log(err.response.data.errors);
        setServerError(err.response.data.errors);
      }
    } else {
      setClientError(errors);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1DE]">
      {/* Header */}
      <header className="w-full h-16 bg-[#2C3E50] text-white p-4 flex justify-between items-center px-6 left-0 top-0 shadow-md">
        <h1 className="text-2xl font-bold">Bookmate</h1>
        <Link
          to="/login"
          className="text-white hover:underline"
        >
          Login
        </Link>
      </header>

      {/* Registration Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-[#F8F8F8] p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#1A1A1A] mb-6">
            Register
          </h2>

          {serverError.length > 0 && (
            <ul className="mb-4 text-[#E07A5F] text-sm">
              {serverError.map((ele, index) => (
                <li key={index}>{ele.msg}</li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
              {clientError.name && (
                <p className="text-[#E07A5F] text-sm mt-1">{clientError.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
              {clientError.email && (
                <p className="text-[#E07A5F] text-sm mt-1">{clientError.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              />
              {clientError.password && (
                <p className="text-[#E07A5F] text-sm mt-1">
                  {clientError.password}
                </p>
              )}
            </div>

            {/* Additional Fields for Existing Users */}
            {count > 0 && (
              <>
                {/* Phone Field */}
                <div>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  />
                  {clientError.phone && (
                    <p className="text-[#E07A5F] text-sm mt-1">
                      {clientError.phone}
                    </p>
                  )}
                </div>

                {/* City Field */}
                <div>
                  <input
                    type="text"
                    value={form.location.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: { ...form.location, city: e.target.value },
                      })
                    }
                    placeholder="Enter your city"
                    className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  />
                  {clientError.city && (
                    <p className="text-[#E07A5F] text-sm mt-1">
                      {clientError.city}
                    </p>
                  )}
                </div>

                {/* State Field */}
                <div>
                  <input
                    type="text"
                    value={form.location.state}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: { ...form.location, state: e.target.value },
                      })
                    }
                    placeholder="Enter your state"
                    className="w-full px-4 py-2 border border-[#3D405B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  />
                  {clientError.state && (
                    <p className="text-[#E07A5F] text-sm mt-1">
                      {clientError.state}
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="vendor"
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      name="role"
                      className="mr-2"
                    />
                    I'm a Vendor
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="client"
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      name="role"
                      className="mr-2"
                    />
                    I'm a Client
                  </label>
                </div>
              </>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-[#3D405B] text-white py-2 rounded-lg hover:bg-[#2C3E50] transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#2C3E50] text-white p-4 text-center">
        <p>&copy; 2025 Bookmate. All rights reserved.</p>
      </footer>
    </div>
  );
}