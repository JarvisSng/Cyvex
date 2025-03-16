import React, { useState } from "react";
import CodeUploader from "../components/CodeUploader";
import UserProfile from "../components/UserProfile";
import ViewReports from "../components/ViewReports";
import ViewResults from "../components/ViewResults";
import UserNav from "./UserNav";

function UserDashboard() {
	// activeSection controls which main content component is shown.
	// "subscriptions" shows the ManageSubs component; "rules" shows ManageRules.

	const [activeSection, setActiveSection] = useState("dashboard");
	// For the subscriptions section, we also keep track of the sub-tab.
	const [activeSubTab, setActiveSubTab] = useState("all");
	const [submittedCode, setSubmittedCode] = useState(""); // Store submitted code
	const [fileExt, setFileExt] = useState("");

	// Handle code submission from CodeUploader
	const handleCodeSubmit = (code, fileExt) => {
		setSubmittedCode(code);
		setFileExt(fileExt);
		console.log(code);
		console.log(fileExt);
		setActiveSection("View Results"); // Switch to results after submission
	};

	return (
		<div className="w-screen h-screen flex flex-col bg-gray-50">
			<UserNav
				setActiveSection={setActiveSection}
				setActiveSubTab={setActiveSubTab}
			/>

			{/* Main content area */}
			<div className="flex flex-1 overflow-hidden pt-70">
				{/* Sidebar */}
				<aside className="w-64 bg-gray-200 border-r border-gray-300 p-4 overflow-y-auto flex flex-col">
					<h2 className="text-black font-bold mb-4">My Dashboard</h2>
					<div className="flex flex-col space-y-4">
						<button
							onClick={() => setActiveSection("dashboard")}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "dashboard"
									? "!bg-blue-950 text-white"
									: "hover:bg-gray-300"
							}`}
						>
							Code Upload
						</button>
						<button
							onClick={() => setActiveSection("View Results")}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "View Results"
									? "!bg-blue-950 text-white"
									: "hover:bg-gray-300"
							}`}
						>
							View Results
						</button>
						<button
							onClick={() => setActiveSection("View Reports")}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "View Reports"
									? "!bg-blue-950 text-white"
									: "hover:bg-gray-300"
							}`}
						>
							View Reports
						</button>
					</div>
				</aside>

				{/* Main Panel */}
				<main className="flex-1 p-6 overflow-y-auto">
					{/* Render the main content based on activeSection */}
					{activeSection === "dashboard" ? (
						<CodeUploader onSubmit={handleCodeSubmit} />
					) : activeSection === "profile" ? (
						<UserProfile />
					) : activeSection === "View Reports" ? (
						<ViewReports />
					) : activeSection === "View Results" ? (
						<ViewResults code={submittedCode} fileExt={fileExt} />
					) : (
						<></>
					)}
				</main>
			</div>
		</div>
	);
}

export default UserDashboard;
