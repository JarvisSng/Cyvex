import React, { useState, useRef, useEffect } from "react";
import Profile from "../components/Profile"; 
import ViewReports from "../components/ViewReports";
import UserNav from "./UserNav";
import CodeUploader from "../components/CodeUploader"; 

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
				<aside className="w-64 bg-gray-500 border-r border-gray-200 p-4 overflow-y-auto">
					
					<div>
						<h2 className="font-bold mb-2">My Dashboard</h2>
						<ul>
							<li
								onClick={() => setActiveSection("dashboard")}
								className={`py-1 rounded px-2 cursor-pointer ${
									activeSection === "dashboard"
										? "bg-gray-300"
										: "hover:bg-gray-100"
								}`}
							> 
								Uploads
							</li>
							<li
								onClick={() => setActiveSection("View Reports")}
								className={`py-1 rounded px-2 cursor-pointer ${
									activeSection === "View Reports"
										? "bg-gray-300"
										: "hover:bg-gray-100"
								}`} 
							> 
								Reports
							</li>
						</ul>
					</div> 
				</aside>

				{/* Main Panel */}
				<main className="flex-1 p-6 overflow-y-auto">
					{/* Render the main content based on activeSection */}
					
					{(activeSection === "dashboard") ? (
						<CodeUploader/>
					) : (activeSection == "profile") ? (
						<Profile />		 			
					) : (activeSection == "View Reports") ? (
						<ViewReports/>
					) : (
						<></> 
					)} 
				</main> 
			</div> 
		</div>
	);
}

export default UserDashboard;