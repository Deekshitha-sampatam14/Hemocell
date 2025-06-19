import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import axios from "axios";
import ButtonComponent from "../../sections/button/button-component";
import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    bloodGroup: "",
    userType: "",
  });

  const [qrVisible, setQrVisible] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      if (response.status === 201) {
        alert("Registration successful!");
        setQrVisible(true);
        setRegistrationSuccess(true);
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Registration failed: " + (error.response?.data?.message || error.message));
    }
  };

  const qrData = JSON.stringify({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    location: formData.location,
    bloodGroup: formData.bloodGroup,
    userType: formData.userType,
  });

  return (
    <>
      <HeaderComponent />
      <main className="mt-24 bg-black min-h-screen flex flex-col items-center p-6 text-black">
        <h2 className="text-3xl font-bold mb-6 text-center text-black-500">Registration</h2>

        {!registrationSuccess && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#1c1c1e] border border-red-600 p-8 rounded-xl shadow-2xl w-full max-w-lg space-y-5 text-black"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="O+">O+</option>
              <option value="A-">A-</option>
              <option value="B-">B-</option>
              <option value="AB-">AB-</option>
              <option value="O-">O-</option>
            </select>

            <label htmlFor="userType" className="block text-white font-semibold">
              I am a
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full p-3 bg-black border text-black border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select User Type</option>
              <option value="donor">Donor</option>
              <option value="receiver">Receiver</option>
            </select>

            <button
              type="submit"
	className="w-full bg-dark_red hover:bg-red text-white font-semibold py-3 px-6 rounded-md transition"
            >
              Register
            </button>
          </form>
        )}

        {qrVisible && (
          <div className="mt-10 bg-[#1c1c1e] border border-red-500 p-6 rounded-xl shadow-lg w-full max-w-sm flex flex-col items-center text-white">
            <h3 className="text-lg font-semibold mb-4 text-red-400">Your QR Code</h3>
            <QRCode value={qrData} bgColor="#fff" fgColor="#000" />
            
            <div className="mt-6 text-left w-full space-y-2">
              <h4 className="text-lg font-semibold text-red-400">Registration Info</h4>
              <p><span className="text-red-300">Name:</span> {formData.name}</p>
              <p><span className="text-red-300">Email:</span> {formData.email}</p>
              <p><span className="text-red-300">Phone:</span> {formData.phone}</p>
              <p><span className="text-red-300">Location:</span> {formData.location}</p>
              <p><span className="text-red-300">Blood Group:</span> {formData.bloodGroup}</p>
              <p><span className="text-red-300">User Type:</span> {formData.userType}</p>
            </div>

            <div className="mt-5 w-full">
              <ButtonComponent buttonText="Go to Login" buttonLink="/login" buttonType="fill" />
            </div>
          </div>
        )}
      </main>
      <FooterComponent />
    </>
  );
}
