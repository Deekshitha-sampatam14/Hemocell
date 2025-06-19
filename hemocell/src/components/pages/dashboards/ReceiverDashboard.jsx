import { useEffect, useState } from "react";
import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";
import { useNavigate } from "react-router-dom";

export default function ReceiverDashboard() {
  const [receiver, setReceiver] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.userType === "receiver") {
      setReceiver(storedUser);
    }
  }, []);

  const viewUserProfile = async (email) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/get-user-by-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        const data = await res.json();
        navigate("/user-profile-view", { state: { user: data.user } });
      } else {
        alert("User not found");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      alert("Server error");
    }
  };

  if (!receiver) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading...</div>;

  return (
    <>
      <HeaderComponent />

      <main className="mt-24 bg-black min-h-screen text-white px-4 py-12">
        <div className="max-w-3xl mx-auto bg-[#1c1c1e] border border-red-600 rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-red-500">
            Receiver Dashboard
          </h2>

          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-3 text-white">Profile</h3>
            <div className="space-y-2 text-gray-200">
              <p><span className="text-red-400 font-medium">Name:</span> {receiver.name}</p>
              <p><span className="text-red-400 font-medium">Email:</span> {receiver.email}</p>
              <p><span className="text-red-400 font-medium">Phone:</span> {receiver.phone}</p>
              <p><span className="text-red-400 font-medium">Location:</span> {receiver.location}</p>
              <p><span className="text-red-400 font-medium">Blood Group:</span> {receiver.bloodGroup}</p>
              <p><span className="text-red-400 font-medium">User Type:</span> {receiver.userType}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-white">Your Blood Requests</h3>
            {receiver.requests.length === 0 ? (
              <p className="text-gray-300">You haven't made any blood requests yet.</p>
            ) : (
              <ul className="space-y-4">
                {receiver.requests.map((req, i) => (
                  <li key={i} className="bg-[#2c2c2e] border border-red-500 p-4 rounded-md text-white">
                    <p><span className="text-red-300 font-medium">Donor:</span> {req.donorEmail}</p>
                    <p><span className="text-red-300 font-medium">Date:</span> {new Date(req.date).toLocaleString()}</p>
                    <p><span className="text-red-300 font-medium">Status:</span> <span className="font-semibold text-blue-400">{req.status}</span></p>
                    <button
                      onClick={() => viewUserProfile(req.donorEmail)}
                      className="mt-3 text-sm text-red-400 underline hover:text-red-200 transition"
                    >
                      View Profile
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <FooterComponent />
    </>
  );
}
