// routes/subscription.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient");

/**
 * POST /api/subscription/activate/:userId
 *
 * Activates (or extends) a user's subscription:
 *  - Sets `start_date` = today
 *  - Sets `end_date`   = one month from today
 *  - Sets `subscribed` = true
 *  - Sets `payment_confirm` = true
 */
router.post("/activate/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			return res.status(400).json({ error: "Missing userId parameter" });
		}

		// 1) compute dates
		const today = new Date();
		const startDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
		const oneMonthLater = new Date(today);
		oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
		const endDate = oneMonthLater.toISOString().split("T")[0];

		// 2) update the subscription row
		const { data, error } = await supabase
			.from("subscription")
			.update({
				start_date: startDate,
				end_date: endDate,
				subscribed: true,
				payment_confirm: true,
			})
			.eq("id", userId);

		if (error) {
			console.error("Error activating subscription:", error);
			return res.status(400).json({ error: error.message });
		}

		return res.json({
			message: "Subscription activated",
			subscription: data[0], // the updated row
		});
	} catch (err) {
		console.error("Unexpected error in subscription activate:", err);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
