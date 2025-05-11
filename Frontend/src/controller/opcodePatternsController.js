// src/controller/opcodePatternsController.js
import path from "../config/expressPath";

/**
 * Parse a literal‐style regex string into a RegExp object.
 */
const parseRegex = (patternStr) => {
	if (patternStr.startsWith("/") && patternStr.lastIndexOf("/") > 0) {
		const last = patternStr.lastIndexOf("/");
		const pat = patternStr.slice(1, last);
		const flags = patternStr.slice(last + 1);
		return new RegExp(pat, flags);
	}
	return new RegExp(patternStr, "i");
};

/**
 * Fetches opcode fingerprint patterns (no auth) and converts them to RegExp.
 *
 * @returns {Promise<
 *   Array<{pattern_name: string, regex: RegExp}> |
 *   {error: string}
 * >}
 */
export const getOpcodePatterns = async () => {
	try {
		const response = await fetch(`${path}/api/evm/opcode-patterns`);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch opcode patterns");
		}
		const rows = await response.json();
		return rows.map((r) => ({
			pattern_name: r.pattern_name,
			regex: parseRegex(r.regex_pattern),
		}));
	} catch (error) {
		return { error: error.message };
	}
};
