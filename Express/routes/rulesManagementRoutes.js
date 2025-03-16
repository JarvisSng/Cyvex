// Import express and create a router for our detection rules endpoints
const express = require("express");
const router = express.Router();

// Import supabase client for database operations and middleware for authentication
const supabase = require("../../src/config/supabaseAdminClient");
const verifyAuth = require("../middleware/verifyAuth");

// Apply authentication middleware to all routes
router.use(verifyAuth);

/**
 * GET /
 * Retrieve all detection rules, grouped by language.
 * Fetches detection rules from the database and groups them in an object where
 * each key represents a language and its value is an array of rule objects.
 */
router.get("/", async (req, res) => {
	try {
		// Fetch detection rules from the database
		const { data, error } = await supabase
			.from("detection_rules")
			.select("id, language, rule_name, regex_pattern");
		if (error) {
			console.error("Error fetching detection rules:", error);
			return res.status(400).json({ error: error.message });
		}
		// Group rules by language
		const detectionRules = data.reduce((acc, rule) => {
			if (!acc[rule.language]) {
				acc[rule.language] = [];
			}
			acc[rule.language].push(rule);
			return acc;
		}, {});
		// Send the grouped detection rules as a JSON response
		res.json({ data: detectionRules });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * GET /:id
 * Retrieve a single detection rule by id.
 * Fetches the detection rule matching the provided id from the database.
 */
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		// Fetch the specific detection rule by id
		const { data, error } = await supabase
			.from("detection_rules")
			.select("*")
			.eq("id", id)
			.single();
		if (error) {
			console.error("Error fetching detection rule:", error);
			return res.status(400).json({ error: error.message });
		}
		// Send the fetched detection rule as a JSON response
		res.json({ data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * POST /
 * Create a new detection rule.
 * Inserts a new rule into the database using provided language, rule_name, and regex_pattern.
 */
router.post("/", async (req, res) => {
	try {
		const { language, rule_name, regex_pattern } = req.body;
		// Insert a new detection rule into the database
		const { data, error } = await supabase
			.from("detection_rules")
			.insert([{ language, rule_name, regex_pattern }])
			.select();
		if (error) {
			console.error("Error creating detection rule:", error);
			return res.status(400).json({ error: error.message });
		}
		// Respond with success message and inserted data
		res.json({ message: "Detection rule created successfully.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * PUT /:id
 * Update an existing detection rule by id.
 * Updates the detection rule with the provided id using the new data.
 */
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { language, rule_name, regex_pattern } = req.body;
		// Update detection rule in the database based on the given id
		const { data, error } = await supabase
			.from("detection_rules")
			.update({ language, rule_name, regex_pattern })
			.eq("id", id)
			.select();
		if (error) {
			console.error("Error updating detection rule:", error);
			return res.status(400).json({ error: error.message });
		}
		// Respond with success message and updated data
		res.json({ message: "Detection rule updated successfully.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * DELETE /:id
 * Delete a detection rule by id.
 * Removes the specified detection rule from the database.
 */
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		// Delete the detection rule matching the provided id
		const { data, error } = await supabase
			.from("detection_rules")
			.delete()
			.eq("id", id)
			.select();
		if (error) {
			console.error("Error deleting detection rule:", error);
			return res.status(400).json({ error: error.message });
		}
		// Respond with success message and deleted data details
		res.json({ message: "Detection rule deleted successfully.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Export the router to be used in our main app
module.exports = router;
