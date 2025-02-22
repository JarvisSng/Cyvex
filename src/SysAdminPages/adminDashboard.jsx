import React, { useState } from "react";
import ManageRules from "../components/ManageRules";
import ManageSubs from "../components/ManageSubs";

function AdminDashboard() {
	// activeSection controls which main content component is shown.
	// "subscriptions" shows the ManageSubs component; "rules" shows ManageRules.
	const [activeSection, setActiveSection] = useState("subscriptions");
	// For the subscriptions section, we also keep track of the sub-tab.
	const [activeSubTab, setActiveSubTab] = useState("subscribed");

	return (
		<div className="w-screen h-screen flex flex-col bg-gray-50">
			{/* Top Navbar */}
			<nav className="bg-blue-900 text-white px-4 py-2 flex justify-between items-center">
				<div className="flex items-center space-x-6">
					<span className="text-xl font-bold">cyvex</span>
					<a
						href="#manage"
						className="hover:bg-blue-700 px-3 py-2 rounded"
					>
						Manage
					</a>
					<a
						href="#contacts"
						className="hover:bg-blue-700 px-3 py-2 rounded"
					>
						Contacts
					</a>
					<a
						href="#help"
						className="hover:bg-blue-700 px-3 py-2 rounded"
					>
						Help
					</a>
				</div>
				<div className="flex items-center space-x-2">
					<span>name</span>
					<div className="w-8 h-8 bg-gray-300 rounded-full" />
				</div>
			</nav>

			{/* Main content area */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 bg-gray-500 border-r border-gray-200 p-4 overflow-y-auto">
					<div className="mb-6">
						<h2 className="font-bold mb-2">Manage Subscriptions</h2>
						<ul>
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
					) : (
						<ManageRules />
					)}
				</main>
			</div>
		</div>
	);
}

export default AdminDashboard;
