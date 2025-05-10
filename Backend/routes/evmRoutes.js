// routes/publicData.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient");

/**
 * GET /api/data/evm-opcodes
 * Returns an array of { opcode, mnemonic }.
 */
router.get("/evm-opcodes", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("evm_opcodes")
			.select("opcode, mnemonic");
		if (error) {
			console.error("Error fetching EVM opcodes:", error);
			return res.status(400).json({ error: error.message });
		}
		res.json(data);
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * GET /api/data/crypto-patterns
 * Returns an array of { pattern_name, signature }.
 */
router.get("/crypto-patterns", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("crypto_patterns")
			.select("pattern_name, signature");
		if (error) {
			console.error("Error fetching crypto patterns:", error);
			return res.status(400).json({ error: error.message });
		}
		res.json(data);
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * GET /api/data/opcode-patterns
 * Returns an array of { pattern_name, regex_pattern }.
 */
router.get("/opcode-patterns", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("opcode_patterns")
			.select("pattern_name, regex_pattern");
		if (error) {
			console.error("Error fetching opcode patterns:", error);
			return res.status(400).json({ error: error.message });
		}
		res.json(data);
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
