import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserProfile, updateUserSubscription } from "../api/supabaseAPI";

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
	const [banEndTime, setBanEndTime] = useState(null); // banned_until as ISO string
	const [suspendInput, setSuspendInput] = useState(""); // input for ban duration in hours
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// 100 years in hours ~ 876000 hours
	const hundredYearsHours = 876000;

	useEffect(() => {
		const loadUserProfile = async () => {
			const result = await fetchUserProfile(userId);
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

		const loadBanEndTime = async () => {
			// Call the Express API to fetch the user's ban end time (via ban-duration endpoint)
			const response = await fetch(
				`http://localhost:3000/api/admin/user/${userId}/ban-duration`
			);
			const result = await response.json();
			if (!response.ok) {
				console.error("Error fetching ban duration:", result.error);
			} else {
				// result.ban_duration is in format "Xh"
				const banDurationStr = result.ban_duration;
				setBanEndTime(banDurationStr);
			}
		};

		loadUserProfile();
		loadBanEndTime();
	}, [userId]);

	const handleSubscriptionChange = (e) => {
		const { name, value, type, checked } = e.target;
		setSubscription((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleUpdateSubscription = async () => {
		// Do not allow subscription updates if user is suspended.
		if (isSuspended) {
			alert("Cannot update subscription while user is suspended.");
			return;
		}
		const result = await updateUserSubscription(userId, subscription);
		if (result.error) {
			alert("Error: " + result.error);
		} else {
			alert(result.message);
		}
	};

	// Determine suspension state: if banned_until is set and in the future.
	const now = new Date();
	const banEndDate = banEndTime ? new Date(banEndTime) : null;
	const isSuspended = banEndDate && banEndDate > now;
	// User is considered "deleted" if banned for 200 years; 200 years in hours = 1752000 hours.
	const isDeleted =
		banEndDate &&
		banEndDate.getTime() - now.getTime() >= 1752000 * 3600 * 1000;

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
		const response = await fetch(
			`http://localhost:3000/api/admin/user/${userId}/suspend`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ banDuration: hours }),
			}
		);
		const result = await response.json();
		if (!response.ok) {
			alert("Error: " + result.error);
		} else {
			alert(result.message);
			// Reload the ban end time
			const res = await fetch(
				`http://localhost:3000/api/admin/user/${userId}/ban-duration`
			);
			const data = await res.json();
			if (res.ok) {
				setBanEndTime(data.ban_duration);
			}
			setProfile((prev) => ({ ...prev, suspended: hours > 0 }));
			setSuspendInput("");
		}
	};

	const handleDeleteUser = async () => {
		if (
			window.confirm(
				"Are you sure you want to ban this user for 200 years? (This will effectively disable the account)"
			)
		) {
			const response = await fetch(
				`http://localhost:3000/api/admin/user/${userId}/ban`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const result = await response.json();
			if (!response.ok) {
				alert("Error: " + result.error);
			} else {
				alert(result.message);
				// Update local state to indicate the user is banned for 200 years.
				setBanEndTime(result.ban_end_time);
				setProfile((prev) => ({ ...prev, suspended: true }));
			}
		}
	};

	const handleResetPassword = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/user/${profile.id}/reset-password`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const result = await response.json();
			if (!response.ok) {
				alert("Error: " + result.error);
			} else {
				alert(result.message);
			}
		} catch (error) {
			alert("Error: " + error.message);
		}
	};

	if (loading) return <div className="p-4 text-center">Loading...</div>;
	if (error)
		return (
			<div className="p-4 text-center text-red-600">Error: {error}</div>
		);
	if (!profile)
		return <div className="p-4 text-center">No user data found.</div>;

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
			<h1 className="text-3xl text-gray-600 font-bold mb-6">
				{profile.username}
			</h1>

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
						className="text-gray-400 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
					/>
				</div>
				<div className="mb-4 flex items-center">
					<label className="text-gray-700 mr-2">Subscribed:</label>
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
					{/* Show the input for ban duration (hours) only if not suspended and not deleted */}
					{!isSuspended && !isDeleted && (
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
							className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
							onClick={handleSuspendUser}
							disabled={isDeleted}
						>
							{isSuspended ? "Unsuspend User" : "Suspend User"}
						</button>
						<button
							className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
							onClick={handleDeleteUser}
							disabled={isDeleted}
						>
							{isDeleted
								? "User is Banned for 200 Years"
								: "Delete User (Ban for 200 Years)"}
						</button>
						<button
							className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
							onClick={handleResetPassword}
							disabled={isDeleted}
						>
							Reset Password
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default UserDetails;
