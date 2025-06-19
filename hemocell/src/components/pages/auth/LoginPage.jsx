import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "receiver",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.NODE_ENV === "production"
  ? "https://hemocell-backend.onrender.com"
  : "http://localhost:5000";

      const response = await axios.post(`${baseUrl}/api/auth/login`, formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("email", response.data.user.email);
      localStorage.setItem("hemo_user_loggedin", "true");

      if (response.data.user.userType === "receiver") {
        navigate("/receiver-dashboard");
      } else {
        navigate("/donor-dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed");
    }
  };

  return (
    <>
      <HeaderComponent />
      <main className="mt-24 bg-black min-h-screen flex items-center justify-center text-black px-4">
        <div className="w-full max-w-lg space-y-6">
          <h2 className="text-3xl font-bold text-center text-black-500">Login to HemoCell</h2>

          <form
            onSubmit={handleSubmit}
            className="bg-[#1c1c1e] border border-red-600 p-8 rounded-xl shadow-xl space-y-6"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-black text-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-black text-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full p-3 bg-black text-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="receiver">Receiver</option>
              <option value="donor">Donor</option>
            </select>

            <button
              type="submit"
           	className="w-full bg-dark_red hover:bg-red text-white font-semibold py-3 px-6 rounded-md transition"
            >
              Login
            </button>
          </form>

          <div className="text-center bg-[#1c1c1e] border border-red-600 p-4 rounded-xl">
            <p className="text-white mb-2">New to HemoCell?</p><br/>
            <Link
              to="/register"
              	className="w-full bg-dark_red hover:bg-red text-white font-semibold py-3 px-6 rounded-md transition"
            >
              Register Now
            </Link><br/>
          </div>
        </div>
      </main>
      <FooterComponent />
    </>
  );
}
