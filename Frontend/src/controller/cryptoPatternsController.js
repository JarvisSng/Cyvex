// src/controller/cryptoPatternsController.js
import path from "../config/expressPath";

/**
 * Fetches all crypto patterns (no auth).
 * @returns {Promise<Array<{pattern_name: string, signature: string}>|{error: string}>}
 */
export const getCryptoPatterns = async () => {
	try {
		const response = await fetch(`${path}/api/evm/crypto-patterns`);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch crypto patterns");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};
