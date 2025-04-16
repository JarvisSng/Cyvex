// routes/analyze.js

const express = require("express");
const router = express.Router();
const wiki = require("wikijs").default;

/**
 * A helper function to normalize text.
 */
function normalizeText(text) {
	if (Array.isArray(text)) {
		return text
			.map((item) => {
				if (typeof item === "object" && item.text) {
					return item.text;
				}
				return item.toString();
			})
			.join(" ");
	} else if (typeof text === "object") {
		return text.text ? text.text : JSON.stringify(text);
	}
	return text;
}

/**
 * Heuristic function to detect cryptographic algorithm names in text.
 * It searches for common algorithms using a regex.
 */
function detectCrypto(rawText) {
	const text = normalizeText(rawText);
	// Remove word boundaries for a more flexible match
	const cryptoRegex =
		/(SHA-256|SHA256|Keccak-256|SHA-3|scrypt|RIPEMD-160|Blake2b|Blake2s)/i;
	const match = text.match(cryptoRegex);
	if (match) {
		return {
			algorithm: match[0],
			details: `Detected cryptographic algorithm: ${match[0]}`,
		};
	}
	return null;
}

/**
 * POST /api/analyze
 * Expects a JSON payload with a "code" field.
 * The endpoint detects a cryptographic function in the code and then fetches
 * additional information about the algorithm from Wikipedia.
 */
router.post("/", async (req, res) => {
	const { code } = req.body;
	if (!code) {
		return res.status(400).json({ error: "No code provided" });
	}

	// Detect the algorithm in the code snippet
	const detected = detectCrypto(code);
	if (!detected) {
		return res.json({
			detected: false,
			message:
				"No known cryptographic function detected in the provided code.",
		});
	}

	// Fetch additional information about the detected algorithm from Wikipedia
	let algorithmInfo = "Additional information not available.";
	try {
		const algoPage = await wiki().page(detected.algorithm);
		algorithmInfo = await algoPage.summary();
	} catch (algoError) {
		console.error("Error fetching algorithm info:", algoError.message);
	}

	res.json({
		detected: true,
		crypto: {
			...detected,
			algorithm_info: algorithmInfo,
		},
	});
});

module.exports = router;
