import HeroComponent from "../../sections/hero/hero-component";
import TwoCtaComponent from "../../sections/two-cta/two-cta-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";

const HomePage = () => {
	const HomePageDetails = {
		donate_blood: {
			subheadingText: "Save Lives Today",
			headingText: "Donate Blood with HemoCell",
			classHint: "side-col-image donate-blood-with-hemocell",
			paraText:
				"Our mission is to create a community of donors who make a difference in the lives of others. We prioritize the safety and comfort of our donors and patients, and provide the highest quality of care to ensure an easy and convenient donation process. Join us in our life-saving mission.",
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
		},
		quote: {
			classHint: "quote",
			quoteText: `“The blood you donate gives someone another chance at life. One day that someone may be a close relative, a friend, a loved one—or even you.”`,
		},
		why_donate_blood: {
			subheadingText: "Donate blood today",
			headingText: "Why should you donate blood?",
			classHint: "side-col-image why-donate-blood",
			paraText: `Donating blood is a selfless act that has the power to save lives. Here are a few reasons why you should consider donating blood:
			\n― You could help save up to three lives with just one donation.
			― Blood is always needed in emergency situations, such as natural disasters and accidents.
			― Blood is needed for patients undergoing surgeries, cancer treatment, and other medical procedures.
			― Blood cannot be manufactured, which means that the only source of blood is through donations from volunteers.
			― Donating blood can also have health benefits for the donor, such as reducing the risk of heart disease and cancer.`,
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
		},
		eligiblity_criteria: {
			subheadingText: "Are you ready?",
			headingText: "Eligibility Criteria",
			classHint: "side-col-image eligibility-criteria",
			paraText: [
				`18-50 years, above 50 Kg.`,
				`Normal temperature, pulse and blood pressure.`,
				`No Respiratory Diseases`,
				`Above 12.5 g/dL Hemoglobin`,
				`No skin disease, puncture or scars`,
				`No history of transmissible disease`,
			],
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonText: "Donate Now",
			buttonLink: "",
			buttonHave: false,
		},
		hero: {
			subheadingText: "Give the gift of life",
			headingText: "Your Blood Can Make A Difference",
			classHint: "home-page-hero",
		},
		stepsText: {
			subheadingText: "Donation Process",
			headingText: "Step-by-Step Guide to Donating Blood",
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

	return (
		<>
			<HeaderComponent />

			<HeroComponent {...HomePageDetails.hero} />
			<TwoCtaComponent />
			<ThreeStepProcessComponent
				stepsText={HomePageDetails.stepsText}
				stepDetails={stepDetails}
			/>
			<SideBySideComponent {...HomePageDetails.donate_blood} />
			<QuoteComponent {...HomePageDetails.quote} />
			<SideBySideComponent {...HomePageDetails.why_donate_blood} />
			<CriteriaComponent {...HomePageDetails.eligiblity_criteria} />
			<BeforeFooterCTA />
			<FooterComponent />
		</>
	);
};

export default HomePage;
