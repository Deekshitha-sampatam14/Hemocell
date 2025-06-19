import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, NavLink, useNavigate } from "react-router-dom";

import BlackLogo from "../../../../public/HemoCell Logo black.png";
import WhiteLogo from "../../../../public/HemoCell Logo White.png";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Need Blood", href: "/need-blood" },
	 { name: "Chatbot", href: "/chatbot" }, 
];

const authNavigation = [
	{ name: "Register", href: "/register", secondLast: true },
	{ name: "Login", href: "/login", last: true },
];

const compnayName = "HemoCell Blood Bank";

const HeaderComponent = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [offset, setOffset] = useState(0);
	const [blurActivation, setBlurActivation] = useState(false);
	const [isActiveName, setIsActiveName] = useState(null);
	const navigate = useNavigate();

	const isLoggedIn = localStorage.getItem("hemo_user_loggedin") === "true";

	const reuseableClass = {
		for_last: `last:bg-red last:text-white last:hover:bg-white last:hover:text-dark`,
		for_second_last: `rounded-rsm border border-white/[.5] hover:bg-white hover:text-dark`,
	};

	useEffect(() => {
		const onScroll = () => {
			setOffset(window.pageYOffset);
			setBlurActivation(window.pageYOffset > 5);
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header
			className={`fixed inset-x-0 top-0 z-50 border-b border-white/[.2] ${
				blurActivation ? "bg-dark/[.6] backdrop-blur-md" : ""
			}`}
		>
			<nav
				className="flex items-center justify-between p-6 lg:px-8 w-[min(1250px,100%-15px)] m-auto"
				aria-label="Global"
			>
				<div className="flex lg:flex-1">
					<a href="/" className="-m-1.5 p-1.5">
						<span className="sr-only">{compnayName}</span>
						<img className="w-auto h-10" src={WhiteLogo} alt="" />
					</a>
				</div>

				<div className="flex lg:hidden">
					<button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-off_white"
						onClick={() => setMobileMenuOpen(true)}
					>
						<span className="sr-only">Open main menu</span>
						<Bars3Icon className="w-6 h-6" aria-hidden="true" />
					</button>
				</div>

				<div className="hidden lg:flex lg:gap-x-4 lg:transition">
					{navigation.map((item) => {
						const isRestricted =
							item.href === "/need-blood" || item.href === "/donate-blood";

						return (
							<NavLink
								key={item.name}
								onClick={(e) => {
									if (isRestricted && !isLoggedIn) {
										e.preventDefault();
										alert("Please log in to access this page.");
										navigate("/login");
										return;
									}
									setIsActiveName(item.name);
									setMobileMenuOpen(false);
								}}
								to={item.href}
								className={`text-sm font-medium hover:bg-red lg:transition leading-6 text-off_white px-3 py-2 rounded-rsm ${
									isActiveName === item.name ? `bg-dark` : ``
								}`}
							>
								{item.name}
							</NavLink>
						);
					})}

					{!isLoggedIn &&
						authNavigation.map((item) => (
							<NavLink
								key={item.name}
								to={item.href}
								className={`text-sm font-medium leading-6 text-off_white px-3 py-2 rounded-rsm ${
									item.secondLast && reuseableClass.for_second_last
								} ${item.last && reuseableClass.for_last}`}
							>
								{item.name}
							</NavLink>
						))}

					{isLoggedIn && (
						<NavLink
							to="/logout"
							className="text-sm font-medium leading-6 text-off_white px-3 py-2 rounded-rsm border border-white/[.5] hover:bg-white hover:text-dark"
						>
							Logout
						</NavLink>
					)}
				</div>
			</nav>

			{/* Mobile menu */}
			<Dialog
				as="div"
				className="lg:hidden"
				open={mobileMenuOpen}
				onClose={setMobileMenuOpen}
			>
				<div className="fixed inset-0 z-50" />
				<Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full px-6 py-6 overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
					<div className="flex items-center justify-between">
						<a href="/" className="-m-1.5 p-1.5">
							<span className="sr-only">{compnayName}</span>
							<img className="w-auto h-12" src={BlackLogo} alt="" />
						</a>
						<button
							type="button"
							className="-m-2.5 rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(false)}
						>
							<span className="sr-only">Close menu</span>
							<XMarkIcon className="w-6 h-6" aria-hidden="true" />
						</button>
					</div>
					<div className="flow-root mt-6">
						<div className="-my-6 divide-y divide-gray-500/10">
							<div className="py-6 space-y-2">
								{navigation.map((item) => {
									const isRestricted =
										item.href === "/need-blood" ||
										item.href === "/donate-blood";

									return (
										<NavLink
											key={item.name}
											onClick={(e) => {
												if (isRestricted && !isLoggedIn) {
													e.preventDefault();
													alert("Please log in to access this page.");
													navigate("/login");
													return;
												}
												setIsActiveName(item.name);
												setMobileMenuOpen(false);
											}}
											to={item.href}
											className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-dark hover:text-white ${
												isActiveName === item.name
													? `bg-dark text-white`
													: ``
											}`}
										>
											{item.name}
										</NavLink>
									);
								})}

								{!isLoggedIn &&
									authNavigation.map((item) => (
										<NavLink
											key={item.name}
											to={item.href}
											className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-dark hover:text-white`}
										>
											{item.name}
										</NavLink>
									))}

								{isLoggedIn && (
									<NavLink
										to="/logout"
										className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 border border-dark/[.5] hover:bg-dark hover:text-white"
									>
										Logout
									</NavLink>
								)}
							</div>
						</div>
					</div>
				</Dialog.Panel>
			</Dialog>
		</header>
	);
};

export default HeaderComponent;
