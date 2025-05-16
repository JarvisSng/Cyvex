import path from "../config/expressPath";
// src/controllers/subscriptionController.js

/**
 * Activates (or renews) a user's subscription for one month.
 * @param {string} userId  the Supabase auth/profile ID of the user
 * @returns {Promise<{ message: string, subscription?: any, error?: string }>}
 */
export async function activateSubscription(userId) {
	try {
		const resp = await fetch(`${path}/subscription/activate/${userId}`, {
			method: "POST",
			credentials: "include", // if you need cookies/auth
			headers: {
				"Content-Type": "application/json",
			},
		});

		const body = await resp.json();
		if (!resp.ok) {
			// API returned a 400/500
			return { error: body.error || "Failed to activate subscription" };
		}

		// success
		return {
			message: body.message,
			subscription: body.subscription,
		};
	} catch (err) {
		console.error("[CTRL] activateSubscription error:", err);
		return { error: err.message || "Network error" };
	}
}
