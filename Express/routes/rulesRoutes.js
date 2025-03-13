// routes/detectionRules.js
const express = require("express");
const router = express.Router();
const supabase = require("../../src/config/supabaseAdminClient"); // Use your anon client

router.get("/detection-rules", async (req, res) => {
	try {
		// Fetch all rows from the detection_rules table
		const { data, error } = await supabase
			.from("detection_rules")
			.select("language, rule_name, regex_pattern");
		if (error) {
			console.error("Error fetching detection rules:", error);
			return res.status(400).json({ error: error.message });
		}
		// Group the rules by language and return the regex_pattern as stored.
		const detectionRules = data.reduce((acc, rule) => {
			if (!acc[rule.language]) {
				acc[rule.language] = {};
			}
			acc[rule.language][rule.rule_name] = rule.regex_pattern;
			return acc;
		}, {});

		res.json(detectionRules);
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
