import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";

const UserProfileView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  const senderEmail = localStorage.getItem("email");

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-bold text-xl">
        User information not available.
      </div>
    );
  }

  return (
    <>
      <HeaderComponent />
      <main className="mt-24 bg-black min-h-screen text-white px-4 py-12">
        <div className="max-w-xl mx-auto bg-[#1c1c1e] border border-red-600 rounded-xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-red-500 mb-6">
            Profile Information
          </h1>

          <div className="space-y-4 text-lg">
            <p><span className="text-red-400 font-semibold">Name:</span> {user.name}</p>
            <p><span className="text-red-400 font-semibold">Email:</span> {user.email}</p>
            <p><span className="text-red-400 font-semibold">Phone:</span> {user.phone}</p>
            <p><span className="text-red-400 font-semibold">Location:</span> {user.location}</p>
            <p><span className="text-red-400 font-semibold">Blood Group:</span> <span className="text-red-300 font-bold">{user.bloodGroup}</span></p>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/chat", { state: { senderEmail, user } })}
      className="w-full bg-dark_red hover:bg-dark text-white font-semibold py-3 px-6 rounded-md transition"
            >
              Chat Now
            </button>
          </div>
        </div>
      </main>
      <FooterComponent />
    </>
  );
};

export default UserProfileView;
