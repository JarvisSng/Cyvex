// src/controller/detectionRulesController.js
import { fetchWithAuth } from "./authHelper";

export const getDetectionRules = async () => {
	try {
		const response = await fetchWithAuth(
			"http://localhost:3000/api/rules-management/"
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch detection rules");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

export const getDetectionRuleById = async (id) => {
	try {
		const response = await fetchWithAuth(
			`http://localhost:3000/api/rules-management/${id}`
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch detection rule");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

export const createDetectionRule = async (rule) => {
	try {
		const response = await fetchWithAuth(
			"http://localhost:3000/api/rules-management",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(rule),
			}
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to create detection rule");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

export const updateDetectionRule = async (id, rule) => {
	try {
		const response = await fetchWithAuth(
			`http://localhost:3000/api/rules-management/${id}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(rule),
			}
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to update detection rule");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

export const deleteDetectionRule = async (id) => {
	try {
		const response = await fetchWithAuth(
			`http://localhost:3000/api/rules-management/${id}`,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to delete detection rule");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};
