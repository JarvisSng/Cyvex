// routes/detectionRules.js
const express = require("express");
const router = express.Router();
const supabase = require("../../src/config/supabaseAdminClient"); // Use your anon client
const verifyAuth = require("../middleware/verifyAuth");

router.use(verifyAuth);

// GET: Retrieve all detection rules grouped by language
router.get("/", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("detection_rules")
			.select("id, language, rule_name, regex_pattern");
		if (error) {
			console.error("Error fetching detection rules:", error);
			return res.status(400).json({ error: error.message });
		}
		// Group rules by language into an object where each key is a language and its value is an array of rule objects
		const detectionRules = data.reduce((acc, rule) => {
			if (!acc[rule.language]) {
				acc[rule.language] = [];
			}
			acc[rule.language].push(rule);
			return acc;
		}, {});
		res.json({ data: detectionRules });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// GET: Retrieve a single detection rule by id
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("detection_rules")
			.select("*")
			.eq("id", id)
			.single();
		if (error) {
			console.error("Error fetching detection rule:", error);
			return res.status(400).json({ error: error.message });
		}
		res.json({ data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// POST: Create a new detection rule
router.post("/", async (req, res) => {
	try {
		const { language, rule_name, regex_pattern } = req.body;
		const { data, error } = await supabase
			.from("detection_rules")
			.insert([{ language, rule_name, regex_pattern }])
			.select();
		if (error) {
			console.error("Error creating detection rule:", error);
			return res.status(400).json({ error: error.message });
		}
		res.json({ message: "Detection rule created successfully.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// PUT: Update an existing detection rule by id
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { language, rule_name, regex_pattern } = req.body;
		const { data, error } = await supabase
			.from("detection_rules")
			.update({ language, rule_name, regex_pattern })
			.eq("id", id)
			.select();
		if (error) {
			console.error("Error updating detection rule:", error);
			return res.status(400).json({ error: error.message });
		}
		res.json({ message: "Detection rule updated successfully.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// DELETE: Delete a detection rule by id
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("detection_rules")
			.delete()
			.eq("id", id)
			.select();
		if (error) {
			console.error("Error deleting detection rule:", error);
			return res.status(400).json({ error: error.message });
		}
		res.json({ message: "Detection rule deleted successfully.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
