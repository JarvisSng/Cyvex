import React, { useState } from "react";

const ManageRules = () => {
	// If you want to support multiple tabs under Manage Rules,
	// you can use a similar pattern with state. For now, we assume one tab.
	const [activeRuleTab, setActiveRuleTab] = useState("submenu");

	return (
		<div>
			{/* Header tab for Manage Rules */}
			<div className="border-b border-gray-300 mb-4">
				<ul className="flex space-x-4">
					<li
						onClick={() => setActiveRuleTab("submenu")}
						className={`py-2 px-4 border-b-2 cursor-pointer font-semibold ${
							activeRuleTab === "submenu"
								? "border-blue-500 text-blue-500"
								: "border-transparent text-gray-700 hover:border-blue-500"
						}`}
					>
						Sub Menu
					</li>
					{/* Add additional rule tabs here if needed */}
				</ul>
			</div>

			{/* Render content based on active rule tab */}
			{activeRuleTab === "submenu" && (
				<div>
					<h2 className="text-2xl font-bold mb-4">
						Manage Rules - Sub Menu
					</h2>
					<p>Content for managing rules goes here.</p>
				</div>
			)}
		</div>
	);
};

export default ManageRules;
