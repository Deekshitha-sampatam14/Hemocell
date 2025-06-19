import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";

const DonorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold text-xl">
        Donor information not available.
      </div>
    );
  }

  const sendBloodRequest = async () => {
    const receiverEmail = localStorage.getItem("email");
    const donorEmail = user.email;

    try {
      const res = await fetch("http://localhost:5000/api/auth/request-blood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ donorEmail, receiverEmail }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Blood request sent to ${donorEmail}`);
      } else {
        const text = await res.text();
        console.error("Error response text:", text);
        alert("Failed to send request");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <HeaderComponent />
      <main className="mt-24 bg-black min-h-screen p-6 flex flex-col items-center text-white">
        <div className="max-w-xl w-full bg-[#1c1c1e] border border-red-600 shadow-xl rounded-xl p-6">
          <h1 className="text-3xl font-bold text-red-500 mb-6 text-center">
            Donor Profile
          </h1>

          <div className="space-y-4 text-gray-300">
            <p><strong className="text-white">Name:</strong> {user.name}</p>
            <p><strong className="text-white">Blood Group:</strong> <span className="text-red-400 font-semibold">{user.bloodGroup}</span></p>
            <p><strong className="text-white">Phone:</strong> {user.phone}</p>
            <p><strong className="text-white">Location:</strong> {user.location}</p>
            {user.age && <p><strong className="text-white">Age:</strong> {user.age}</p>}
            {user.gender && <p><strong className="text-white">Gender:</strong> {user.gender}</p>}
            {user.lastDonated && <p><strong className="text-white">Last Donated:</strong> {user.lastDonated}</p>}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={sendBloodRequest}
              	className="w-full bg-dark_red hover:bg-red text-white font-semibold py-3 px-6 rounded-md transition"
            >
              Request Blood
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-dark_red hover:bg-red text-white font-semibold py-3 px-6 rounded-md transition"
            >
              Back to Donors
            </button>
          </div>
        </div>
      </main>
      <FooterComponent />
    </>
  );
};

export default DonorProfile;
