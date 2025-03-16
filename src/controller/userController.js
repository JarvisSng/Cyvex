// src/controller/userController.js
// This file contains functions for communicating with the backend API related to user operations
// including fetching user profiles, updating subscriptions, admin profile operations, and user management.

import { fetchWithAuth } from "./authHelper";

// 1. Get all user profiles with subscription details (for role "user")
export const getUserProfilesWithSubscriptions = async () => {
	try {
		// Send request to get profiles
		const response = await fetchWithAuth(
			"http://localhost:3000/api/user/profiles"
		);
		if (!response.ok) {
			// If response is not ok, parse error message and throw error
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch profiles");
		}
		// Return the fetched JSON data
		return await response.json();
	} catch (error) {
		// Return an error object with the error message
		return { error: error.message };
	}
};

// 2. Get a single user profile with subscription details by userId
export const getUserProfile = async (userId) => {
	try {
		// Send request to get a specific user profile using the provided userId
		const response = await fetchWithAuth(
			`http://localhost:3000/api/user/profile/${userId}`
		);
		if (!response.ok) {
			// If response is not ok, parse error message and throw error
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch user profile");
		}
		// Return the fetched JSON data
		return await response.json();
	} catch (error) {
		// Return an error object with the error message
		return { error: error.message };
	}
};

// 3. Update subscription details for a user
export const updateSubscription = async (userId, subscription) => {
	try {
		// Send a POST request to update the subscription details for a specific user
		const response = await fetchWithAuth(
			`http://localhost:3000/api/user/profile/${userId}/subscription`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(subscription),
			}
		);
		if (!response.ok) {
			// If response is not ok, parse error message and throw error
			const result = await response.json();
			throw new Error(result.error || "Failed to update subscription");
		}
		// Return the updated JSON data
		return await response.json();
	} catch (error) {
		// Return an error object with the error message
		return { error: error.message };
	}
};

// 4. Fetch admin profiles based on username search criteria
export const fetchAdminProfiles = async (username) => {
	try {
		// Send request to get admin profiles that match the given username
		const response = await fetchWithAuth(
			`http://localhost:3000/api/user/admin-profiles?username=${username}`
		);
		if (!response.ok) {
			// If response is not ok, parse error message and throw error
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch admin profiles");
		}

		// Parse the JSON response and return it
		const resultData = await response.json();
		return resultData;
	} catch (error) {
		// Return an error object with the error message
		return { error: error.message };
	}
};

// 5. Update admin profile status (updateData)
export const updateData = async (id, username, status) => {
	try {
		// Send a POST request to update the status of an admin profile
		const response = await fetchWithAuth(
			`http://localhost:3000/api/user/${id}/status`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, status }),
			}
		);
		if (!response.ok) {
			// If response is not ok, parse error message and throw error
			const result = await response.json();
			throw new Error(result.error || "Failed to update admin profile");
		}
		// Return the updated JSON data
		return await response.json();
	} catch (error) {
		// Return an error object with the error message
		return { error: error.message };
	}
};

// 6. Reset a user's password
export const resetUserPassword = async (userId) => {
	try {
		// Send a POST request to initiate password reset for the specified user
		const response = await fetchWithAuth(
			`http://localhost:3000/api/admin/user/${userId}/reset-password`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			// If response is not ok, parse error message and throw error
			const result = await response.json();
			throw new Error(result.error || "Failed to reset password");
		}
		// Return the response JSON data
		return await response.json();
	} catch (error) {
		// Return an error object with the error message
		return { error: error.message };
	}
};

// 7. Suspend (or unsuspend) a user
export const suspendUser = async (userId, banDuration) => {
	try {
		// Send a POST request to suspend a user or update the ban duration
		const response = await fetchWithAuth(
			`http://localhost:3000/api/admin/user/${userId}/suspend`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ banDuration }),
			}
		);
		if (!response.ok) {
			// If response is not ok, parse error message and throw error
			const result = await response.json();
			throw new Error(result.error || "Failed to suspend user");
		}
		// Return the response JSON data
		return await response.json();
	} catch (error) {
		// Return an error object with the error message
		return { error: error.message };
	}
};

// 8. Delete (ban) a user (set status to "Deleted")
export const deleteUser = async (userId) => {
	try {
		// Send a POST request to delete (ban) a user by setting the user's status to "Deleted"
		const response = await fetchWithAuth(
			`http://localhost:3000/api/admin/user/${userId}/delete`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			// If response fails, parse the error message and throw error
			const result = await response.json();
			throw new Error(result.error || "Failed to delete user");
		}
		// Return the response JSON data
		return await response.json();
	} catch (error) {
		// Return an error object with the error message
		return { error: error.message };
	}
};
