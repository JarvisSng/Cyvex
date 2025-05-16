// routes/subscription.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient");

router.post("/activate/:userId", async (req, res) => {
	const { userId } = req.params;
	console.log("[API] activate subscription called for user:", userId);

	if (!userId) {
		console.warn("[API] Missing userId");
		return res.status(400).json({ error: "Missing userId parameter" });
	}

	try {
		// 1) compute dates
		const today = new Date();
		const startDate = today.toISOString().split("T")[0];
		const oneMonthLater = new Date(today);
		oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
		const endDate = oneMonthLater.toISOString().split("T")[0];

		console.log(
			"[API] setting start_date =",
			startDate,
			"end_date =",
			endDate
		);

		// 2) update the subscription row
		const { data, error, status, statusText } = await supabase
			.from("subscription")
			.update({
				start_date: startDate,
				end_date: endDate,
				subscribed: true,
				payment_confirm: true,
			})
			.eq("id", userId);

		if (error) {
			console.error(
				"[API] Supabase update error:",
				error,
				"status:",
				status,
				statusText
			);
			// return the Supabase error message and code
			return res
				.status(status || 500)
				.json({ error: error.message, code: error.code });
		}

		console.log("[API] Supabase update succeeded, data:", data);
		return res.json({
			message: "Subscription activated",
			subscription: data[0],
		});
	} catch (err) {
		console.error("[API] Unexpected exception:", err);
		// Send back the exception message so you can debug
		return res.status(500).json({ error: err.message });
	}
});

module.exports = router;
