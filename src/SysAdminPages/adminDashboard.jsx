import React from "react";

function AdminDashboard() {
	return (
		<div className="w-screen h-screen flex flex-col bg-gray-50">
			{/* Top Navbar */}
			<nav className="bg-blue-900 text-white px-4 py-2 flex justify-between items-center">
				{/* Left side: Brand & Nav Links */}
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
				{/* Right side: Username/Avatar */}
				<div className="flex items-center space-x-2">
					<span>name</span>
					{/* Placeholder avatar (optional) */}
					<div className="w-8 h-8 bg-gray-300 rounded-full" />
				</div>
			</nav>

			{/* Main content area */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
					<div className="mb-6">
						<h2 className="font-bold mb-2">Manage Subscriptions</h2>
						<ul>
							<li className="py-1 hover:bg-gray-100 rounded px-2 cursor-pointer">
								subscribed users
							</li>
							<li className="py-1 hover:bg-gray-100 rounded px-2 cursor-pointer">
								pending payment
							</li>
							<li className="py-1 hover:bg-gray-100 rounded px-2 cursor-pointer">
								sub menu
							</li>
						</ul>
					</div>
					<div>
						<h2 className="font-bold mb-2">Manage Rules</h2>
						<ul>
							<li className="py-1 hover:bg-gray-100 rounded px-2 cursor-pointer">
								sub menu
							</li>
						</ul>
					</div>
				</aside>

				{/* Main panel */}
				<main className="flex-1 p-6 overflow-y-auto">
					{/* Tab-like header */}
					<div className="border-b border-gray-300 mb-4">
						<ul className="flex space-x-4">
							<li className="py-2 px-4 border-b-2 border-blue-500 font-semibold cursor-pointer">
								Subscribed Users
							</li>
							<li className="py-2 px-4 text-gray-600 hover:text-blue-500 cursor-pointer">
								Pending Payment
							</li>
							<li className="py-2 px-4 text-gray-600 hover:text-blue-500 cursor-pointer">
								Sub Menu
							</li>
						</ul>
					</div>

					{/* Table of Subscribed Users */}
					<div className="overflow-x-auto">
						<table className="min-w-full bg-white border border-gray-200">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
										name
									</th>
									<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
										type of sub
									</th>
									<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
										start date
									</th>
									<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
										end date
									</th>
									<th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">
										{/* Empty header for Details button */}
									</th>
								</tr>
							</thead>
							<tbody>
								{/* Example rows */}
								<tr className="border-b border-gray-200">
									<td className="px-4 py-2">blah</td>
									<td className="px-4 py-2">blah</td>
									<td className="px-4 py-2">blah</td>
									<td className="px-4 py-2">blah</td>
									<td className="px-4 py-2 text-right">
										<button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
											Details
										</button>
									</td>
								</tr>
								<tr className="border-b border-gray-200">
									<td className="px-4 py-2">blah</td>
									<td className="px-4 py-2">blah</td>
									<td className="px-4 py-2">blah</td>
									<td className="px-4 py-2">blah</td>
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
				</main>
			</div>
		</div>
	);
}

export default AdminDashboard;
