// Import express and create a router instance
const express = require("express");
const router = express.Router();

// Import the centralized Supabase client with admin privileges
const supabase = require("../config/supabaseAdminClient");

// Import authentication verification middleware
const verifyAuth = require("../middleware/verifyAuth");

// Apply authentication middleware to all routes defined in this file
router.use(verifyAuth);

/*
 * POST /user/:userId/reset-password
 *
 * Resets a user's password by sending a password reset email.
 * Steps:
 * 1. Extract userId from the URL parameters.
 * 2. Fetch the user details using Supabase admin method.
 * 3. Retrieve the user's email.
 * 4. Trigger the password reset email with a redirection URL specified in environment variables or default.
 */
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
			redirectTo: "https://cyvex.onrender.com/reset-password",
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

/*
 * POST /user/:userId/suspend
 *
 * Suspends or unsuspends a user based on the provided banDuration in the request body.
 * Steps:
 * 1. Extract userId from URL and banDuration from request body.
 * 2. If banDuration is provided and is greater than zero:
 *     - Set status as "Suspended".
 *     - Calculate banned_until timestamp by adding banDuration hours to current time.
 * 3. Otherwise, set the user's status to "Active" and banned_until to null.
 * 4. Update the user's profile in the "profiles" table.
 * 5. Return the updated status and banned_until values.
 */
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

		// Update the profiles table with the new status and banned_until timestamp
		const { data, error } = await supabase
			.from("profiles")
			.update({ status, banned_until: bannedUntil })
			.eq("id", userId);
		if (error) {
			console.error("Error updating profile:", error);
			return res.status(400).json({ error: error.message });
		}

		// Fetch the updated profile to confirm the changes
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

/*
 * POST /user/:userId/delete
 *
 * Bans (deletes) a user by modifying their status to "Deleted".
 * Instead of permanently deleting the account, it marks the user as deleted.
 * Steps:
 * 1. Extract userId from URL parameters.
 * 2. Set the user's status to "Deleted" and banned_until to null.
 * 3. Update the user's profile in the "profiles" table.
 * 4. Return the updated status to confirm the deletion.
 */
router.post("/user/:userId/delete", async (req, res) => {
	try {
		const { userId } = req.params;
		// For permanent ban, update the status to "Deleted" and clear banned_until.
		const status = "Deleted";
		const bannedUntil = null;

		// Update the profiles table with new status "Deleted"
		const { data, error } = await supabase
			.from("profiles")
			.update({ status, banned_until: bannedUntil })
			.eq("id", userId);
		if (error) {
			console.error("Error banning user:", error);
			return res.status(400).json({ error: error.message });
		}

		// Fetch the updated profile to verify the changes
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

// Export the router to be used in other parts of the app
module.exports = router;
