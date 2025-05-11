// Import necessary modules and initialize express router
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient"); // Import supabase admin client

// GET /check-subscription/:userId
// Checks if the given userId has an active subscription.
router.get("/check-subscription/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			return res.status(400).json({
				isSubscribed: false,
				error: "Missing userId parameter",
			});
		}

		// Fetch subscription record for this userId
		const { data, error } = await supabase
			.from("subscription")
			.select("subscribed, end_date, payment_confirm")
			.eq("id", userId) // or .eq("user_id", userId) if that's your column
			.single();

		// if error, no record, not subscribed, or expired → not subscribed
		if (
			error ||
			!data ||
			!data.subscribed ||
			!data.payment_confirm ||
			new Date(data.end_date) < new Date()
		) {
			return res.json({ isSubscribed: false });
		}

		// Otherwise, active subscription
		res.json({ isSubscribed: true });
	} catch (err) {
		console.error("Error checking subscription for userId:", err);
		res.status(500).json({
			isSubscribed: false,
			error: "Internal Server Error",
		});
	}
});

// Export the router to be used in our main app
module.exports = router;
