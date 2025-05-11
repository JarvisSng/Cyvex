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
  const [controlFlow, setControlFlow] = useState([]);

  const [OPCODE_MAP, setOpcodeMap] = useState({});
  const [CRYPTO_PATTERNS, setCryptoPatternsState] = useState({});
  const [OPCODE_PATTERNS, setOpcodePatternsState] = useState({});

  const [evmError, setEvmError] = useState("");
  const [opcodeError, setOpcodeError] = useState("");
  const [cryptoError, setCryptoError] = useState("");

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
        } else {
          setEvmError(evm.error);
        }

        if (!crypto.error) {
          const map = {};
          crypto.forEach(({ pattern_name, signature }) => {
            map[pattern_name] = signature.toLowerCase();
          });
          setCryptoPatternsState(map);
        } else {
          setCryptoError(crypto.error);
        }

        if (!ops.error) {
          const map = {};
          ops.forEach(({ pattern_name, regex }) => {
            map[pattern_name] = regex;
          });
          setOpcodePatternsState(map);
        } else {
          setOpcodeError(ops.error);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    loadAll();
  }, []);

  // Enhanced disassembler with control flow tracking
  const enhancedDisassemble = (bytecode) => {
    const cleanCode = bytecode.startsWith("0x") ? bytecode.slice(2) : bytecode;
    const ops = [];
    let i = 0;
    const jumpdests = new Set();
    const calls = [];
    
    // First pass: identify all jump destinations
    while (i < cleanCode.length) {
      const byte = cleanCode.substr(i, 2);
      if (byte === "5b") { // JUMPDEST
        jumpdests.add(i/2);
      }
      i += 2;
    }
    
    // Second pass: full disassembly
    i = 0;
    while (i < cleanCode.length) {
      const pc = i/2;
      const byte = cleanCode.substr(i, 2);
      const opcode = OPCODE_MAP[byte] || `0x${byte}`;
      const op = { pc, opcode };
      
      if (byte >= "60" && byte <= "7f") { // PUSH
        const pushSize = parseInt(byte, 16) - 0x5f;
        op.operand = cleanCode.substr(i + 2, pushSize * 2);
        i += 2 + pushSize * 2;
      } else {
        i += 2;
      }
      
      // Track control flow
      if (byte === "56" || byte === "57") { // JUMP/JUMPI
        op.isJump = true;
      } else if (byte === "f1" || byte === "f2" || byte === "f4") { // CALL variants
        calls.push(pc);
      }
      
      ops.push(op);
    }
    
    return { ops, jumpdests, calls };
  };

  // Basic control flow analysis
  const analyzeControlFlow = (ops, jumpdests) => {
    const functions = [];
    let currentFunction = null;
    
    ops.forEach(op => {
      // Detect function starts (JUMPDEST with no incoming jumps)
      if (op.opcode === "JUMPDEST" && !currentFunction) {
        currentFunction = {
          start: op.pc,
          ops: [],
          name: `function_${op.pc.toString(16)}`
        };
        functions.push(currentFunction);
      }
      
      if (currentFunction) {
        currentFunction.ops.push(op);
        
        // End function at RETURN or STOP
        if (op.opcode === "RETURN" || op.opcode === "STOP") {
          currentFunction = null;
        }
      }
    });
    
    return functions;
  };

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
      console.error("Disassembly error:", err);
      return `Disassembly failed: ${err.message}`;
    }
  };

  // Generate readable pseudocode
  const generatePseudocode = (functions) => {
    const storageVars = {};
    let varCount = 1;
    let output = [];

    functions.forEach(fn => {
      let fnCode = [`function ${fn.name}() {`];
      let stack = [];

      fn.ops.forEach(op => {
        const indent = '  ';
        
        // Handle PUSH operations
        if (op.opcode.startsWith('PUSH')) {
          stack.push(`0x${op.operand}`);
          return;
        }

        // Handle storage operations
        if (op.opcode === 'SSTORE') {
          const value = stack.pop();
          const slot = stack.pop();
          
          if (!storageVars[slot]) {
            storageVars[slot] = `var${varCount++}`;
            output.unshift(`// Storage variable at slot ${slot}`);
            output.unshift(`let ${storageVars[slot]};`);
          }
          
          fnCode.push(`${indent}${storageVars[slot]} = ${value};`);
          return;
        }

        if (op.opcode === 'SLOAD') {
          const slot = stack.pop();
          const varName = storageVars[slot] || `storage[${slot}]`;
          stack.push(varName);
          return;
        }

        // Handle control flow
        if (op.opcode === 'JUMPI') {
          const condition = stack.pop();
          const dest = stack.pop();
          fnCode.push(`${indent}if (${condition}) goto label_${dest};`);
          return;
        }

        if (op.opcode === 'JUMP') {
          const dest = stack.pop();
          fnCode.push(`${indent}goto label_${dest};`);
          return;
        }

        if (op.opcode === 'JUMPDEST') {
          fnCode.push(`label_${op.pc}:`);
          return;
        }

        // Handle calls
        if (op.opcode === 'CALL') {
          const [gas, addr, value] = [stack.pop(), stack.pop(), stack.pop()];
          fnCode.push(`${indent}// External call to ${addr} with ${value} ETH`);
          return;
        }

        // Default case
        fnCode.push(`${indent}${op.opcode};`);
      });

      fnCode.push("}");
      output.push(fnCode.join("\n"));
    });

    return output.join("\n\n");
  };

  // Detect cryptographic patterns
  const detectCryptoOperations = (code) => {
    const findings = [];
    const cleanCode = code.toLowerCase().replace(/^0x/, "");

    // Detect cryptographic patterns
    for (const [name, pattern] of Object.entries(CRYPTO_PATTERNS)) {
      if (typeof pattern === "string") {
        const index = cleanCode.indexOf(pattern);
        if (index !== -1) {
          findings.push({
            type: pattern.length === 8 ? "function_sig" : "precompile",
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

  // Main analysis function
  const analyzeBytecode = async () => {
    setIsLoading(true);
    setCryptoFindings([]);
    setDisassembly("");
    setPseudocode("");
    setControlFlow([]);

    try {
      if (!bytecode.trim()) throw new Error("Please enter EVM bytecode");

      const normalizedBytecode = bytecode.startsWith("0x") 
        ? bytecode 
        : `0x${bytecode}`;

      // 1. Generate disassembly
      const disassembly = disassembleBytecode(normalizedBytecode);
      setDisassembly(disassembly);

      // 2. Analyze control flow
      const { ops, jumpdests } = enhancedDisassemble(normalizedBytecode);
      const functions = analyzeControlFlow(ops, jumpdests);
      setControlFlow(functions);

      // 3. Generate pseudocode
      const code = generatePseudocode(functions);
      setPseudocode(code);

      // 4. Detect crypto patterns
      const findings = detectCryptoOperations(normalizedBytecode);
      setCryptoFindings(findings);

    } catch (err) {
      setCryptoFindings([{
        type: "error",
        message: err.message,
      }]);
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
            <div className="mt-2 text-sm text-gray-500">
              <p>Note: This is reconstructed pseudocode, not original source.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}