import { useEffect, useState } from "react";
import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";
import { useNavigate } from "react-router-dom";

export default function DonorDashboard() {
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.userType === "donor") {
      setDonor(storedUser);
    }
  }, []);

  const acceptRequest = async (requestId, receiverEmail, Status) => {
    try {
      const baseUrl = process.env.NODE_ENV === "production"
  ? "https://hemocell-backend.onrender.com"
  : "http://localhost:5000";

      const res = await fetch(`${baseUrl}/api/auth/accept-blood-request`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, receiverEmail, Status }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        setDonor(prevDonor => ({
          ...prevDonor,
          requests: prevDonor.requests.map(req =>
            req._id === requestId ? { ...req, status: Status } : req
          ),
        }));
      } else {
        const errorText = await res.text();
        alert("Error: " + errorText);
      }
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Something went wrong");
    }
  };

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

  if (!donor) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <>
      <HeaderComponent />
      <main className="mt-24 bg-black min-h-screen text-white py-10 px-4">
        <div className="max-w-4xl mx-auto bg-[#1c1c1e] rounded-xl shadow-2xl p-8">
          <h2 className="text-4xl font-bold text-center text-red-500 mb-8">Donor Dashboard</h2>

          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-white mb-4 border-b border-red-500 pb-2">Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
              <p><strong>Name:</strong> {donor.name}</p>
              <p><strong>Email:</strong> {donor.email}</p>
              <p><strong>Phone:</strong> {donor.phone}</p>
              <p><strong>Location:</strong> {donor.location}</p>
              <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
              <p><strong>User Type:</strong> {donor.userType}</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white mb-4 border-b border-red-500 pb-2">Blood Requests</h3>
            {donor.requests.length === 0 ? (
              <p className="text-gray-300">No blood requests received yet.</p>
            ) : (
              <ul className="space-y-6">
                {donor.requests.map((req, i) => (
                  <li key={i} className="bg-[#2c2c2e] border border-red-600 rounded-lg p-5">
                    <p><strong>Receiver:</strong> {req.receiverEmail}</p>
                    <p><strong>Date:</strong> {new Date(req.date).toLocaleString()}</p>
                    <p><strong>Status:</strong> <span className={`font-semibold ${req.status === "Pending" ? "text-yellow-400" : req.status === "Accepted" ? "text-green-400" : "text-red-400"}`}>{req.status}</span></p>
                    
                    {req.status === "Pending" && (
                      <div className="flex flex-wrap gap-4 mt-4">
                        <button
                          onClick={() => acceptRequest(req._id, req.receiverEmail, "Accepted")}
                         	className="w-full bg-dark_green hover:bg-green text-white font-semibold py-3 px-6 rounded-md transition"
                        >
                          Accept Request
                        </button>
                        <button
                          onClick={() => acceptRequest(req._id, req.receiverEmail, "Declined")}
                         	className="w-full bg-dark_red hover:bg-red text-white font-semibold py-3 px-6 rounded-md transition"
                        >
                          Decline Request
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => viewUserProfile(req.receiverEmail)}
                      className="mt-4 inline-block text-sm text-blue-400 hover:underline"
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
