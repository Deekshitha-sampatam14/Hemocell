import React from "react";
import { useLocation, Link } from "react-router-dom";

import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";

const DonorList = () => {
  const location = useLocation();
  const { userData } = location.state || {};

  const sendBloodRequest = async (donorEmail,Type) => {
    const receiverEmail = localStorage.getItem("email"); // assuming email is stored on login
  
    try {
      const baseUrl = process.env.NODE_ENV === "production"
  ? "https://hemocell-backend.onrender.com"
  : "http://localhost:5000";

      const res = await fetch(`${baseUrl}/api/auth/request-blood`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ donorEmail, receiverEmail ,Type })
      });
  
      if (res.ok) {
        const data = await res.json();
        alert(`Blood request sent to ${donorEmail}`);
      } else {
        const text = await res.text(); // fallback if response is not JSON
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
          <main className="mt-24">

    <div className="min-h-screen bg-[#fef2f2] py-10 px-4">
      <h1 className="text-4xl font-extrabold text-center text-red-700 mb-10 drop-shadow">
        Available Blood Donors
      </h1>

      {userData && userData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {userData.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-red-200 rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">{user.name}</h2>
                <p className="text-gray-700 mb-1">
                  <strong>Blood Group:</strong> <span className="text-lg font-semibold text-red-500">{user.bloodGroup}</span>
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Location:</strong> {user.location}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Phone:</strong> {user.phone}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/donorprofile"
                  state={{ user }}
                  className="w-full"
                >
                  <button className="w-full bg-white text-red-600 border border-red-500 py-2 rounded-md hover:bg-red-50 font-semibold transition">
                    View Profile
                  </button>
                </Link>
                <button
                onClick={() => sendBloodRequest(user.email,"Normal")}
               className="w-full bg-white text-red-600 border border-red-500 py-2 rounded-md hover:bg-red-50 font-semibold transition"
                >
              Request Blood
            </button>
            
             <button onClick={()=>sendBloodRequest(user.email,"Emergency")}
            type="submit"
            className="cta-btn mt-5 rounded-rsm border border-dark_red text-white bg-dark_red hover:bg-dark hover:text-white transition text-black px-8 py-3 text-sm w-fit font-bold"
          >
            Emergency Request
          </button>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg font-medium">
          No donors found.
        </p>
      )}
    </div>
    </main>
    <FooterComponent/>

    </>
    
  );
};

export default DonorList;
