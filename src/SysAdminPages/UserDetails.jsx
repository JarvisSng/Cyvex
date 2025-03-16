// src/components/UserDetails.jsx
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

	// Load user profile on mount
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

	const handleBack = () => {
		navigate(-1);
	};

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				Loading...
			</div>
		);
	if (error)
		return (
			<div className="flex items-center justify-center min-h-screen text-red-600">
				Error: {error}
			</div>
		);
	if (!profile)
		return (
			<div className="flex items-center justify-center min-h-screen">
				No user data found.
			</div>
		);

	return (
		<div className="min-h-screen w-screen bg-gray-50 flex flex-col">
			<div className="w-full mx-auto p-8 bg-white shadow-lg rounded-lg flex-grow overflow-y-auto">
				<div className="flex justify-between items-center mb-8">
					<span></span>
					<h1 className="text-4xl text-gray-800 font-bold">
						User : {profile.username}
					</h1>
					<button
						onClick={handleBack}
						className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
					>
						Back
					</button>
				</div>
				<div className="h-10">
					{isSuspended && (
						<p className="text-red-700 text-center text-2xl pt-6">
							The account is suspended{" "}
							{banEndDate ? `until ${formattedDate}` : ""}
						</p>
					)}
					{isDeleted && (
						<p className="text-red-700 text-center text-2xl pt-6">
							This account is deleted and no longer active.
						</p>
					)}
				</div>
				<div className=" pt-6 mt-6 flex items-center justify-center gap-4 w-screen h-80 ">
					{/* Manage Subscription Section */}
					<section className="w-2xl h-full border-[1px] border-gray-300 mb-8 bg-white p-6 rounded shadow-lg">
						<h2 className="text-3xl font-semibold mb-4 text-gray-800">
							Manage Subscription
						</h2>
						<div className="flex flex-wrap gap-4">
							<div className="mb-4">
								<label className="block text-gray-700 mb-1">
									Start Date:
								</label>
								<input
									type="date"
									name="start_date"
									value={
										subscription.start_date
											? subscription.start_date.split(
													"T"
											  )[0]
											: ""
									}
									onChange={handleSubscriptionChange}
									disabled={isSuspended || isDeleted}
									className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none text-gray-700 focus:ring focus:border-blue-500"
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
											? subscription.end_date.split(
													"T"
											  )[0]
											: ""
									}
									onChange={handleSubscriptionChange}
									disabled={isSuspended || isDeleted}
									className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none text-gray-700 focus:ring focus:border-blue-500"
								/>
							</div>
						</div>
						<div className="flex flex-wrap gap-4">
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
						</div>
						<button
							className={`!bg-blue-500 hover:!bg-blue-600 text-white px-6 py-3 rounded ${
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
					<section className="w-2xl h-full border-[1px] border-gray-300 mb-8 bg-white p-6 rounded shadow-lg">
						<h2 className="text-3xl font-semibold mb-4 text-gray-800">
							Account Management
						</h2>
						{profile.status === "Active" && (
							<div className="mb-4 max-w-xs">
								<label className="block text-gray-700 mb-1">
									Ban Duration (hours):
								</label>
								<input
									type="number"
									min="1"
									value={suspendInput}
									onChange={(e) =>
										setSuspendInput(e.target.value)
									}
									className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
								/>
							</div>
						)}
						<div className="flex flex-wrap gap-4">
							<button
								className={`!bg-yellow-500 hover:!bg-yellow-600 text-white px-6 py-3 rounded ${
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
								className={`!bg-red-500 hover:!bg-red-600 text-white px-6 py-3 rounded ${
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
								className={`!bg-green-500 hover:!bg-green-600 text-white px-6 py-3 rounded ${
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
					</section>
				</div>
				<p className="text-red-400 text-center text-2xl pt-6">
					Note : You will need to contact the database admin to
					recover an account after it is deleted
				</p>
			</div>
		</div>
	);
};

export default UserDetails;
