import { useEffect, useState } from "react";
import { getCryptoPatterns } from "../controller/cryptoPatternsController";
import { getEvmOpcodes } from "../controller/evmOpcodesController";
import { getOpcodePatterns } from "../controller/opcodePatternsController";

export default function CryptoDetector() {
  const [bytecode, setBytecode] = useState("");
  const [cryptoFindings, setCryptoFindings] = useState([]);
  const [disassembly, setDisassembly] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pseudocode, setPseudocode] = useState("");

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
          evm.forEach(({ opcode, mnemonic }) => {
            map[opcode.toLowerCase()] = mnemonic;
          });
          setOpcodeMap(map);
        }

        if (!crypto.error) {
          const map = {};
          crypto.forEach(({ pattern_name, signature }) => {
            map[pattern_name] = signature.toLowerCase();
          });
          setCryptoPatternsState(map);
        }

        if (!ops.error) {
          const map = {};
          ops.forEach(({ pattern_name, regex }) => {
            map[pattern_name] = regex;
          });
          setOpcodePatternsState(map);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    loadAll();
  }, []);

  // Convert bytecode to disassembly
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
      return `Disassembly failed: ${err.message}`;
    }
  };

  // Generate readable pseudocode
  const generatePseudocode = (bytecode) => {
    const cleanCode = bytecode.startsWith("0x") ? bytecode.slice(2) : bytecode;
    const storageVars = {};
    let varCount = 1;
    let output = [];
    let stack = [];

    for (let i = 0; i < cleanCode.length; i += 2) {
      const byte = cleanCode.substr(i, 2);
      const opcode = OPCODE_MAP[byte] || `0x${byte}`;

      if (byte >= "60" && byte <= "7f") { // PUSH
        const pushSize = parseInt(byte, 16) - 0x5f;
        const value = "0x" + cleanCode.substr(i + 2, pushSize * 2);
        i += pushSize * 2;
        stack.push(value);
        continue;
      }

      if (opcode === "SSTORE") {
        const value = stack.pop();
        const slot = stack.pop();
        if (!storageVars[slot]) {
          storageVars[slot] = `var${varCount++}`;
          output.push(`uint256 ${storageVars[slot]};`);
        }
        output.push(`${storageVars[slot]} = ${value};`);
        continue;
      }

      if (opcode === "SLOAD") {
        const slot = stack.pop();
        const varName = storageVars[slot] || `storage[${slot}]`;
        stack.push(varName);
        continue;
      }
    }

    return output.join("\n");
  };

  // Detect cryptographic patterns
  const detectCryptoOperations = (code) => {
    const findings = [];
    const cleanCode = code.toLowerCase().replace(/^0x/, "");

    for (const [name, pattern] of Object.entries(CRYPTO_PATTERNS)) {
      if (typeof pattern === "string") {
        const index = cleanCode.indexOf(pattern);
        if (index !== -1) {
          findings.push({
            type: pattern.length === 8 ? "function_sig" : "precompile",
            name,
            pattern,
            location: `0x${index.toString(16)}`,
            risk: name.includes("ec_") || name.includes("ecrecover") ? 3 : 
                  name.includes("sig") || name.includes("verify") ? 2 : 1,
          });
        }
      }
    }

    for (const [name, regex] of Object.entries(OPCODE_PATTERNS)) {
      const match = cleanCode.match(regex);
      if (match) {
        findings.push({
          type: "opcode_pattern",
          name,
          location: `0x${match.index.toString(16)}`,
          risk: name.includes("ec_") ? 3 : name.includes("sig") ? 2 : 1,
        });
      }
    }

    return findings.sort((a, b) => b.risk - a.risk);
  };

  // Main analysis function
  const analyzeBytecode = async () => {
    setIsLoading(true);
    setCryptoFindings([]);
    setDisassembly("");
    setPseudocode("");

    try {
      if (!bytecode.trim()) throw new Error("Please enter EVM bytecode");

      const normalizedBytecode = bytecode.startsWith("0x") 
        ? bytecode 
        : `0x${bytecode}`;

      setDisassembly(disassembleBytecode(normalizedBytecode));
      setPseudocode(generatePseudocode(normalizedBytecode));
      setCryptoFindings(detectCryptoOperations(normalizedBytecode));
    } catch (err) {
      setCryptoFindings([{ type: "error", message: err.message }]);
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
                   focus:border-blue-500 font-mono text-sm !text-gray-800"
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
                  className={`p-3 rounded-md border-l-4 ${
                    finding.type === "error"
                      ? "bg-red-50 border-red-500 text-red-700"
                      : finding.risk === 3
                      ? "bg-orange-50 border-orange-500 text-orange-700"
                      : finding.risk === 2
                      ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                      : "bg-green-50 border-green-500 text-green-700"
                  }`}
                >
                  {finding.type === "error" ? (
                    <p>{finding.message}</p>
                  ) : (
                    <>
                      <p className="font-bold">{finding.name}</p>
                      <p>Type: {finding.type.replace("_", " ")}</p>
                      {finding.pattern && <p>Pattern: {finding.pattern}</p>}
                      <p>Location: {finding.location}</p>
                      <p>Risk: {"❗".repeat(finding.risk)}</p>
                    </>
                  )}
                </div>
              ))}
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
              Disassembly (First 100 lines):
            </h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm max-h-60 !text-gray-800">
              {disassembly.split("\n").slice(0, 100).join("\n")}
            </pre>
          </div>
        )}

        {pseudocode && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Reconstructed Pseudocode
            </h2>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {pseudocode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}