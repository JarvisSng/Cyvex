// src/controller/subscriptionController.js
import path from "../config/expressPath";

/**
 * Activate or renew a user's subscription for one month.
 * @param {string} userId
 * @returns {Promise<{ success?: true, error?: string }>}
 */
export async function activateSubscription(userId) {
	console.log(userId);
	try {
		const resp = await fetch(
			`${path}/api/subscription/activate/${userId}`,
			{
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			}
		);

		if (!resp.ok) {
			// try to read an error message
			let errMsg = "Failed to activate subscription";
			try {
				const body = await resp.json();
				errMsg = body.error || errMsg;
			} catch {}
			return { error: errMsg };
		}

		// success, no content returned
		return { success: true };
	} catch (err) {
		console.error("[CTRL] activateSubscription failed:", err);
		return { error: err.message || "Network error" };
	}
}
