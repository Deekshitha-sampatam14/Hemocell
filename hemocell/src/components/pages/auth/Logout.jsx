import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Clear login data
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		localStorage.removeItem("hemo_user_loggedin");

		// Optional: show a message
		alert("You have been logged out successfully.");

		// Redirect to homepage or login
		navigate("/");
	}, [navigate]);

	return null;
};

export default Logout;
