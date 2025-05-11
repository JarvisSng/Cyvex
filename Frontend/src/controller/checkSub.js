// controller/subscriptionController.js

// Import your initialized Supabase client
import path from "../config/expressPath";
import supabase from "../config/supabaseClient";

/**
 * Fetches whether the current user has an active subscription.
 * @returns {Promise<boolean>} true if subscribed, false otherwise
 * @throws if the user is not logged in or if any network error occurs
 */
export async function checkCurrentUserSubscription() {
	try {
		// 1. Get the logged-in user
		// Supabase JS v2:
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError) {
			console.error("Auth error:", authError);
			throw new Error("Unable to get authenticated user");
		}
		if (!user) {
			throw new Error("No user is currently logged in");
		}

		// 2. Call your Express route
		const resp = await fetch(
			`${path}/api/check/check-subscription/${user.id}`
		);
		if (!resp.ok) {
			throw new Error(`Subscription API error: ${resp.status}`);
		}

		// 3. Parse and return
		const { isSubscribed } = await resp.json();
		return isSubscribed;
	} catch (err) {
		console.error("Subscription check failed:", err);
		// re-throw so callers can decide what to do (e.g. show a login prompt)
		throw err;
	}
}
