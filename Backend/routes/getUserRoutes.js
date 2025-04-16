// Import the Express framework.
const express = require("express");
// Create a new router instance.
const router = express.Router();

// Import the Supabase Admin client configuration.
const supabase = require("../config/supabaseAdminClient");

/*
  GET /user-profiles
  Fetch user profiles using a query parameter for the username.
  Also retrieves associated authentication data for each profile.
*/
router.get("/user-profiles", async (req, res) => {
	try {
		const { username } = req.query;
		// Fetch user profiles from the "profiles" table matching the username and role.
		const { data: userdata, error: uerror } = await supabase
			.from("profiles")
			.select("*")
			.eq("username", username)
			.eq("role", "user");

		if (uerror) {
			console.error("Error fetching user profiles:", uerror);
			return res.status(400).json({ error: uerror.message });
		}

		// For each profile, attach additional authentication information (e.g., email)
		const profilesWithAuth = await Promise.all(
			userdata.map(async (profile) => {
				const { data: userData, error: getUserError } =
					await supabase.auth.admin.getUserById(profile.id);
				if (getUserError) {
					console.error(
						"Error fetching authentication data for user",
						profile.id,
						getUserError
					);
					return profile;
				}
				// Attach the authentication data to the profile for further use
				profile.authData = userData.user; // Example: profile.authData.email
				return profile;
			})
		);

		res.json({ data: profilesWithAuth });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
