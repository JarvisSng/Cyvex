import React from "react";

const ManageSubs = ({ activeSubTab, setActiveSubTab }) => {
	return (
		<div>
			{/* Header tabs for Manage Subscriptions */}
			<div className="border-b border-gray-300 mb-4">
				<ul className="flex space-x-4">
					<li
						onClick={() => setActiveSubTab("subscribed")}
						className={`py-2 px-4 border-b-2 cursor-pointer font-semibold ${
							activeSubTab === "subscribed"
								? "border-blue-500 text-blue-500"
								: "border-transparent text-gray-700 hover:border-blue-500"
						}`}
					>
						Subscribed Users
					</li>
					<li
						onClick={() => setActiveSubTab("pending")}
						className={`py-2 px-4 border-b-2 cursor-pointer font-semibold ${
							activeSubTab === "pending"
								? "border-blue-500 text-blue-500"
								: "border-transparent text-gray-700 hover:border-blue-500"
						}`}
					>
						Pending Payment
					</li>
				</ul>
			</div>

			{/* Content based on active sub-tab */}
			{activeSubTab === "subscribed" ? (
				<div>
					<h2 className="text-2xl font-bold mb-4 text-gray-500">
						Subscribed Users
					</h2>
					<table className="min-w-full bg-white border border-gray-200">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									Name
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									Type of Sub
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									Start Date
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									End Date
								</th>
								<th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">
									{/* Details button column */}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-gray-200">
								<td className="px-4 py-2">User A</td>
								<td className="px-4 py-2">Premium</td>
								<td className="px-4 py-2">2023-01-01</td>
								<td className="px-4 py-2">2023-12-31</td>
								<td className="px-4 py-2 text-right">
									<button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
										Details
									</button>
								</td>
							</tr>
							{/* Add more rows as needed */}
						</tbody>
					</table>
				</div>
			) : activeSubTab === "pending" ? (
				<div>
					<h2 className="text-2xl font-bold mb-4 text-gray-500">
						Pending Payment
					</h2>
					<table className="min-w-full bg-white border border-gray-200">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									Name
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									Type of Sub
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									Start Date
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									End Date
								</th>
								<th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">
									{/* Details button column */}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-gray-200">
								<td className="px-4 py-2">User B</td>
								<td className="px-4 py-2">Basic</td>
								<td className="px-4 py-2">2023-02-01</td>
								<td className="px-4 py-2">2023-08-31</td>
								<td className="px-4 py-2 text-right">
									<button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
										Details
									</button>
								</td>
							</tr>
							{/* Add more rows as needed */}
						</tbody>
					</table>
				</div>
			) : null}
		</div>
	);
};

export default ManageSubs;
