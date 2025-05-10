// routes/opcodePatterns.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient");
const verifyAuth = require("../middleware/verifyAuth");

router.use(verifyAuth);

/**
 * GET /
 * List all opcode regex patterns.
 */
router.get("/", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("opcode_patterns")
			.select("id, pattern_name, regex_pattern");
		if (error) return res.status(400).json({ error: error.message });
		res.json({ data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * GET /:id
 * Retrieve one pattern by ID.
 */
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("opcode_patterns")
			.select("*")
			.eq("id", id)
			.single();
		if (error) return res.status(400).json({ error: error.message });
		res.json({ data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * POST /
 * Create a new opcode regex pattern.
 */
router.post("/", async (req, res) => {
	try {
		const { pattern_name, regex_pattern } = req.body;
		const { data, error } = await supabase
			.from("opcode_patterns")
			.insert([{ pattern_name, regex_pattern }])
			.select();
		if (error) return res.status(400).json({ error: error.message });
		res.json({ message: "Opcode pattern created.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * PUT /:id
 * Update an existing opcode pattern.
 */
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { pattern_name, regex_pattern } = req.body;
		const { data, error } = await supabase
			.from("opcode_patterns")
			.update({ pattern_name, regex_pattern })
			.eq("id", id)
			.select();
		if (error) return res.status(400).json({ error: error.message });
		res.json({ message: "Opcode pattern updated.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * DELETE /:id
 * Remove an opcode pattern by ID.
 */
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("opcode_patterns")
			.delete()
			.eq("id", id)
			.select();
		if (error) return res.status(400).json({ error: error.message });
		res.json({ message: "Opcode pattern deleted.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
