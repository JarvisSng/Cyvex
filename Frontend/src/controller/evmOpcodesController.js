// src/controller/evmOpcodesController.js
import path from "../config/expressPath";

/**
 * Fetches all EVM opcodes (no auth).
 * @returns {Promise<Array<{opcode: string, mnemonic: string}>|{error: string}>}
 */
export const getEvmOpcodes = async () => {
	try {
		const response = await fetch(`${path}/api/evm/evm-opcodes`);
		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || "Failed to fetch EVM opcodes");
		}
		return await response.json();
	} catch (error) {
		return { error: error.message };
	}
};
