import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./components/pages/home/home-page";
import NeedBloodPage from "./components/pages/need-blood/need-blood-page";



import RegisterPage from "./components/pages/auth/RegisterPage";
import LoginPage from "./components/pages/auth/LoginPage";
import DonorList from  "./components/pages/need-blood/donor-list";
import DonorProfile from "./components/pages/need-blood/DonorProfile";
import ReceiverDashboard from "./components/pages/dashboards/ReceiverDashboard";
import DonorDashboard from "./components/pages/dashboards/DonorDashboard";
import Logout from "./components/pages/auth/Logout";
import UserProfileView from "./components/pages/dashboards/UserProfileView";
import Chat from "./components/pages/chat/chat";
import Chatbot from "./components/Chatbot";


export default function App() {
	return (
		<>
			{/* <HeaderComponent /> */}
			{/* <BrowserRouter> */}
			
			<Routes>
				<Route exact path="/" element={<HomePage />} />
				<Route path="/need-blood" element={<NeedBloodPage />} />
				
				
				<Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
				<Route path="/donorlist" element={<DonorList/>} />
				<Route path="/donorprofile" element={<DonorProfile/>}/>
				<Route path="/donor-dashboard" element={<DonorDashboard/>} />
				<Route path="/receiver-dashboard" element={<ReceiverDashboard/>} />
				<Route path="/logout" element={<Logout/>}/>
				<Route path="/user-profile-view" element={<UserProfileView/>}/>
				<Route path="/chat" element={<Chat/>}/>
				<Route path="/chatbot" element={<Chatbot/>}/>
			</Routes>
			
			
			{/* </BrowserRouter> */}
			{/* <BeforeFooterCTA />
			<FooterComponent /> */}
		</>
	);
}
