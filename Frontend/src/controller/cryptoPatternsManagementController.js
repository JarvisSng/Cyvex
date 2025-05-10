// src/controller/cryptoPatternsManagementController.js
import { fetchWithAuth } from "./authHelper";

/**
 * List all crypto patterns.
 */
export const getCryptoPatterns = async () => {
	try {
		const response = await fetchWithAuth(
			"http://localhost:3000/api/crypto-patterns"
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to fetch crypto patterns");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Fetch one by ID.
 */
export const getCryptoPatternById = async (id) => {
	try {
		const response = await fetchWithAuth(
			`http://localhost:3000/api/crypto-patterns/${id}`
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to fetch crypto pattern");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Create a new pattern.
 */
export const createCryptoPattern = async (entry) => {
	try {
		const response = await fetchWithAuth(
			"http://localhost:3000/api/crypto-patterns",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(entry),
			}
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to create crypto pattern");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Update existing.
 */
export const updateCryptoPattern = async (id, entry) => {
	try {
		const response = await fetchWithAuth(
			`http://localhost:3000/api/crypto-patterns/${id}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(entry),
			}
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to update crypto pattern");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Delete by ID.
 */
export const deleteCryptoPattern = async (id) => {
	try {
		const response = await fetchWithAuth(
			`http://localhost:3000/api/crypto-patterns/${id}`,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to delete crypto pattern");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};
