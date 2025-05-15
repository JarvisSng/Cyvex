import { useState } from "react";
import ManageEVM from "../components/ManageEVM";
import ManageRules from "../components/ManageRules";
import ManageSubs from "../components/ManageSubs";
import Profile from "../components/Profile";
import SystemActivity from "../components/SystemActivity";
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
				<aside className="w-64 bg-gray-200 border-r border-gray-300 p-4 overflow-y-auto flex flex-col">
					<h2 className="text-black font-bold mb-4">
						Manage Subscriptions
					</h2>
					<div className="flex flex-col space-y-4">
						<button
							onClick={() => {
								setActiveSection("subscriptions");
								setActiveSubTab("all");
							}}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "subscriptions" &&
								activeSubTab === "all"
									? "!bg-blue-950 text-white"
									: "hover:!bg-gray-300"
							}`}
						>
							All Users
						</button>
						<button
							onClick={() => {
								setActiveSection("subscriptions");
								setActiveSubTab("subscribed");
							}}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "subscriptions" &&
								activeSubTab === "subscribed"
									? "!bg-blue-950 text-white"
									: "hover:!bg-gray-300"
							}`}
						>
							Subscribed Users
						</button>
						<button
							onClick={() => {
								setActiveSection("subscriptions");
								setActiveSubTab("pending");
							}}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "subscriptions" &&
								activeSubTab === "pending"
									? "!bg-blue-950 text-white"
									: "hover:!bg-gray-300"
							}`}
						>
							Pending Payment
						</button>
					</div>
					<h2 className="text-black font-bold mb-4 mt-4">Others</h2>
					<div className="flex flex-col space-y-4">
						<button
							onClick={() => {
								setActiveSection("rules");
							}}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "rules"
									? "!bg-blue-950 text-white"
									: "hover:!bg-gray-300"
							}`}
						>
							Manage Rules
						</button>
						<button
							onClick={() => {
								setActiveSection("evm");
							}}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "evm"
									? "!bg-blue-950 text-white"
									: "hover:!bg-gray-300"
							}`}
						>
							EVM Detector
						</button>
						<button
							onClick={() => {
								setActiveSection("System Activity");
							}}
							className={`w-full p-3 rounded-md text-left pl-4 ${
								activeSection === "System Activity"
									? "!bg-blue-950 text-white"
									: "hover:!bg-gray-300"
							}`}
						>
							System Activity
						</button>
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
					) : activeSection == "rules" ? (
						<ManageRules />
					) : (
						<ManageEVM />
					)}
				</main>
			</div>
		</div>
	);
}

export default AdminDashboard;
