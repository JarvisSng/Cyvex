// routes/evmOpcodes.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseAdminClient");
const verifyAuth = require("../middleware/verifyAuth");

router.use(verifyAuth);

/**
 * GET /
 * List all EVM opcodes.
 */
router.get("/", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("evm_opcodes")
			.select("opcode, mnemonic");
		if (error) return res.status(400).json({ error: error.message });
		res.json({ data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * GET /:opcode
 * Retrieve one opcode by its hex code (e.g. '60').
 */
router.get("/:opcode", async (req, res) => {
	try {
		const { opcode } = req.params;
		const { data, error } = await supabase
			.from("evm_opcodes")
			.select("*")
			.eq("opcode", opcode)
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
 * Create a new EVM opcode entry.
 */
router.post("/", async (req, res) => {
	try {
		const { opcode, mnemonic } = req.body;
		const { data, error } = await supabase
			.from("evm_opcodes")
			.insert([{ opcode, mnemonic }])
			.select();
		if (error) return res.status(400).json({ error: error.message });
		res.json({ message: "EVM opcode created.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * PUT /:opcode
 * Update the mnemonic for an existing opcode.
 */
router.put("/:opcode", async (req, res) => {
	try {
		const { opcode } = req.params;
		const { mnemonic } = req.body;
		const { data, error } = await supabase
			.from("evm_opcodes")
			.update({ mnemonic })
			.eq("opcode", opcode)
			.select();
		if (error) return res.status(400).json({ error: error.message });
		res.json({ message: "EVM opcode updated.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * DELETE /:opcode
 * Remove an opcode from the table.
 */
router.delete("/:opcode", async (req, res) => {
	try {
		const { opcode } = req.params;
		const { data, error } = await supabase
			.from("evm_opcodes")
			.delete()
			.eq("opcode", opcode)
			.select();
		if (error) return res.status(400).json({ error: error.message });
		res.json({ message: "EVM opcode deleted.", data });
	} catch (err) {
		console.error("Unexpected error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
