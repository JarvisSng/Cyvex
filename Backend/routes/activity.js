const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient");

/**
 * POST /api/activity/login
 *
 * Increments today's login count.
 * – If today's row exists, bump its `logins` by 1.
 * – Otherwise insert a new row { date: today, logins: 1 }.
 * Returns 204 No Content on success.
 */
router.post("/loginCount", async (req, res) => {
	try {
		// 1. Get latest row
		const { data: lastRow, error: fetchError } = await supabase
			.from("activity")
			.select("id, date, logins")
			.order("date", { ascending: false })
			.limit(1)
			.maybeSingle();
		if (fetchError) {
			console.error("Error fetching last activity row:", fetchError);
			return res.status(500).json({ error: fetchError.message });
		}

		// 2. Today’s YYYY-MM-DD
		const today = new Date().toISOString().split("T")[0];

		// 3. Update or insert
		if (lastRow && lastRow.date === today) {
			await supabase
				.from("activity")
				.update({ logins: lastRow.logins + 1 })
				.eq("id", lastRow.id);
		} else {
			await supabase.from("activity").insert({ date: today, logins: 1 });
		}

		// 4. No response body needed
		res.sendStatus(204);
	} catch (err) {
		console.error("Unexpected error in /api/activity/login:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
