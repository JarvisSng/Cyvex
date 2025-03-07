const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient"); // Centralized Supabase client

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

// Endpoint to suspend/unsuspend a user account by userId using ban_duration for update.
// Expects { banDuration: number } in request body (hours).
// If banDuration > 0, sets ban_duration to banDuration + "h" (e.g., "24h").
// If banDuration is 0 (or not provided), sets ban_duration to an empty string (unsuspend).
router.post("/user/:userId/suspend", async (req, res) => {
	try {
		const { userId } = req.params;
		const { banDuration } = req.body; // banDuration in hours
		let ban;
		if (banDuration && banDuration > 0) {
			ban = banDuration + "h"; // e.g., "24h"
		} else {
			ban = ""; // unsuspend by clearing ban_duration
		}
		// Update using ban_duration field
		const { data: updatedUser, error } =
			await supabase.auth.admin.updateUserById(userId, {
				ban_duration: ban,
			});
		if (error) {
			console.error("Error updating ban_duration:", error);
			return res.status(400).json({ error: error.message });
		}
		// After updating, fetch the user record to retrieve banned_until.
		const { data: userData, error: fetchError } =
			await supabase.auth.admin.getUserById(userId);
		if (fetchError) {
			console.error("Error fetching updated user data:", fetchError);
			return res.status(400).json({ error: fetchError.message });
		}
		const finalBannedUntil = userData.user.banned_until; // Field available when fetching
		console.log("Final banned_until retrieved:", finalBannedUntil);
		res.json({
			message: finalBannedUntil
				? `User suspended until ${finalBannedUntil} successfully.`
				: "User unsuspended successfully.",
			banned_until: finalBannedUntil,
		});
	} catch (err) {
		console.error("Unexpected error in suspend endpoint:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Endpoint to ban a user for 200 years (without deleting their account).
// 200 years in hours = 200 * 365 * 24 = 1,752,000 hours.
router.post("/user/:userId/ban", async (req, res) => {
	try {
		const { userId } = req.params;
		const banDurationHours = 1752000; // 200 years in hours
		const ban = banDurationHours + "h"; // e.g., "1752000h"
		const { data: updatedUser, error } =
			await supabase.auth.admin.updateUserById(userId, {
				ban_duration: ban,
			});
		if (error) {
			console.error("Error banning user:", error);
			return res.status(400).json({ error: error.message });
		}
		// Fetch the updated record to get banned_until.
		const { data: userData, error: fetchError } =
			await supabase.auth.admin.getUserById(userId);
		if (fetchError) {
			console.error("Error fetching updated user data:", fetchError);
			return res.status(400).json({ error: fetchError.message });
		}
		const finalBannedUntil = userData.user.banned_until;
		res.json({
			message: "User banned for 200 years successfully.",
			banned_until: finalBannedUntil,
		});
	} catch (err) {
		console.error("Unexpected error in ban endpoint:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Endpoint to get the remaining ban duration (in hours) for a user.
// This endpoint fetches the banned_until field and computes the difference from now.
router.get("/user/:userId/ban-duration", async (req, res) => {
	try {
		const { userId } = req.params;
		const { data: userData, error: getUserError } =
			await supabase.auth.admin.getUserById(userId);
		if (getUserError) {
			console.error("Error fetching user data:", getUserError);
			return res.status(400).json({ error: getUserError.message });
		}
		const bannedUntil = userData.user.banned_until;
		console.log("Banned until retrieved:", bannedUntil);
		if (!bannedUntil) {
			return res.json({ ban_duration: "0h" });
		}
		const now = new Date();
		const banEnd = new Date(bannedUntil);
		const diffMs = banEnd.getTime() - now.getTime();
		if (diffMs <= 0) {
			return res.json({ ban_duration: "0h" });
		}
		const diffHours = Math.floor(diffMs / (3600 * 1000));
		res.json({ ban_duration: diffHours + "h" });
	} catch (err) {
		console.error("Unexpected error in get ban-duration endpoint:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
