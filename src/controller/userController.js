// src/controller/userController.js

// 1. Get all user profiles with subscription details (for role "user")
export const getUserProfilesWithSubscriptions = async () => {
	try {
		const response = await fetch("http://localhost:3000/api/user/profiles");
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch profiles");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

// 2. Get a single user profile with subscription details by userId
export const getUserProfile = async (userId) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/user/profile/${userId}`
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch user profile");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

// 3. Update subscription details for a user
export const updateSubscription = async (userId, subscription) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/user/profile/${userId}/subscription`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(subscription),
			}
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to update subscription");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

// 4. Fetch admin profiles by username (via query parameter)
export const fetchAdminProfiles = async (username) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/user/admin-profiles?username=${username}`
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch admin profiles");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

// 5. Update admin profile status (updateData)
export const updateData = async (id, username, status) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/user/${id}/status`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, status }),
			}
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to update admin profile");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

// 6. Reset a user's password
export const resetUserPassword = async (userId) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/admin/user/${userId}/reset-password`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to reset password");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

// 7. Suspend (or unsuspend) a user
export const suspendUser = async (userId, banDuration) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/admin/user/${userId}/suspend`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ banDuration }),
			}
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to suspend user");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

// 8. Delete (ban) a user (set status to "Deleted")
export const deleteUser = async (userId) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/admin/user/${userId}/delete`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to delete user");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};
