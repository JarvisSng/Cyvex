const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient");

router.post("/login", async (req, res) => {
	console.log("[API] POST /api/activity/login called");
	try {
		// 1. Get latest row
		console.log("[API] fetching latest activity row…");
		const { data: lastRow, error: fetchError } = await supabase
			.from("activity")
			.select("id, date, logins")
			.order("date", { ascending: false })
			.limit(1)
			.maybeSingle();

		if (fetchError) {
			console.error(
				"[API] Error fetching last activity row:",
				fetchError
			);
			return res.status(500).json({ error: fetchError.message });
		}
		console.log("[API] lastRow fetched:", lastRow);

		// 2. Today’s date
		const today = new Date().toISOString().split("T")[0];
		console.log("[API] today =", today);

		// 3. Decide update vs insert
		if (lastRow && lastRow.date === today) {
			const newCount = lastRow.logins + 1;
			console.log(
				`[API] updating row id=${lastRow.id} (was ${lastRow.logins}) → ${newCount}`
			);
			const { error: updateError } = await supabase
				.from("activity")
				.update({ logins: newCount })
				.eq("id", lastRow.id);

			if (updateError) {
				console.error("[API] Error updating login count:", updateError);
				return res.status(500).json({ error: updateError.message });
			}
		} else {
			console.log("[API] inserting new row for today");
			const { error: insertError } = await supabase
				.from("activity")
				.insert({ date: today, logins: 1 });

			if (insertError) {
				console.error(
					"[API] Error inserting new activity row:",
					insertError
				);
				return res.status(500).json({ error: insertError.message });
			}
		}

		console.log("[API] increment complete, sending 204");
		res.sendStatus(204);
	} catch (err) {
		console.error("[API] Unexpected error in /api/activity/login:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
