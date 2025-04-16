// Import the Express framework.
const express = require("express");
// Create a new router instance.
const router = express.Router();

// Import the Supabase Admin client configuration.
const supabase = require("../config/supabaseAdminClient");

// Define a GET endpoint to fetch detection rules.
router.get("/detection-rules", async (req, res) => {
	try {
		// Query the Supabase database for all records in the 'detection_rules' table.
		// Selecting specific fields: language, rule_name, and regex_pattern.
		const { data, error } = await supabase
			.from("detection_rules")
			.select("language, rule_name, regex_pattern");

		// Check if there was an error fetching the data.
		if (error) {
			console.error("Error fetching detection rules:", error);
			// Respond with a 400 status code and an error message.
			return res.status(400).json({ error: error.message });
		}

		// Process and group the fetched data by language.
		// Each language key maps to an object where each key is a rule name and its value is the regex pattern.
		const detectionRules = data.reduce((acc, rule) => {
			if (!acc[rule.language]) {
				// Initialize a new object for the language if not already created.
				acc[rule.language] = {};
			}
			// Assign the regex pattern to its corresponding rule name within the language.
			acc[rule.language][rule.rule_name] = rule.regex_pattern;
			return acc;
		}, {});

		// Return the grouped detection rules as a JSON response.
		res.json(detectionRules);
	} catch (err) {
		// Log any unexpected errors that might occur during execution.
		console.error("Unexpected error:", err);
		// Respond with a 500 status code indicating an internal server error.
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Export the router to be used in other parts of the application.
module.exports = router;
