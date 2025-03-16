// routes/supabaseAPI.js

// Import necessary modules and initialize express router
const express = require("express");
const router = express.Router();
const supabase = require("../../src/config/supabaseAdminClient"); // Import supabase admin client
const verifyAuth = require("../middleware/verifyAuth"); // Middleware to verify authentication

// Use the authentication middleware for all routes in this file
router.use(verifyAuth);

/*
	GET /profiles
	Retrieves all user profiles with their subscription details.
	Only profiles with the role "user" are fetched.
*/
router.get("/profiles", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("profiles")
			.select("*, subscription(*)")
			.eq("role", "user");

		if (error) {
			console.error("Error fetching profiles:", error);
			return res.status(400).json({ error: error.message });
		}

		res.json({ data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/*
	GET /check-subscription
	Checks if the logged-in user has an active subscription.
*/
router.get("/check-subscription", async (req, res) => {
	try {
		const userId = req.user?.id; // Ensure req.user exists from authentication middleware

		if (!userId) {
			return res.status(401).json({ isSubscribed: false, error: "Unauthorized. Please log in." });
		}

		// Fetch user's subscription status
		const { data, error } = await supabase
			.from("subscription")
			.select("subscribed, end_date")
			.eq("id", userId)
			.single();

		// If there's an error, user is not subscribed, or subscription expired
		if (error || !data || !data.subscribed || new Date(data.end_date) < new Date()) {
			return res.json({ isSubscribed: false });
		}

		res.json({ isSubscribed: true }); // User has an active subscription
	} catch (err) {
		console.error("Error checking subscription:", err);
		res.status(500).json({ isSubscribed: false, error: "Internal Server Error" });
	}
});

/*
	GET /profile/:userId
	Retrieves a single user profile along with subscription details using the userId.
*/
router.get("/profile/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const { data, error } = await supabase
			.from("profiles")
			.select("*, subscription(*)")
			.eq("id", userId)
			.single();

		if (error) {
			console.error("Error fetching user profile:", error);
			return res.status(400).json({ error: error.message });
		}

		res.json({ data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/*
	POST /profile/:userId/subscription
	Updates the subscription details for a specific user.
	Expected request body: { start_date, end_date, subscribed, payment_confirm }
*/
router.post("/profile/:userId/subscription", async (req, res) => {
	try {
		const { userId } = req.params;
		const subscription = req.body; // Get subscription fields from request body

		const { data, error } = await supabase
			.from("subscription")
			.update({
				start_date: subscription.start_date,
				end_date: subscription.end_date,
				subscribed: subscription.subscribed,
				payment_confirm: subscription.payment_confirm,
			})
			.eq("id", userId) // Update based on user id
			.select();

		if (error) {
			console.error("Error updating subscription:", error);
			return res.status(400).json({ error: error.message });
		}

		res.json({ message: "Subscription updated successfully." });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/*
	GET /admin-profiles
	Fetch admin profiles using a query parameter for the username.
	Additionally, retrieves associated auth data for each profile.
*/
router.get("/admin-profiles", async (req, res) => {
	try {
		const { username } = req.query;
		// Fetch admin profiles from the "profiles" table
		const { data: userdata, error: uerror } = await supabase
			.from("profiles")
			.select("*")
			.eq("username", username)
			.eq("role", "admin");

		if (uerror) {
			console.error("Error fetching admin profiles:", uerror);
			return res.status(400).json({ error: uerror.message });
		}

		// For each profile, attach additional auth information (e.g., email)
		const profilesWithAuth = await Promise.all(
			userdata.map(async (profile) => {
				const { data: userData, error: getUserError } =
					await supabase.auth.admin.getUserById(profile.id);
				if (getUserError) {
					console.error(
						"Error fetching auth data for user",
						profile.id,
						getUserError
					);
					return profile;
				}
				// Attach the auth data to the profile for further use
				profile.authData = userData.user; // e.g., profile.authData.email
				return profile;
			})
		);

		res.json({ data: profilesWithAuth });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/*
	POST /:id/status
	Updates the status of an admin profile.
	Expected request body: { status }
*/
router.post("/:id/status", async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body; // Extract new status from request body

		const { data, error } = await supabase
			.from("profiles")
			.update({ status })
			.eq("id", id)
			.select();

		if (error) {
			console.error("Error updating admin status:", error);
			return res.status(400).json({ error: error.message });
		}

		res.json({ data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Export the router to be used in other parts of the application
module.exports = router;
