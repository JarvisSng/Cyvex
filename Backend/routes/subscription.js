// routes/subscription.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient");

router.post("/activate/:userId", async (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		return res.status(400).json({ error: "Missing userId parameter" });
	}

	// compute today's and one-month-later dates
	const today = new Date();
	const startDate = today.toISOString().split("T")[0];
	const oneMonthOut = new Date(today);
	oneMonthOut.setMonth(oneMonthOut.getMonth() + 1);
	const endDate = oneMonthOut.toISOString().split("T")[0];

	try {
		// upsert so it'll insert if missing or update if present
		const { error } = await supabase.from("subscription").upsert(
			{
				id: userId,
				start_date: startDate,
				end_date: endDate,
				subscribed: true,
				payment_confirm: true,
			},
			{ onConflict: "id" }
		);

		if (error) {
			console.error("[API] activate subscription error:", error);
			return res.status(400).json({ error: error.message });
		}

		// 204 No Content on success
		return res.sendStatus(204);
	} catch (err) {
		console.error("[API] unexpected error activating subscription:", err);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
