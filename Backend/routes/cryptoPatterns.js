// routes/cryptoPatterns.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient");
const verifyAuth = require("../middleware/verifyAuth");

router.use(verifyAuth);

/**
 * GET /
 * List all crypto patterns.
 */
router.get("/", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("crypto_patterns")
			.select("id, pattern_name, signature");
		if (error) return res.status(400).json({ error: error.message });
		res.json({ data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * GET /:id
 * Retrieve a specific crypto pattern by ID.
 */
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("crypto_patterns")
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
 * Create a new crypto pattern.
 */
router.post("/", async (req, res) => {
	try {
		const { pattern_name, signature } = req.body;
		const { data, error } = await supabase
			.from("crypto_patterns")
			.insert([{ pattern_name, signature }])
			.select();
		if (error) return res.status(400).json({ error: error.message });
		res.json({ message: "Crypto pattern created.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * PUT /:id
 * Update an existing crypto pattern.
 */
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { pattern_name, signature } = req.body;
		const { data, error } = await supabase
			.from("crypto_patterns")
			.update({ pattern_name, signature })
			.eq("id", id)
			.select();
		if (error) return res.status(400).json({ error: error.message });
		res.json({ message: "Crypto pattern updated.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * DELETE /:id
 * Delete a crypto pattern by ID.
 */
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("crypto_patterns")
			.delete()
			.eq("id", id)
			.select();
		if (error) return res.status(400).json({ error: error.message });
		res.json({ message: "Crypto pattern deleted.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
