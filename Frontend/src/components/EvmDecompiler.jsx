import { use, useEffect, useState } from "react";
import { getCryptoPatterns } from "../controller/cryptoPatternsController";
import { getEvmOpcodes } from "../controller/evmOpcodesController";
import { getOpcodePatterns } from "../controller/opcodePatternsController";
import { decompileByteCode, AddressDecompileToOpcodes, ByteCodeDecompileToOpcodes, getByteCode, decompileAddress } from "../controller/SEVMController";

export default function CryptoDetector() {
  const [address, setAddress] = useState("");
  const [cryptoFindings, setCryptoFindings] = useState([]);
  const [disassembly, setDisassembly] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pseudocode, setPseudocode] = useState("");
  const [error, setError] = useState(null);

  const [OPCODE_MAP, setOpcodeMap] = useState({});
  const [CRYPTO_PATTERNS, setCryptoPatternsState] = useState({});
  const [OPCODE_PATTERNS, setOpcodePatternsState] = useState({});

 	// Load opcodes and patterns on mount
	useEffect(() => {
	const loadAll = async () => {
		try {
		const [evm, crypto, ops] = await Promise.all([
			getEvmOpcodes(),
			getCryptoPatterns(),
			getOpcodePatterns()
		]);

		if (!evm.error) {
			const map = {};
			evm.forEach(op => {
			// Maintains exact JSON structure you required
			map[op.opcode.toLowerCase()] = {
				opcode: op.opcode,        // Preserved exactly as from API
				mnemonic: op.mnemonic    // Preserved exactly
			};
			});
			setOpcodeMap(map);
		}

		if (!crypto.error) {
			const cryptoMap = {};
			crypto.forEach(({ pattern_name, signature }) => {
			cryptoMap[pattern_name] = signature.toLowerCase();
			});
			setCryptoPatternsState(cryptoMap);
		}

		if (!ops.error) {
			const opPatterns = {};
			ops.forEach(({ pattern_name, regex }) => {
			opPatterns[pattern_name] = regex;
			});
			setOpcodePatternsState(opPatterns);
		}
		} catch (err) {
		console.error("Failed to load data:", err);
		}
	};

	loadAll();
	}, []);

	// Convert bytecode to disassembly
	const AddressDisassembleBytecode = async (address) => {
		try {
			const opcodeData = await  AddressDecompileToOpcodes(address);

			// Optional: Validate or transform data if needed
			console.log('Disassembled Opcodes:', opcodeData);
			return opcodeData;
		} catch (err) {
			console.error('Disassembly failed:', err);
			throw err;
		}
	};

	const ByteCodeDisassembleBytecode = async (address) => {
		try {
			const opcodeData = await ByteCodeDecompileToOpcodes(address);

			// Optional: Validate or transform data if needed
			console.log('Disassembled Opcodes:', opcodeData);
			return opcodeData;
		} catch (err) {
			console.error('Disassembly failed:', err);
			throw err;
		}
	};

	// Helper function to determine risk based on pattern name
	const getRisk = (name) => {
	if (name.includes("ec_") || name.includes("ecrecover")) return 3;
	if (name.includes("sig") || name.includes("verify")) return 2;
	return 1;
	};

	// Detect cryptographic patterns
	const detectCryptoOperations = (code) => {
		const findings = [];
		const cleanCode = code.toLowerCase().replace(/^0x/, "");  // Clean the code once

		// Match patterns by string (function signatures, precompiles)
		for (const [name, pattern] of Object.entries(CRYPTO_PATTERNS)) {
			if (typeof pattern === "string") {
			let index = cleanCode.indexOf(pattern);  // Find the first occurrence of the pattern
			while (index !== -1) {
				findings.push({
				type: pattern.length === 8 ? "function_sig" : "precompile",  // Check if it's a function signature
				name,
				pattern,
				location: `0x${index.toString(16)}`,
				risk: getRisk(name),  // Assuming getRisk is defined to assign a risk level
				});
				index = cleanCode.indexOf(pattern, index + 1);  // Move to next match
			}
			}
		}

		// Match patterns by regex (opcode patterns)
		for (const [name, regex] of Object.entries(OPCODE_PATTERNS)) {
			const clone = new RegExp(regex.source, 'g');  // Ensure global flag for regex
			let match;
			while ((match = clone.exec(cleanCode)) !== null) {
			findings.push({
				type: "opcode_pattern",
				name,
				location: `0x${match.index.toString(16)}`,
				risk: getRisk(name),
			});
			}
		}

		// Sort findings by risk in descending order
		return findings.sort((a, b) => b.risk - a.risk);
	};

	const analyzeBytecode = async () => {
		setIsLoading(true);
		setError(null);
		setCryptoFindings([]);
		setDisassembly("");
		setPseudocode("");

		console.log(address);
		// Log the maps to the console
		console.log("CRYPTO_PATTERNS:", CRYPTO_PATTERNS);
		console.log("OPCODE_PATTERNS:", OPCODE_PATTERNS);

		try {
			if (!address.trim()) throw new Error("Please enter a contract address");

			// Check if the input is a valid Ethereum address (starts with "0x" and has 40 hex characters)
			if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
			// If address is valid, proceed with disassembling and decompiling

			// === Call backend to disassemble the bytecode from the address ===
			const disassembled = await AddressDisassembleBytecode(address); // Send address to get disassembly
			setDisassembly(disassembled.data?.disassembly?.join("\n") || "No disassembly output");

			// === Crypto detection ===
			const bytecodeRaw = await getByteCode(address); // Fetch the real bytecode using the address
			setCryptoFindings(detectCryptoOperations(bytecodeRaw.data.bytecode));

			// === Call backend to decompile the bytecode from the address ===
			const response = await decompileAddress(address); // Send address to get the pseudocode
			console.log(response);

			if (response.success) {
				setPseudocode(response.data.pseudocode);
			} else {
				throw new Error(response.error || "Decompilation failed");
			}
			} else {
			// If it's raw bytecode (does not match Ethereum address format)
			// === Call backend to disassemble the bytecode directly ===
			const disassembled = await ByteCodeDisassembleBytecode(address); // Directly disassemble the bytecode
			setDisassembly(disassembled.data?.disassembly?.join("\n") || "No disassembly output");

			// === Crypto detection ===
			setCryptoFindings(detectCryptoOperations(address)); // Use raw bytecode for crypto detection

			// === Call backend to decompile the bytecode directly ===
			const response = await decompileByteCode(address); // Send raw bytecode to decompile
			console.log(response);

			if (response.success) {
				setPseudocode(response.data.pseudocode);
			} else {
				throw new Error(response.error || "Decompilation failed");
			}
			}
		} catch (err) {
			setError(err.message);
			setCryptoFindings([{
			type: "error",
			message: err.message
			}]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
	<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
		<div className="mb-4">
			<label className="block text-sm font-medium text-gray-700 mb-2">
			EVM Address or Bytecode to Analyze:
			</label>
			<textarea
			value={address}
			onChange={(e) => setAddress(e.target.value)}
			className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
					focus:outline-none focus:ring-2 focus:ring-blue-500
					focus:border-blue-500 font-mono text-sm !text-gray-800"
			rows={8}
			placeholder="Paste contract address or bytecode (with or without 0x)"
			disabled={isLoading}
			/>
		</div>

		<button
			onClick={analyzeBytecode}
			disabled={isLoading || !address.trim()}
			className={`px-4 py-2 rounded-md text-white font-medium ${
			isLoading || !address.trim()
				? "!bg-gray-400 cursor-not-allowed"
				: "!bg-blue-950 hover:bg-blue-700"
			}`}
		>
			{isLoading ? "Analyzing..." : "Detect Cryptographic Operations"}
		</button>

		<div className="mt-6 space-y-6">
			<div>
			<h2 className="text-lg font-medium text-gray-800 mb-2">
				Cryptographic Findings:
			</h2>
			{cryptoFindings.length > 0 ? (
				<div className="space-y-3">
					{Object.entries(
					cryptoFindings.reduce((acc, finding) => {
						if (!acc[finding.name]) acc[finding.name] = [];
						acc[finding.name].push(finding);
						return acc;
					}, {})
					).map(([name, findings], index) => {
					const first = findings[0];
					return (
						<div
						key={index}
						className={`p-3 rounded-md border-l-4 ${
							first.risk === 3
							? "bg-orange-50 border-orange-500 text-orange-700"
							: first.risk === 2
							? "bg-yellow-50 border-yellow-500 text-yellow-700"
							: "bg-green-50 border-green-500 text-green-700"
						}`}
						>
						<p className="font-bold">{name}</p>
						<p>Type: {first.type.replace("_", " ")}</p>
						<p>Locations: {findings.map(f => f.location).join(", ")}</p>
						<p>Risk: {"❗".repeat(first.risk)}</p>
						</div>
					);
					})}
				</div>
			) : (
				<p className="text-gray-500">
				{isLoading ? "Analyzing..." : "No cryptographic operations detected yet"}
				</p>
			)}
			</div>

			{disassembly && (
			<div>
				<h2 className="text-lg font-medium text-gray-800 mb-2">
				Disassembly:
				</h2>
				<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm max-h-60 !text-gray-800">
				{disassembly}
				</pre>
			</div>
			)}

			{pseudocode && (
			<div className="mt-6">
				<h2 className="text-lg font-medium text-gray-800 mb-2">
				Reconstructed Solidity Code
				</h2>
				<div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
					<pre className="text-sm font-mono whitespace-pre-wrap">
						{pseudocode}
					</pre>
				</div>
				<p>Note: This is reconstructed code, not the actual code</p>
			</div>
			)}
		</div>
	</div>
	);
}