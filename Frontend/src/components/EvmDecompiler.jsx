import { useEffect, useState } from "react";
import { getCryptoPatterns } from "../controller/cryptoPatternsController";
import { getEvmOpcodes } from "../controller/evmOpcodesController";
import { getOpcodePatterns } from "../controller/opcodePatternsController";

// Complete EVM opcode mapping
const opcode_map = {
	"00": "STOP",
	"01": "ADD",
	"02": "MUL",
	"03": "SUB",
	"04": "DIV",
	"05": "SDIV",
	"06": "MOD",
	"07": "SMOD",
	"08": "ADDMOD",
	"09": "MULMOD",
	"0a": "EXP",
	"0b": "SIGNEXTEND",
	10: "LT",
	11: "GT",
	12: "SLT",
	13: "SGT",
	14: "EQ",
	15: "ISZERO",
	20: "SHA3",
	30: "ADDRESS",
	31: "BALANCE",
	32: "ORIGIN",
	33: "CALLER",
	34: "CALLVALUE",
	35: "CALLDATALOAD",
	36: "CALLDATASIZE",
	37: "CALLDATACOPY",
	38: "CODESIZE",
	39: "CODECOPY",
	"3a": "GASPRICE",
	"3b": "EXTCODESIZE",
	"3c": "EXTCODECOPY",
	"3d": "RETURNDATASIZE",
	"3e": "RETURNDATACOPY",
	40: "BLOCKHASH",
	41: "COINBASE",
	42: "TIMESTAMP",
	43: "NUMBER",
	44: "DIFFICULTY",
	45: "GASLIMIT",
	50: "POP",
	51: "MLOAD",
	52: "MSTORE",
	53: "MSTORE8",
	54: "SLOAD",
	55: "SSTORE",
	56: "JUMP",
	57: "JUMPI",
	58: "PC",
	59: "MSIZE",
	"5a": "GAS",
	"5b": "JUMPDEST",
	60: "PUSH1",
	61: "PUSH2",
	62: "PUSH3",
	63: "PUSH4",
	64: "PUSH5",
	65: "PUSH6",
	66: "PUSH7",
	67: "PUSH8",
	68: "PUSH9",
	69: "PUSH10",
	"6a": "PUSH11",
	"6b": "PUSH12",
	"6c": "PUSH13",
	"6d": "PUSH14",
	"6e": "PUSH15",
	"6f": "PUSH16",
	70: "PUSH17",
	71: "PUSH18",
	72: "PUSH19",
	73: "PUSH20",
	74: "PUSH21",
	75: "PUSH22",
	76: "PUSH23",
	77: "PUSH24",
	78: "PUSH25",
	79: "PUSH26",
	"7a": "PUSH27",
	"7b": "PUSH28",
	"7c": "PUSH29",
	"7d": "PUSH30",
	"7e": "PUSH31",
	"7f": "PUSH32",
	80: "DUP1",
	81: "DUP2",
	82: "DUP3",
	83: "DUP4",
	84: "DUP5",
	85: "DUP6",
	86: "DUP7",
	87: "DUP8",
	88: "DUP9",
	89: "DUP10",
	"8a": "DUP11",
	"8b": "DUP12",
	"8c": "DUP13",
	"8d": "DUP14",
	"8e": "DUP15",
	"8f": "DUP16",
	90: "SWAP1",
	91: "SWAP2",
	92: "SWAP3",
	93: "SWAP4",
	94: "SWAP5",
	95: "SWAP6",
	96: "SWAP7",
	97: "SWAP8",
	98: "SWAP9",
	99: "SWAP10",
	"9a": "SWAP11",
	"9b": "SWAP12",
	"9c": "SWAP13",
	"9d": "SWAP14",
	"9e": "SWAP15",
	"9f": "SWAP16",
	a0: "LOG0",
	a1: "LOG1",
	a2: "LOG2",
	a3: "LOG3",
	a4: "LOG4",
	f0: "CREATE",
	f1: "CALL",
	f2: "CALLCODE",
	f3: "RETURN",
	f4: "DELEGATECALL",
	f5: "CREATE2",
	fa: "STATICCALL",
	fd: "REVERT",
	fe: "INVALID",
	ff: "SELFDESTRUCT",
};

// Cryptographic patterns to detect
const crypto_patterns = {
	// Ethereum cryptographic precompiles
	"ecrecover (signature recovery)":
		"0000000000000000000000000000000000000001",
	"sha256 (hashing)": "0000000000000000000000000000000000000002",
	"ripemd160 (hashing)": "0000000000000000000000000000000000000003",
	"identity (copying)": "0000000000000000000000000000000000000004",
	"mod_exp (modular exponentiation)":
		"0000000000000000000000000000000000000005",
	"ec_add (elliptic curve addition)":
		"0000000000000000000000000000000000000006",
	"ec_mul (elliptic curve multiplication)":
		"0000000000000000000000000000000000000007",
	"ec_pairing (elliptic curve pairing)":
		"0000000000000000000000000000000000000008",
	"blake2f (hashing)": "0000000000000000000000000000000000000009",

	// Common cryptographic function signatures
	"transfer(address,uint256)": "a9059cbb",
	"approve(address,uint256)": "095ea7b3",
	"balanceOf(address)": "70a08231",
	"verifySig(bytes32,bytes)": "1626ba7e",
	"isValidSignature(bytes32,bytes)": "20c13b0b",
	"setSigner(address)": "e1c7392a",
	"mint(address,uint256)": "40c10f19",
};

// Cryptographic opcode patterns
const opcode_patterns = {
	"sha3 (keccak256)": /a2646970667358/,
	signature_verification: /64792b2b34ba3c59a7a5a5f8/,
	ecdsa_recovery: /60003560205260206000f3/,
	"external_call (potential oracle)": /5b5f3560205b5f5ff3/,
	"storage_access (potential key storage)": /54|55/,
	"delegatecall_proxy (upgrade pattern)": /5f5f365f5f37/,
};

export default function CryptoDetector() {
	const [bytecode, setBytecode] = useState("");
	const [cryptoFindings, setCryptoFindings] = useState([]);
	const [disassembly, setDisassembly] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const [OPCODE_MAP, setOpcodeMap] = useState({});
	const [CRYPTO_PATTERNS, setCryptoPatternsState] = useState({});
	const [OPCODE_PATTERNS, setOpcodePatternsState] = useState({});

	const [evmError, setEvmError] = useState("");
	const [opcodeError, setOpcodeError] = useState("");
	const [cryptoError, setCryptoError] = useState("");

	// On mount, fetch all mappings & patterns
	useEffect(() => {
		const loadAll = async () => {
			// EVM opcodes
			const evm = await getEvmOpcodes();
			if (evm.error) {
				setEvmError(evm.error);
			} else {
				const map = {};
				evm.forEach(({ opcode, mnemonic }) => {
					map[opcode.toLowerCase()] = mnemonic;
				});
				setOpcodeMap(map);
			}

			// Crypto patterns
			const crypto = await getCryptoPatterns();
			if (crypto.error) {
				setCryptoError(crypto.error);
			} else {
				const map = {};
				crypto.forEach(({ pattern_name, signature }) => {
					map[pattern_name] = signature.toLowerCase();
				});
				setCryptoPatternsState(map);
			}

			// Opcode regex patterns
			const ops = await getOpcodePatterns();
			if (ops.error) {
				setOpcodeError(ops.error);
			} else {
				const map = {};
				ops.forEach(({ pattern_name, regex }) => {
					map[pattern_name] = regex;
				});
				setOpcodePatternsState(map);
			}
		};

		loadAll();
	}, []);

	const detectCryptoOperations = (code) => {
		const findings = [];
		const cleanCode = code.toLowerCase().replace(/^0x/, "");

		// Detect cryptographic patterns
		for (const [name, pattern] of Object.entries(CRYPTO_PATTERNS)) {
			if (typeof pattern === "string") {
				const index = cleanCode.indexOf(pattern);
				if (index !== -1) {
					findings.push({
						type:
							pattern.length === 8
								? "function_sig"
								: "precompile",
						name,
						pattern,
						location: `0x${index.toString(16)}`,
						risk: getRiskLevel(name),
					});
				}
			}
		}

		// Detect opcode patterns
		for (const [name, regex] of Object.entries(OPCODE_PATTERNS)) {
			const match = cleanCode.match(regex);
			if (match) {
				findings.push({
					type: "opcode_pattern",
					name,
					location: `0x${match.index.toString(16)}`,
					risk: getRiskLevel(name),
				});
			}
		}

		return findings.sort((a, b) => b.risk - a.risk);
	};

	const getRiskLevel = (name) => {
		if (name.includes("ec_") || name.includes("ecrecover")) return 3;
		if (name.includes("sig") || name.includes("verify")) return 2;
		return 1;
	};

	const disassembleBytecode = (code) => {
		try {
			const cleanCode = code.startsWith("0x") ? code.slice(2) : code;
			const result = [];
			let i = 0;

			while (i < cleanCode.length) {
				const byte = cleanCode.substr(i, 2);
				const opcode = OPCODE_MAP[byte] || `0x${byte}`;

				if (byte >= "60" && byte <= "7f") {
					const pushSize = parseInt(byte, 16) - 0x5f;
					const pushData = cleanCode.substr(i + 2, pushSize * 2);
					result.push(`${i / 2}: ${opcode} 0x${pushData}`);
					i += 2 + pushSize * 2;
				} else {
					result.push(`${i / 2}: ${opcode}`);
					i += 2;
				}
			}

			return result.join("\n");
		} catch (err) {
			console.error("Disassembly error:", err);
			return `Disassembly failed: ${err.message}`;
		}
	};

	const analyzeBytecode = async () => {
		setIsLoading(true);
		setCryptoFindings([]);
		setDisassembly("");

		try {
			if (!bytecode.trim()) throw new Error("Please enter EVM bytecode");

			const normalizedBytecode = bytecode.startsWith("0x")
				? bytecode
				: `0x${bytecode}`;

			const detected = detectCryptoOperations(normalizedBytecode);
			setCryptoFindings(detected);

			const opcodes = disassembleBytecode(normalizedBytecode);
			setDisassembly(opcodes);
		} catch (err) {
			setCryptoFindings([
				{
					type: "error",
					message: err.message,
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					EVM Bytecode to Analyze:
				</label>
				<textarea
					value={bytecode}
					onChange={(e) => setBytecode(e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 font-mono text-sm text-gray-800"
					rows={8}
					placeholder="Paste contract bytecode (with or without 0x)"
					disabled={isLoading}
				/>
			</div>

			<button
				onClick={analyzeBytecode}
				disabled={isLoading || !bytecode.trim()}
				className={`px-4 py-2 rounded-md text-white font-medium ${
					isLoading || !bytecode.trim()
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
							{cryptoFindings.map((finding, index) => (
								<div
									key={index}
									className={`
                  p-3 rounded-md border-l-4
                  ${
						finding.type === "error"
							? "bg-red-50 border-red-500 text-red-700"
							: finding.risk === 3
							? "bg-orange-50 border-orange-500 text-orange-700"
							: finding.risk === 2
							? "bg-yellow-50 border-yellow-500 text-yellow-700"
							: "bg-green-50 border-green-500 text-green-700"
					}
                `}
								>
									{finding.type === "error" ? (
										<p>{finding.message}</p>
									) : (
										<>
											<p className="font-bold">
												{finding.name}
											</p>
											<p>
												Type:{" "}
												{finding.type.replace("_", " ")}
											</p>
											{finding.pattern && (
												<p>
													Pattern: {finding.pattern}
												</p>
											)}
											<p>Location: {finding.location}</p>
											<p>
												Risk:{" "}
												{"❗".repeat(finding.risk)}
											</p>
										</>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">
							{isLoading
								? "Analyzing..."
								: "No cryptographic operations detected yet"}
						</p>
					)}
				</div>

				{disassembly && (
					<div>
						<h2 className="text-lg font-medium text-gray-800 mb-2">
							Disassembly (First 100 lines):
						</h2>
						<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm max-h-60 text-gray-800">
							{disassembly.split("\n").slice(0, 100).join("\n")}
						</pre>
					</div>
				)}
			</div>
		</div>
	);
}
