// src/pages/Help.jsx
import { useState } from "react";
import {
	FiBookOpen,
	FiDownload,
	FiHelpCircle,
	FiLock,
	FiMail,
	FiVideo,
} from "react-icons/fi";
import UserNav from "./UserNav";

const UserHelp = () => {
	const [activeTab, setActiveTab] = useState("faq");

	const faqs = [
		{
			question: "How do I reset my password?",
			answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email.",
			icon: <FiLock className="text-blue-500" />,
		},
		{
			question: "Where can I find documentation?",
			answer: "Visit our Documentation section or download the PDF guide below.",
			icon: <FiBookOpen className="text-blue-500" />,
		},
		{
			question: "How do I contact support?",
			answer: "Email us at cyvexsupport@gmail.com or use the in-app chat during business hours.",
			icon: <FiMail className="text-blue-500" />,
		},
	];

	const resources = [
		{
			title: "User Manual",
			description: "Complete guide to all features",
			icon: <FiBookOpen className="text-2xl text-blue-500" />,
			action: "Download PDF",
		},
		{
			title: "Video Tutorials",
			description: "Step-by-step video guides",
			icon: <FiVideo className="text-2xl text-blue-500" />,
			action: "Watch Now",
		},
		{
			title: "API Documentation",
			description: "Technical integration guide",
			icon: <FiDownload className="text-2xl text-blue-500" />,
			action: "View Docs",
		},
	];

	return (
		<div className="h-screen w-screen overflow-y-auto bg-gray-50 flex flex-col">
			<UserNav />

			<div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 flex-1 mt-20">
				{/* Header */}
				<div className="flex items-center mb-8">
					<FiHelpCircle className="text-4xl text-blue-500 mr-4" />
					<p className="text-gray-600">
						Find answers and resources to help you use our platform
					</p>
				</div>

				{/* Tabs */}
				<div className="flex border-b border-gray-200 mb-8">
					{["faq", "resources", "contact"].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-4 py-2 font-medium ${
								activeTab === tab
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							{tab === "faq"
								? "FAQs"
								: tab === "resources"
								? "Resources"
								: "Contact Support"}
						</button>
					))}
				</div>

				{/* FAQ */}
				{activeTab === "faq" && (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							Frequently Asked Questions
						</h2>
						<div className="space-y-4">
							{faqs.map((f, i) => (
								<div
									key={i}
									className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
								>
									<div className="flex items-start">
										<div className="mr-4 mt-1">
											{f.icon}
										</div>
										<div>
											<h3 className="text-lg font-semibold text-gray-800 mb-2">
												{f.question}
											</h3>
											<p className="text-gray-600">
												{f.answer}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Resources */}
				{activeTab === "resources" && (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							Helpful Resources
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{resources.map((r, i) => (
								<div
									key={i}
									className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col"
								>
									<div className="mb-4">{r.icon}</div>
									<h3 className="text-lg font-semibold text-gray-800 mb-2">
										{r.title}
									</h3>
									<p className="text-gray-600 mb-4 flex-grow">
										{r.description}
									</p>
									<button className="self-start text-blue-600 hover:text-blue-800 font-medium">
										{r.action} →
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Contact Support */}
				{activeTab === "contact" && (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							Contact Our Support Team
						</h2>
						<div className="bg-white rounded-lg shadow-sm p-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div>
									<h3 className="text-xl font-semibold text-gray-800 mb-4">
										Support Options
									</h3>
									<div className="space-y-4">
										<div className="flex items-start">
											<FiMail className="text-blue-500 mt-1 mr-3" />
											<div>
												<h4 className="font-medium text-gray-800">
													Email Support
												</h4>
												<p className="text-gray-600">
													cyvexsupport@gmail.com
												</p>
												<p className="text-sm text-gray-500 mt-1">
													Response time: 24-48 hours
												</p>
											</div>
										</div>
										<div className="flex items-start">
											<FiHelpCircle className="text-blue-500 mt-1 mr-3" />
											<div>
												<h4 className="font-medium text-gray-800">
													Live Chat
												</h4>
												<p className="text-gray-600">
													Mon–Fri, 9AM–5PM
												</p>
												<button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
													Start Chat →
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserHelp;
