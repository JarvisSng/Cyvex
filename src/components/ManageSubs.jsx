import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfilesWithSubscriptions } from "../api/supabaseAPI";

const ManageSubs = ({ activeSubTab, setActiveSubTab }) => {
	const [profiles, setProfiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	// Fetch profiles with related subscription data on mount
	useEffect(() => {
		const getProfiles = async () => {
			const result = await fetchUserProfilesWithSubscriptions();
			if (result.error) {
				setError(result.error);
			} else {
				setProfiles(result.data);
			}
			setLoading(false);
		};
		getProfiles();
	}, []);

	// Filter the profiles based on the activeSubTab
	const filteredProfiles = profiles.filter((profile) => {
		const sub = profile.subscription;
		// If there's no subscription info, exclude it.
		if (!sub) return false;
		if (activeSubTab === "all") return true;
		if (activeSubTab === "subscribed") {
			// Show rows where "subscribed" is true
			return sub.subscribed === true;
		}
		if (activeSubTab === "pending") {
			// Show rows where payment_confirm is false
			return sub.payment_confirm === false;
		}
		return true;
	});

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			{/* Header tabs for Manage Subscriptions */}
			<div className="border-b border-gray-300 mb-4">
				<ul className="flex space-x-4">
					<li
						onClick={() => setActiveSubTab("all")}
						className={`py-2 px-4 border-b-2 cursor-pointer font-semibold ${
							activeSubTab === "all"
								? "border-blue-500 text-blue-500"
								: "border-transparent text-gray-700 hover:border-blue-500"
						}`}
					>
						All Users
					</li>
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

			{/* Content Table */}
			<div>
				{filteredProfiles.length === 0 ? (
					<div className="text-gray-500">
						No users found for this category.
					</div>
				) : (
					<table className="min-w-full bg-white border border-gray-200">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									Name
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									Start Date
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									End Date
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									Subscribed
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
									Payment Confirm
								</th>
								<th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredProfiles.map((profile) => {
								const sub = profile.subscription;
								return (
									<tr
										key={profile.id}
										className="border-b border-gray-200"
									>
										<td className="px-4 py-2 text-gray-700">
											{profile.username}
										</td>
										<td className="px-4 py-2 text-gray-700">
											{sub.start_date
												? new Date(
														sub.start_date
												  ).toLocaleDateString()
												: "-"}
										</td>
										<td className="px-4 py-2 text-gray-700">
											{sub.end_date
												? new Date(
														sub.end_date
												  ).toLocaleDateString()
												: "-"}
										</td>
										<td className="px-4 py-2 text-gray-700">
											{sub.subscribed ? "Yes" : "No"}
										</td>
										<td className="px-4 py-2 text-gray-700">
											{sub.payment_confirm ? "Yes" : "No"}
										</td>
										<td className="px-4 py-2 text-right">
											<button
												onClick={() =>
													navigate(
														`/admin/dashboard/${profile.id}`
													)
												}
												className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
											>
												Details
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default ManageSubs;
