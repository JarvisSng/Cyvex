import React, { useState, useRef, useEffect } from "react";
import Profile from "../components/Profile"; 
import ViewReports from "../components/ViewReports";
import UserNav from "./UserNav";
import CodeUploader from "../components/CodeUploader"; 
import ViewResults from "../components/ViewResults";

function UserDashboard() {
	// activeSection controls which main content component is shown.
	// "subscriptions" shows the ManageSubs component; "rules" shows ManageRules.

	const [activeSection, setActiveSection] = useState("dashboard");
	// For the subscriptions section, we also keep track of the sub-tab.
	const [activeSubTab, setActiveSubTab] = useState("all");  

	return (
		<div className="w-screen h-screen flex flex-col bg-gray-50">
			<UserNav setActiveSection={setActiveSection} setActiveSubTab={setActiveSubTab}/>

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
						<CodeUploader/>
					) : activeSection === "profile" ? (
						<Profile />
					) : activeSection === "View Reports" ? (
						<ViewReports/>
					) : activeSection === "View Results" ? (
						<ViewResults/>
					) : (
						<></> 
					)} 
				</main> 
			</div>  

		</div>
	);
}

export default UserDashboard;