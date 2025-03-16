// src/controller/rulesManagementController.js

// Import fetchWithAuth helper to make authenticated HTTP requests.
import { fetchWithAuth } from "./authHelper";

/**
 * Fetches all detection rules from the API.
 * @returns {Promise<Object>} The response containing the list of detection rules or an error object.
 */
export const getDetectionRules = async () => {
	try {
		// Make a GET request to the API endpoint for rules management.
		const response = await fetchWithAuth(
			"http://localhost:3000/api/rules-management/"
		);
		// If the response is not OK, parse the error message.
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch detection rules");
		}
		// Return the parsed JSON response.
		return await response.json();
	} catch (error) {
		// Return an error object with error message.
		return { error: error.message };
	}
};

/**
 * Fetches a single detection rule by its ID.
 * @param {string} id The ID of the detection rule.
 * @returns {Promise<Object>} The detection rule data or an error object.
 */
export const getDetectionRuleById = async (id) => {
	try {
		// Make a GET request to the API endpoint for a specific detection rule.
		const response = await fetchWithAuth(
			`http://localhost:3000/api/rules-management/${id}`
		);
		// If the response is not OK, parse the error message.
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch detection rule");
		}
		// Return the parsed JSON response.
		return await response.json();
	} catch (error) {
		// Return an error object with error message.
		return { error: error.message };
	}
};

/**
 * Creates a new detection rule.
 * @param {Object} rule The detection rule data to be created.
 * @returns {Promise<Object>} The created detection rule data or an error object.
 */
export const createDetectionRule = async (rule) => {
	try {
		// Make a POST request to the API endpoint to create a new detection rule.
		const response = await fetchWithAuth(
			"http://localhost:3000/api/rules-management",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(rule),
			}
		);
		// If the response is not OK, parse the error message.
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to create detection rule");
		}
		// Return the parsed JSON response.
		return await response.json();
	} catch (error) {
		// Return an error object with error message.
		return { error: error.message };
	}
};

/**
 * Updates an existing detection rule.
 * @param {string} id The ID of the detection rule to update.
 * @param {Object} rule The updated detection rule data.
 * @returns {Promise<Object>} The updated detection rule data or an error object.
 */
export const updateDetectionRule = async (id, rule) => {
	try {
		// Make a PUT request to the API endpoint to update the detection rule.
		const response = await fetchWithAuth(
			`http://localhost:3000/api/rules-management/${id}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(rule),
			}
		);
		// If the response is not OK, parse the error message.
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to update detection rule");
		}
		// Return the parsed JSON response.
		return await response.json();
	} catch (error) {
		// Return an error object with error message.
		return { error: error.message };
	}
};

/**
 * Deletes a detection rule by its ID.
 * @param {string} id The ID of the detection rule to delete.
 * @returns {Promise<Object>} The response confirming deletion or an error object.
 */
export const deleteDetectionRule = async (id) => {
	try {
		// Make a DELETE request to the API endpoint to remove the detection rule.
		const response = await fetchWithAuth(
			`http://localhost:3000/api/rules-management/${id}`,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			}
		);
		// If the response is not OK, parse the error message.
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to delete detection rule");
		}
		// Return the parsed JSON confirmation.
		return await response.json();
	} catch (error) {
		// Return an error object with error message.
		return { error: error.message };
	}
};
