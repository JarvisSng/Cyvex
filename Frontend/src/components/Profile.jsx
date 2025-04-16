import React, { useEffect, useState } from "react";
import {
	fetchAdminProfiles,
	resetUserPassword,
} from "../controller/userController";

const Profile = () => {
	const [profile, setProfile] = useState({});
	const [error, setError] = useState(null);

	useEffect(() => {
		const getProfiles = async () => {
			const username = localStorage.getItem("username");
			const result = await fetchAdminProfiles(username);
			if (result.error) {
				setError(result.error);
			} else {
				// Assuming the API returns { data: [ profile, ... ] }

				setProfile(result.data[0]);
			}
		};

		getProfiles();
	}, []);

	const handleResetPassword = async () => {
		if (!profile.id) {
			alert("Profile not loaded yet.");
			return;
		}
		const result = await resetUserPassword(profile.id);
		if (result.error) {
			alert("Error: " + result.error);
		} else {
			alert(result.message);
		}
	};

	if (error) {
		return (
			<div className="p-4 text-center text-red-600">Error: {error}</div>
		);
	}
	if (!profile || !profile.id) {
		return <div className="p-4 text-center">Loading...</div>;
	}

	return (
		<div className="w-full h-full p-6 bg-gray-50 dark:bg-gray-900">
			<div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
				{/* Basic Information */}
				<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
					Basic Information
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
					<div className="flex flex-col">
						<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
							User Name
						</span>
						<span className="text-lg text-gray-800 dark:text-gray-100">
							{profile.username}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
							Role
						</span>
						<span className="text-lg text-gray-800 dark:text-gray-100">
							{profile.role}
						</span>
					</div>
				</div>

				{/* Contact Information */}
				<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
					Contact Information
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
					<div className="flex flex-col">
						<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
							Email Address
						</span>
						<span className="text-lg text-gray-800 dark:text-gray-100">
							{profile.authData && profile.authData.email}
						</span>
					</div>
				</div>

				{/* System & Access Information */}
				<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
					System & Access Information
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex flex-col">
						<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
							Date Joined
						</span>
						<span className="text-lg text-gray-800 dark:text-gray-100">
							{new Intl.DateTimeFormat("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
								hour: "numeric",
								minute: "numeric",
								hour12: true,
							}).format(new Date(profile.created_at))}
						</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
							Status
						</span>
						<span className="text-lg text-gray-800 dark:text-gray-100">
							{profile.status}
						</span>
					</div>
				</div>

				{/* Reset Password Button */}
				<div className="mt-8 flex justify-center">
					<button
						onClick={handleResetPassword}
						className="px-6 py-3 !bg-black text-white rounded hover:!bg-blue-700"
					>
						Reset Password
					</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
