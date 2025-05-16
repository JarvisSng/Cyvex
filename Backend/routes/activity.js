const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient");

/**
 * POST /api/activity/login
 *
 * Increments today's login count:
 *  - If a row for today exists, increments its `logins`.
 *  - Otherwise inserts a new row with `date = today` and `logins = 1`.
 * Returns 204 No Content on success.
 */
router.post("/login", async (req, res) => {
	try {
		// Compute today's date as YYYY-MM-DD
		const today = new Date().toISOString().split("T")[0];

		// Try to fetch the existing activity row for today
		const { data: existing, error: fetchError } = await supabase
			.from("activity")
			.select("id, logins")
			.eq("date", today)
			.single();

		// If there was an error *other than* “no rows found”, bail out
		if (fetchError && fetchError.code !== "PGRST116") {
			console.error("[API] Error fetching today's row:", fetchError);
			return res.status(500).json({ error: fetchError.message });
		}

		if (existing) {
			// Row exists → increment
			await supabase
				.from("activity")
				.update({ logins: existing.logins + 1 })
				.eq("id", existing.id);
		} else {
			// No row yet for today → insert new
			await supabase.from("activity").insert({ date: today, logins: 1 });
		}

		return res.sendStatus(204);
	} catch (err) {
		console.error(
			"[API] Unexpected error in POST /api/activity/login:",
			err
		);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

// GET /api/activity
// Returns every row in the activity table, ordered by date ascending.
router.get("/getAll", async (req, res) => {
	console.log("[API] GET /api/activity called");
	try {
		const { data, error } = await supabase
			.from("activity")
			.select("*")
			.order("date", { ascending: true });

		if (error) {
			console.error("[API] Error fetching activity data:", error);
			return res.status(500).json({ error: error.message });
		}

		console.log("[API] Fetched activity rows:", data.length);
		res.json(data);
	} catch (err) {
		console.error("[API] Unexpected error in GET /api/activity:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * GET /api/activity/online
 *
 * Returns the count of profiles where logged_in = true.
 */
router.get("/online", async (req, res) => {
	try {
		// Use head:true to fetch only the count, not the rows themselves
		const { count, error: countError } = await supabase
			.from("profiles")
			.select("id", { count: "exact", head: true })
			.eq("logged_in", true);

		if (countError) {
			console.error("[API] Error counting online users:", countError);
			return res.status(500).json({ error: countError.message });
		}

		res.json({ onlineCount: count });
	} catch (err) {
		console.error(
			"[API] Unexpected error in GET /api/activity/online:",
			err
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
