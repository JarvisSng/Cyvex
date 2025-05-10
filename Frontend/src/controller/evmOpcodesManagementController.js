// src/controller/evmOpcodesManagementController.js
import { fetchWithAuth } from "./authHelper";

/**
 * List all EVM opcodes.
 */
export const getEvmOpcodes = async () => {
	try {
		const response = await fetchWithAuth(
			"http://localhost:3000/api/evm-opcodes"
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to fetch EVM opcodes");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Fetch one opcode by code.
 * @param {string} code Two-hex-digit opcode, e.g. "60"
 */
export const getEvmOpcodeByCode = async (code) => {
	try {
		const response = await fetchWithAuth(
			`http://localhost:3000/api/evm-opcodes/${code}`
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to fetch EVM opcode");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Create a new opcode.
 * @param {{opcode: string, mnemonic: string}} entry
 */
export const createEvmOpcode = async (entry) => {
	try {
		const response = await fetchWithAuth(
			"http://localhost:3000/api/evm-opcodes",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(entry),
			}
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to create EVM opcode");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Update an existing opcode.
 * @param {string} code
 * @param {{mnemonic: string}} fields
 */
export const updateEvmOpcode = async (code, fields) => {
	try {
		const response = await fetchWithAuth(
			`http://localhost:3000/api/evm-opcodes/${code}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(fields),
			}
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to update EVM opcode");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};

/**
 * Delete an opcode.
 * @param {string} code
 */
export const deleteEvmOpcode = async (code) => {
	try {
		const response = await fetchWithAuth(
			`http://localhost:3000/api/evm-opcodes/${code}`,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			const err = await response.json();
			throw new Error(err.error || "Failed to delete EVM opcode");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};
