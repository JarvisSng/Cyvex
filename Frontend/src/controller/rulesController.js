// src/controller/detectionRulesController.js
import path from "../config/expressPath";

/**
 * Helper function to convert a regex string in literal form to a RegExp object.
 *
 * If the string starts with "/" and contains another "/" later, it extracts the pattern and flags.
 * Otherwise, it creates a RegExp with a default "i" (case-insensitive) flag.
 *
 * @param {string} patternStr - The regex pattern string.
 * @returns {RegExp} The constructed RegExp object.
 */
const parseRegex = (patternStr) => {
	// Check if the string starts with "/" and has another "/" marking the end of the pattern.
	if (patternStr.startsWith("/") && patternStr.lastIndexOf("/") > 0) {
		// Find the position of the last slash which separates the pattern and flags.
		const lastSlashIndex = patternStr.lastIndexOf("/");
		// Extract the regex pattern excluding the starting and ending slashes.
		const pattern = patternStr.slice(1, lastSlashIndex);
		// Extract flags that follow the last slash.
		const flags = patternStr.slice(lastSlashIndex + 1);
		return new RegExp(pattern, flags);
	}
	// Fallback: If the string is not in the expected literal format, use it as pattern with the "i" flag.
	return new RegExp(patternStr, "i");
};

/**
 * Converts an object of detection rules (grouped by language with string patterns)
 * into an object with RegExp objects.
 *
 * @param {Object} rulesObj - The original detection rules with regex strings.
 * @returns {Object} The detection rules with regex strings replaced by RegExp objects.
 */
const convertDetectionRules = (rulesObj) => {
	const converted = {};
	// Loop through each language in the detection rules object.
	for (const language in rulesObj) {
		converted[language] = {};
		// Convert each rule's pattern string into a RegExp object.
		for (const rule in rulesObj[language]) {
			converted[language][rule] = parseRegex(rulesObj[language][rule]);
		}
	}
	return converted;
};

/**
 * Fetches the detection rules from the API endpoint and returns them with patterns converted to RegExp objects.
 *
 * @returns {Promise<Object>} The converted detection rules or an error object if fetching fails.
 */
export const getDetectionRules = async () => {
	try {
		// Make an API call to fetch detection rules.
		const response = await fetch(`${path}/api/rules/detection-rules`);
		// If the response is not OK, throw an error with a message.
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch detection rules");
		}
		// Parse the JSON response.
		const data = await response.json();
		// Convert all regex strings in the response into RegExp objects.
		const convertedRules = convertDetectionRules(data);
		return convertedRules;
	} catch (error) {
		// If an error occurs, return an object containing the error message.
		return { error: error.message };
	}
};
