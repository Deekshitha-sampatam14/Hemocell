import { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import FormComponent from "../../sections/form/form-component";
import SearchBloodStockComponent from "../../sections/search-blood-stock/search-blood-stock-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";

import Axios from "axios";
import newUsersInsertRequest from "../../utility-functions/new-users-insert-request";

const NeedBloodPage = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		bloodType: "",
		message: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
	  
		console.log(formData);

		localStorage.setItem("email", formData.email);

		const baseUrl = process.env.NODE_ENV === "production"
  ? "https://hemocell-backend.onrender.com"
  : "http://localhost:5000";

	  
		// Send the location data to the backend to fetch users (donors)
		Axios.post(`${baseUrl}/api/auth/get-donors-by-location`, {
		  location: formData.location,
		})
		  .then((response) => {
			console.log("Donors found:", response.data);
	  
			// Navigate to the DonorList page and pass the user data
			navigate('/donorlist', { state: { userData: response.data } });
		  })
		  .catch((error) => {
			console.log("Error fetching donors:", error);
		  });
	  
		// Insert the new user into the database (custom logic for blood donation)
	
	  
		setFormData({
		  name: "",
		  email: "",
		  phone: "",
		  bloodGroup: "",
		  message: "",
		});
	  };
	  
	const NeedBloodPageDetails = {
		quote: {
			classHint: "quote need-blood-quote",
			quoteText: `Facing a blood emergency?\n 
            Click Emergency Button on donor profile and let us help you!`,
			
		},
		tips_for_managing_blood_loss: {
			subheadingText: "",
			headingText: "Tips for Managing Blood Loss",
			classHint: "tips-for-managing-blood-loss",
			paraText: [
				`Stay calm and avoid any strenuous activity.`,
				`Elevate the affected area if possible to reduce blood flow.`,
				`Apply pressure to the wound to slow down or stop the bleeding.`,
				`Drink fluids such as water or sports drinks to help replenish lost fluids.`,
				`Consume foods that are high in iron and protein, such as spinach, beans, and lean meats to help replenish lost nutrients.`,
				`Consider taking iron supplements if recommended by your doctor.`,
				`Keep a record of any symptoms and changes in condition to share with medical professionals.`,
			],
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonHave: false,
		},
		hero: {
			subheadingText: "Need blood?",
			headingText: "Your blood needs are our priority.",
			classHint: "hero need-blood-page-hero",
		},
		stepsText: {
			subheadingText: "Collecting Blood",
			headingText: "From start to finish, here's what to expect.",
		},
		bloodStock: {
			subheadingText: "When you need it",
			headingText: "Find Available Blood Stock",
			classHint: "search-blood-stock",
		},
	};

	const stepDetails = [
		{
			key: "registration",
			stepNumber: "01",
			stepName: "Registration",
			stepDescription:
				"Donor will be asked to fill out a registration form with their personal information and blood group.",
		},
		{
			key: "Request by Receiver",
			stepNumber: "02",
			stepName: "Request by Receiver",
			stepDescription:
				"A request to Donor will be sent by the Receiver who needs blood ",
		},
		{
			key: "Request Acceptance or Decline done by Donor",
			stepNumber: "03",
			stepName: "Request Acceptance or Decline done by Donor",
			stepDescription:
				"Donor Accepts or Declines the blood donation request sent by Receiver ",
		},

		{
			key: "screening",
			stepNumber: "04",
			stepName: "Screening",
			stepDescription:
				"If Donor accepts the blood then a medical professional will check Donor vitals and ask them a series of questions to ensure they are eligible to donate.",
		},
		{
			key: "donation",
			stepNumber: "05",
			stepName: "Donation",
			stepDescription:
				"A sterile needle will be inserted into Donor arm to collect their blood, which will then be stored and used for transfusions.",
		},
	];

	const fields = [
		{
			key: "name",
			name: "name",
			type: "text",
			placeholder: "Name",
			required: true,
		},
		{
			key: "email",
			name: "email",
			type: "email",
			placeholder: "Email",
			required: true,
		},
		{
			key: "phone",
			name: "phone",
			type: "tel",
			placeholder: "Phone",
			required: true,
		},
		{
			key: "bloodType",
			name: "bloodType",
			type: "text",
			placeholder: "Blood Type",
			required: false,
		},
		{
			key: "location",
			name: "location",
			type: "text",
			placeholder: "Location",
			required: true,
		}
	];

	return (
		<>
			<HeaderComponent />

			<HeroComponent {...NeedBloodPageDetails.hero} />
			<FormComponent
				fields={fields}
				heading={"Request for emergency blood"}
				buttonText={"Request blood"}
				handleSubmit={handleSubmit}
				formData={formData}
				setFormData={setFormData}
			/>
			<QuoteComponent {...NeedBloodPageDetails.quote} />
			
			<ThreeStepProcessComponent
				stepsText={NeedBloodPageDetails.stepsText}
				stepDetails={stepDetails}
			/>
			<CriteriaComponent
				{...NeedBloodPageDetails.tips_for_managing_blood_loss}
			/>
			<BeforeFooterCTA />
			<FooterComponent />
		</>
	);
};

export default NeedBloodPage;
