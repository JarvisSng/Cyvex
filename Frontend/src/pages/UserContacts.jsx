// src/pages/Contacts.jsx
import { useState } from "react";
import { FiClock, FiMail, FiSend } from "react-icons/fi";
import ContactForm from "../components/ContactForm";
import UserNav from "./UserNav";

const UserContacts = () => {
	const [formSubmitted, setFormSubmitted] = useState(false);

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
		<div className="min-h-screen flex flex-col bg-gray-50">
			<UserNav />

			<div className="flex-1 p-6 md:p-8 lg:p-12">
				<div className="max-w-6xl mx-auto">
					{/* Header Section */}
					<div className="text-center mb-8 md:mb-12">
						<h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
							Contact Us
						</h1>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							We're here to help and answer any questions you
							might have. Reach out to us through any of these
							channels.
						</p>
					</div>

					{/* Contact Cards Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
						{contactMethods.map((method, index) => (
							<div
								key={index}
								className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100"
							>
								<div className="flex items-center mb-4">
									<div className="mr-4">{method.icon}</div>
									<h3 className="text-xl font-semibold text-gray-800">
										{method.title}
									</h3>
								</div>
								<p className="text-gray-700 font-medium mb-1">
									{method.value}
								</p>
								<p className="text-gray-500 text-sm">
									{method.description}
								</p>
							</div>
						))}
					</div>

					{/* Contact Form Section */}
					<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
						<div className="md:flex">
							{/* Left Side - Information */}
							<div className="md:w-1/3 bg-blue-50 p-8 text-gray-700">
								<h2 className="text-2xl font-bold text-gray-800 mb-4">
									Get in Touch
								</h2>
								<p className="mb-6">
									Have questions about our services? Fill out
									the form and our team will get back to you
									as soon as possible.
								</p>

								<div className="space-y-4">
									<div className="flex items-start">
										<FiSend className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
										<div>
											<h4 className="font-semibold">
												Response Time
											</h4>
											<p className="text-sm text-gray-600">
												Typically within 24 hours
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Right Side - Form */}
							<div className="md:w-2/3 p-8">
								{formSubmitted ? (
									<div className="text-center py-12">
										<div className="text-green-500 text-5xl mb-4">
											✓
										</div>
										<h3 className="text-2xl font-bold text-gray-800 mb-2">
											Thank You!
										</h3>
										<p className="text-gray-600 mb-6">
											Your message has been sent
											successfully. We'll get back to you
											soon.
										</p>
										<button
											onClick={() =>
												setFormSubmitted(false)
											}
											className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
										>
											Send Another Message
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

					{/* Map Section */}
					<div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
						<iframe
							title="Office Location"
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291234!2d-73.9878449241646!3d40.74844047138971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
							width="100%"
							height="400"
							style={{ border: 0 }}
							allowFullScreen=""
							loading="lazy"
							className="rounded-b-xl"
						></iframe>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserContacts;
