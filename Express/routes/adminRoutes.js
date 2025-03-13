const express = require("express");
const router = express.Router();
const supabase = require("../../src/config/supabaseAdminClient"); // Centralized Supabase client
const verifyAuth = require("../middleware/verifyAuth");

router.use(verifyAuth);

// Endpoint to reset a user's password using their userId (unchanged)
router.post("/user/:userId/reset-password", async (req, res) => {
	try {
		const { userId } = req.params;
		console.log("Reset password request received for user:", userId);

		const { data: userData, error: getUserError } =
			await supabase.auth.admin.getUserById(userId);
		if (getUserError) {
			console.error("Error fetching user data:", getUserError);
			return res.status(400).json({ error: getUserError.message });
		}
		const email = userData.user.email;
		console.log("User email retrieved:", email);

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo:
				process.env.PASSWORD_RESET_REDIRECT ||
				"http://localhost:3000/reset-password",
		});
		if (error) {
			console.error("Error resetting password:", error);
			return res.status(400).json({ error: error.message });
		}
		console.log("Password reset email sent successfully.");
		res.json({ message: "Password reset email sent successfully." });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/user/:userId/suspend", async (req, res) => {
	try {
		const { userId } = req.params;
		const { banDuration } = req.body; // banDuration in hours
		let status, bannedUntil;
		if (banDuration && banDuration > 0) {
			// Suspend the user: status becomes "Suspended" and calculate banned_until
			status = "Suspended";
			const now = new Date();
			const future = new Date(now.getTime() + banDuration * 3600 * 1000);
			bannedUntil = future.toISOString();
		} else {
			// Unsuspend the user: status becomes "Active" and banned_until is set to null
			status = "Active";
			bannedUntil = null;
		}
		// Update the profiles table with new status and banned_until
		const { data, error } = await supabase
			.from("profiles")
			.update({ status, banned_until: bannedUntil })
			.eq("id", userId);
		if (error) {
			console.error("Error updating profile:", error);
			return res.status(400).json({ error: error.message });
		}
		// Fetch the updated profile to verify changes
		const { data: updatedProfile, error: fetchError } = await supabase
			.from("profiles")
			.select("status, banned_until")
			.eq("id", userId)
			.single();
		if (fetchError) {
			console.error("Error fetching updated profile:", fetchError);
			return res.status(400).json({ error: fetchError.message });
		}
		res.json({
			message:
				updatedProfile.status === "Active"
					? "User unsuspended successfully."
					: `User suspended until ${updatedProfile.banned_until} successfully.`,
			status: updatedProfile.status,
			banned_until: updatedProfile.banned_until,
		});
	} catch (err) {
		console.error("Unexpected error in suspend endpoint:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Endpoint to ban a user for 200 years (without deleting their account).
// 200 years in hours = 200 * 365 * 24 = 1,752,000 hours.
// Sets status to "Banned" and banned_until accordingly.
router.post("/user/:userId/delete", async (req, res) => {
	try {
		const { userId } = req.params;
		// For permanent ban, update the status to "Deleted" and clear banned_until.
		const status = "Deleted";
		const bannedUntil = null;
		// Update the profiles table with status "Deleted" and banned_until as null
		const { data, error } = await supabase
			.from("profiles")
			.update({ status, banned_until: bannedUntil })
			.eq("id", userId);
		if (error) {
			console.error("Error banning user:", error);
			return res.status(400).json({ error: error.message });
		}
		// Fetch the updated profile to verify changes
		const { data: updatedProfile, error: fetchError } = await supabase
			.from("profiles")
			.select("status, banned_until")
			.eq("id", userId)
			.single();
		if (fetchError) {
			console.error("Error fetching updated profile:", fetchError);
			return res.status(400).json({ error: fetchError.message });
		}
		res.json({
			message: "User deleted successfully.",
			status: updatedProfile.status,
			banned_until: updatedProfile.banned_until,
		});
	} catch (err) {
		console.error("Unexpected error in ban endpoint:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
