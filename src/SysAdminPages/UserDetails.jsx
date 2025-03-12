import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	deleteUser,
	getUserProfile,
	resetUserPassword,
	suspendUser,
	updateSubscription,
} from "../controller/userController";

const UserDetails = () => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const [profile, setProfile] = useState(null);
	const [subscription, setSubscription] = useState({
		start_date: "",
		end_date: "",
		subscribed: false,
		payment_confirm: false,
	});
	const [suspendInput, setSuspendInput] = useState(""); // input for ban duration (hours)
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// 100 years in hours ~ 876000 hours (for UI logic if needed)
	const hundredYearsHours = 876000;

	useEffect(() => {
		const loadUserProfile = async () => {
			const result = await getUserProfile(userId);
			if (result.error) {
				setError(result.error);
			} else {
				const data = result.data;
				if (data.role !== "user") {
					setError(
						"This page is only available for users with role 'user'."
					);
				} else {
					setProfile(data);
					if (data.subscription) {
						setSubscription({
							start_date: data.subscription.start_date || "",
							end_date: data.subscription.end_date || "",
							subscribed: data.subscription.subscribed || false,
							payment_confirm:
								data.subscription.payment_confirm || false,
						});
					}
				}
			}
			setLoading(false);
		};

		loadUserProfile();
	}, [userId]);

	const handleSubscriptionChange = (e) => {
		const { name, value, type, checked } = e.target;
		setSubscription((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleUpdateSubscription = async () => {
		if (isSuspended) {
			alert("Cannot update subscription while user is suspended.");
			return;
		}
		// Convert empty date fields to null
		const updatedSubscription = {
			...subscription,
			start_date:
				subscription.start_date === "" ? null : subscription.start_date,
			end_date:
				subscription.end_date === "" ? null : subscription.end_date,
		};
		const result = await updateSubscription(userId, updatedSubscription);
		if (result.error) {
			alert("Error: " + result.error);
		} else {
			alert(result.message);
		}
	};

	// Determine suspension state based on profile data.
	// If profile.status is "Suspended", the user is suspended.
	// If profile.status is "Deleted", the user is permanently banned.
	const now = new Date();
	const banEndDate = profile?.banned_until
		? new Date(profile.banned_until)
		: null;
	const formattedDate = banEndDate
		? new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
				timeZoneName: "short",
		  }).format(banEndDate)
		: null;
	const isSuspended = profile?.status === "Suspended";
	const isDeleted = profile?.status === "Deleted";

	const handleSuspendUser = async () => {
		let hours;
		if (!isSuspended) {
			// Use input from UI (ban duration in hours)
			hours = parseInt(suspendInput, 10);
			if (isNaN(hours) || hours <= 0) {
				alert("Please enter a valid number of hours.");
				return;
			}
		} else {
			hours = 0; // unsuspend
		}
		const result = await suspendUser(userId, hours);
		if (result.error) {
			alert("Error: " + result.error);
		} else {
			alert(result.message);
			// Reload profile to get updated status and banned_until
			const res = await getUserProfile(userId);
			if (!res.error) {
				setProfile(res.data);
			}
			setSuspendInput("");
		}
	};

	const handleDeleteUser = async () => {
		if (
			window.confirm(
				"Are you sure you want to delete this user? This action cannot be reversed without database administrator privileges."
			)
		) {
			const result = await deleteUser(userId);
			if (result.error) {
				alert("Error: " + result.error);
			} else {
				alert(result.message);
				// Reload profile to get updated status and banned_until
				const res = await getUserProfile(userId);
				if (!res.error) {
					setProfile(res.data);
				}
			}
		}
	};

	const handleResetPassword = async () => {
		try {
			const result = await resetUserPassword(profile.id);
			if (result.error) {
				alert("Error: " + result.error);
			} else {
				alert(result.message);
			}
		} catch (error) {
			alert("Error: " + error.message);
		}
	};

	// Back button to navigate to the previous page
	const handleBack = () => {
		navigate(-1);
	};

	if (loading) return <div className="p-4 text-center">Loading...</div>;
	if (error)
		return (
			<div className="p-4 text-center text-red-600">Error: {error}</div>
		);
	if (!profile)
		return <div className="p-4 text-center">No user data found.</div>;

	return (
		<div className="w-screen h-screen bg-gray-50 flex flex-col">
			<div className="max-w-3xl mx-auto p-6 bg-white shadow rounded flex-1 overflow-y-auto">
				<div className="flex justify-center">
					<button
						onClick={handleBack}
						className="mb-4 bg-gray-200 hover:bg-gray-300 text-white px-4 py-2 rounded mt-5 w-40"
					>
						Back
					</button>
				</div>
				<h1 className="text-3xl text-gray-600 font-bold mb-6">
					{profile.username}
				</h1>
				<p className="text-red-700 mb-4">
					{isSuspended
						? "The account is suspended " +
						  (banEndDate == null ? "" : "until " + formattedDate)
						: ""}
				</p>
				<p className="text-red-700 mb-4">
					{isDeleted
						? "This account is deleted and no longer active"
						: ""}
				</p>

				{/* Manage Subscription Section */}
				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						Manage Subscription
					</h2>
					<div className="mb-4">
						<label className="block text-gray-700 mb-1">
							Start Date:
						</label>
						<input
							type="date"
							name="start_date"
							value={
								subscription.start_date
									? subscription.start_date.split("T")[0]
									: ""
							}
							onChange={handleSubscriptionChange}
							disabled={isSuspended || isDeleted}
							className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none text-gray-400 focus:ring focus:border-blue-500"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-1">
							End Date:
						</label>
						<input
							type="date"
							name="end_date"
							value={
								subscription.end_date
									? subscription.end_date.split("T")[0]
									: ""
							}
							onChange={handleSubscriptionChange}
							disabled={isSuspended || isDeleted}
							className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none text-gray-400 focus:ring focus:border-blue-500"
						/>
					</div>
					<div className="mb-4 flex items-center">
						<label className="text-gray-700 mr-2">
							Subscribed:
						</label>
						<input
							type="checkbox"
							name="subscribed"
							checked={subscription.subscribed}
							onChange={handleSubscriptionChange}
							disabled={isSuspended || isDeleted}
							className="h-5 w-5 text-blue-600"
						/>
					</div>
					<div className="mb-4 flex items-center">
						<label className="text-gray-700 mr-2">
							Payment Confirm:
						</label>
						<input
							type="checkbox"
							name="payment_confirm"
							checked={subscription.payment_confirm}
							onChange={handleSubscriptionChange}
							disabled={isSuspended || isDeleted}
							className="h-5 w-5 text-blue-600"
						/>
					</div>
					<button
						className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
							isSuspended || isDeleted
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}
						onClick={handleUpdateSubscription}
						disabled={isSuspended || isDeleted}
					>
						Update Subscription
					</button>
				</section>

				{/* Account Management Section */}
				<section>
					<h2 className="text-2xl font-semibold mb-4 text-gray-700">
						Account Management
					</h2>
					<div className="flex flex-col gap-4">
						{profile.status === "Active" && (
							<div className="flex flex-col max-w-xs">
								<label className="text-gray-700 mb-1">
									Ban Duration (hours):
								</label>
								<input
									type="number"
									min="1"
									value={suspendInput}
									onChange={(e) =>
										setSuspendInput(e.target.value)
									}
									className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-500 text-gray-600"
								/>
							</div>
						)}
						<div className="flex flex-wrap gap-4">
							<button
								className={`bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded ${
									isDeleted
										? "opacity-50 cursor-not-allowed"
										: ""
								}`}
								onClick={handleSuspendUser}
								disabled={isDeleted}
							>
								{isSuspended
									? "Unsuspend User"
									: "Suspend User"}
							</button>
							<button
								className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ${
									isDeleted
										? "opacity-50 cursor-not-allowed"
										: ""
								}`}
								onClick={handleDeleteUser}
								disabled={isDeleted}
							>
								{isDeleted ? "User is Deleted" : "Delete User"}
							</button>
							<button
								className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ${
									isDeleted || isSuspended
										? "opacity-50 cursor-not-allowed"
										: ""
								}`}
								onClick={handleResetPassword}
								disabled={isDeleted}
							>
								Reset Password
							</button>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default UserDetails;
