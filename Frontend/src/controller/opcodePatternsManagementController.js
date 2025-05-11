// src/controller/opcodePatternsManagementController.js
import path from "../config/expressPath";
import { fetchWithAuth } from "./authHelper";

/**
 * List all opcode regex patterns.
 */
export const getOpcodePatterns = async () => {
	try {
		const response = await fetchWithAuth(`${path}/api/opcode-patterns`);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to fetch opcode patterns");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Get one by ID.
 */
export const getOpcodePatternById = async (id) => {
	try {
		const response = await fetchWithAuth(
			`${path}/api/opcode-patterns/${id}`
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to fetch opcode pattern");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Create a new opcode pattern.
 */
export const createOpcodePattern = async (entry) => {
	try {
		const response = await fetchWithAuth(`${path}/api/opcode-patterns`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(entry),
		});
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to create opcode pattern");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Update an existing pattern.
 */
export const updateOpcodePattern = async (id, entry) => {
	try {
		const response = await fetchWithAuth(
			`${path}/api/opcode-patterns/${id}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(entry),
			}
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to update opcode pattern");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Delete by ID.
 */
export const deleteOpcodePattern = async (id) => {
	try {
		const response = await fetchWithAuth(
			`${path}/api/opcode-patterns/${id}`,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to delete opcode pattern");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};
