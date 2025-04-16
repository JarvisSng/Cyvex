// routes/blockchain.js

const express = require("express");
const router = express.Router();
const wiki = require("wikijs").default;

/**
 * Normalize text that might be an array or object into a plain string.
 */
function normalizeText(text) {
	if (Array.isArray(text)) {
		return text
			.map((item) => {
				if (typeof item === "object") {
					return item.text ? item.text : JSON.stringify(item);
				}
				return item;
			})
			.join(" ");
	} else if (typeof text === "object") {
		return text.text ? text.text : JSON.stringify(text);
	}
	return text;
}

/**
 * Heuristic to detect cryptographic function names in text.
 */
function detectCrypto(rawText) {
	const text = normalizeText(rawText);
	// Regex extended to catch variants (with and without hyphen)
	const cryptoRegex =
		/\b(SHA-256|SHA256|Keccak-256|SHA-3|scrypt|RIPEMD-160|Blake2b|Blake2s)\b/i;
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
 * GET /api/blockchain/:name
 * Fetches a Wikipedia summary for the given blockchain name, detects the cryptographic algorithm,
 * then fetches additional information about the algorithm from Wikipedia.
 */
router.get("/:name", async (req, res) => {
	const blockchainName = req.params.name;
	try {
		// Get the blockchain page from Wikipedia
		const page = await wiki().page(blockchainName);

		// First try the summary; if nothing is detected, try the full content
		let text = await page.summary();
		let detected = detectCrypto(text);
		if (!detected) {
			text = await page.content();
			detected = detectCrypto(text);
		}

		// Normalize text for a snippet display
		const normalizedText = normalizeText(text);
		const snippet = normalizedText.substring(0, 200) + "...";

		if (detected) {
			// Attempt to fetch additional information about the detected algorithm from Wikipedia
			let algorithmInfo = "";
			try {
				const algoPage = await wiki().page(detected.algorithm);
				algorithmInfo = await algoPage.summary();
			} catch (algoError) {
				algorithmInfo = "Additional information not available.";
			}

			res.json({
				blockchain: blockchainName,
				crypto: {
					...detected,
					algorithm_info: algorithmInfo,
				},
				summary: snippet,
			});
		} else {
			res.status(404).json({
				error: "Cryptographic function not detected in the text.",
				summary: snippet,
			});
		}
	} catch (error) {
		res.status(500).json({
			error: "Error fetching blockchain data",
			details: error.message,
		});
	}
});

module.exports = router;
