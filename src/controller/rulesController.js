// src/controller/detectionRulesController.js

// Helper: Convert a regex string (in literal form) into a RegExp object.
const parseRegex = (patternStr) => {
	// Check if the string starts with "/" and has another "/" marking the end of the pattern.
	if (patternStr.startsWith("/") && patternStr.lastIndexOf("/") > 0) {
		const lastSlashIndex = patternStr.lastIndexOf("/");
		const pattern = patternStr.slice(1, lastSlashIndex);
		const flags = patternStr.slice(lastSlashIndex + 1);
		return new RegExp(pattern, flags);
	}
	// Fallback: Create a regex with default "i" flag.
	return new RegExp(patternStr, "i");
};

// Helper: Convert the detection rules object (grouped by language with string patterns)
// into one with actual RegExp objects.
const convertDetectionRules = (rulesObj) => {
	const converted = {};
	for (const language in rulesObj) {
		converted[language] = {};
		for (const rule in rulesObj[language]) {
			// Convert each pattern string into a RegExp object.
			converted[language][rule] = parseRegex(rulesObj[language][rule]);
		}
	}
	return converted;
};

export const getDetectionRules = async () => {
	try {
		const response = await fetch(
			"http://localhost:3000/api/rules/detection-rules"
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch detection rules");
		}
		const data = await response.json();
		// Convert all regex strings to RegExp objects
		const convertedRules = convertDetectionRules(data);
		return convertedRules;
	} catch (error) {
		return { error: error.message };
	}
};
