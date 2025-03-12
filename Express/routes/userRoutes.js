// routes/supabaseAPI.js
const express = require("express");
const router = express.Router();
const supabase = require("../../src/config/supabaseAdminClient"); // or supabaseAdminClient if you need admin access

// GET all user profiles with subscription details (for role "user")
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

// GET a single user profile with subscription details by userId
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

// POST update subscription details for a user
router.post("/profile/:userId/subscription", async (req, res) => {
	try {
		const { userId } = req.params;
		const subscription = req.body; // expected: { start_date, end_date, subscribed, payment_confirm }
		const { data, error } = await supabase
			.from("subscription")
			.update({
				start_date: subscription.start_date,
				end_date: subscription.end_date,
				subscribed: subscription.subscribed,
				payment_confirm: subscription.payment_confirm,
			})
			.eq("id", userId)
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

// GET admin profiles by username (via query parameter)
router.get("/admin-profiles", async (req, res) => {
	try {
		const { username } = req.query;
		// First, fetch the admin profiles from the "profiles" table.
		const { data: userdata, error: uerror } = await supabase
			.from("profiles")
			.select("*")
			.eq("username", username)
			.eq("role", "admin");

		if (uerror) {
			console.error("Error fetching admin profiles:", uerror);
			return res.status(400).json({ error: uerror.message });
		}

		// For each profile, fetch additional auth information (e.g., email) from the auth table.
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
					// Optionally, you can choose to continue even if one fetch fails:
					return profile;
				}
				// Attach the auth data to the profile (e.g., email, phone, etc.)
				profile.authData = userData.user; // now you can access profile.authData.email, etc.
				return profile;
			})
		);

		res.json({ data: profilesWithAuth });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// POST update admin profile status (updateData)
router.post("/:id/status", async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
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

module.exports = router;
