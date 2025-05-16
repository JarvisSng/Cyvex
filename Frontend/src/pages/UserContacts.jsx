// src/pages/Contacts.jsx
import { useEffect, useState } from "react";
import { FiChevronUp, FiClock, FiMail, FiSend } from "react-icons/fi";
import ContactForm from "../components/ContactForm";
import UserNav from "./UserNav";

const UserContacts = () => {
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [showScrollButton, setShowScrollButton] = useState(false);

	// Show “back to top” once scrolled down
	useEffect(() => {
		const handleScroll = () =>
			setShowScrollButton(window.pageYOffset > 300);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

	const contactMethods = [
		{
			icon: <FiMail className="text-blue-500 text-2xl" />,
			title: "Email",
			value: "cyvexsupport@gmail.com",
			description: "We'll respond within 24 hours",
		},
		{
			icon: <FiClock className="text-blue-500 text-2xl" />,
			title: "Support Hours",
			value: "24/7 Emergency",
			description: "Critical issues only",
		},
	];

	return (
		// 1) Make this wrapper exactly viewport height...
		// 2) ...and scrollable whenever its content is taller.
		<div className="h-screen w-screen overflow-y-auto bg-gray-50">
			<UserNav />

			<div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 mt-20">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
						Contact Us
					</h1>
					<p className="text-lg text-gray-600">
						We're here to help—reach out however you like.
					</p>
				</div>

				{/* Contact Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
					{contactMethods.map((m, i) => (
						<div
							key={i}
							className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
						>
							<div className="flex items-center mb-4">
								<div className="mr-4">{m.icon}</div>
								<h3 className="text-xl font-semibold text-gray-800">
									{m.title}
								</h3>
							</div>
							<p className="text-gray-700 font-medium mb-1">
								{m.value}
							</p>
							<p className="text-gray-500 text-sm">
								{m.description}
							</p>
						</div>
					))}
				</div>

				{/* Contact Form */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
					<div className="md:flex">
						<div className="md:w-1/3 bg-blue-50 p-8 text-gray-700">
							<h2 className="text-2xl font-bold mb-4">
								Get in Touch
							</h2>
							<p className="mb-6">
								Have questions? Fill out the form and we’ll be
								in touch.
							</p>
							<div className="flex items-start space-x-3">
								<FiSend className="text-blue-500 mt-1" />
								<div>
									<h4 className="font-semibold">
										Response Time
									</h4>
									<p className="text-sm text-gray-600">
										Within 24 hours
									</p>
								</div>
							</div>
						</div>
						<div className="md:w-2/3 p-8">
							{formSubmitted ? (
								<div className="text-center py-12">
									<div className="text-green-500 text-5xl mb-4">
										✓
									</div>
									<h3 className="text-2xl font-bold mb-2">
										Thank You!
									</h3>
									<p className="text-gray-600 mb-6">
										Your message has been sent.
									</p>
									<button
										onClick={() => setFormSubmitted(false)}
										className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
									>
										Send Another
									</button>
								</div>
							) : (
								<ContactForm
									onSuccess={() => setFormSubmitted(true)}
								/>
							)}
						</div>
					</div>
				</div>

				{/* Map */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
					<iframe
						title="SIM Headquarters"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.747704172798!2d103.76789031533184!3d1.329753999036913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1a4f3d3a4b3d%3A0x3a6b3e3b3a3a3a3a!2sSingapore%20Institute%20of%20Management!5e0!3m2!1sen!2ssg!4v1620000000000!5m2!1sen!2ssg"
						className="w-full h-64 md:h-80 lg:h-96 rounded-b-xl"
						allowFullScreen
						loading="lazy"
					/>
				</div>
			</div>

			{/* Back to top */}
			{showScrollButton && (
				<button
					onClick={scrollToTop}
					className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
					aria-label="Back to top"
				>
					<FiChevronUp className="text-xl" />
				</button>
			)}
		</div>
	);
};

export default UserContacts;
