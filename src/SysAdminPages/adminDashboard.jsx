import React, { useState } from "react";
import ManageRules from "../components/ManageRules";
import ManageSubs from "../components/ManageSubs";
import Profile from "../components/Profile";
import SystemActivity from "../components/SystemActivity";
import ViewReports from "../components/ViewReports";
import AdminNav from "./AdminNav";

function AdminDashboard() {
	// activeSection controls which main content component is shown.
	// "subscriptions" shows the ManageSubs component; "rules" shows ManageRules.

	const [activeSection, setActiveSection] = useState("subscriptions");
	// For the subscriptions section, we also keep track of the sub-tab.
	const [activeSubTab, setActiveSubTab] = useState("all");

	return (
		<div className="w-screen h-screen flex flex-col bg-gray-50">
			<AdminNav setActiveSection={setActiveSection} />

			{/* Main content area */}
			<div className="flex flex-1 overflow-hidden pt-70">
				{/* Sidebar */}
				<aside className="w-64 bg-gray-500 border-r border-gray-200 p-4 overflow-y-auto">
					<div className="mb-6">
						<h2 className="font-bold mb-2">Manage Subscriptions</h2>
						<ul>
							<li
								onClick={() => {
									setActiveSection("subscriptions");
									setActiveSubTab("all");
								}}
								className={`py-1 rounded px-2 cursor-pointer ${
									activeSection === "subscriptions" &&
									activeSubTab === "all"
										? "bg-gray-300"
										: "hover:bg-gray-400"
								}`}
							>
								All Users
							</li>
							<li
								onClick={() => {
									setActiveSection("subscriptions");
									setActiveSubTab("subscribed");
								}}
								className={`py-1 rounded px-2 cursor-pointer ${
									activeSection === "subscriptions" &&
									activeSubTab === "subscribed"
										? "bg-gray-300"
										: "hover:bg-gray-400"
								}`}
							>
								Subscribed Users
							</li>
							<li
								onClick={() => {
									setActiveSection("subscriptions");
									setActiveSubTab("pending");
								}}
								className={`py-1 rounded px-2 cursor-pointer ${
									activeSection === "subscriptions" &&
									activeSubTab === "pending"
										? "bg-gray-300"
										: "hover:bg-gray-400"
								}`}
							>
								Pending Payment
							</li>
						</ul>
					</div>
					<div>
						<h2 className="font-bold mb-2">Manage Rules</h2>
						<ul>
							<li
								onClick={() => setActiveSection("rules")}
								className={`py-1 rounded px-2 cursor-pointer ${
									activeSection === "rules"
										? "bg-gray-300"
										: "hover:bg-gray-100"
								}`}
							>
								Sub Menu
							</li>
							<li
								onClick={() =>
									setActiveSection("System Activity")
								}
								className={`py-1 rounded px-2 cursor-pointer ${
									activeSection === "System Activity"
										? "bg-gray-300"
										: "hover:bg-gray-100"
								}`}
							>
								System Activity
							</li>
							
						</ul>
					</div>
				</aside>

				{/* Main Panel */}
				<main className="flex-1 p-6 overflow-y-auto">
					{/* Render the main content based on activeSection */}

					{activeSection === "subscriptions" ? (
						<ManageSubs
							activeSubTab={activeSubTab}
							setActiveSubTab={setActiveSubTab}
						/>
					) : activeSection == "profile" ? (
						<Profile />
					) : activeSection == "System Activity" ? (
						<SystemActivity />
					) : (
						<ManageRules />
					)}
				</main>
			</div>
		</div>
	);
}

export default AdminDashboard;
