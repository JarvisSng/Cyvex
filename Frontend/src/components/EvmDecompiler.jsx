import { useEffect, useState } from "react";
import { getCryptoPatterns } from "../controller/cryptoPatternsController";
import { getEvmOpcodes } from "../controller/evmOpcodesController";
import { getOpcodePatterns } from "../controller/opcodePatternsController";
import { 
  decompileByteCode, 
  decompileAddress,
  getByteCode,
  AddressDecompileToOpcodes, 
  ByteCodeDecompileToOpcodes 
} from "../controller/SEVMController";

export default function CryptoDetector() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState({
    findings: [],
    disassembly: "",
    pseudocode: "",
    bytecode: "",
    isContract: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState({
    opcodes: {},
    cryptoPatterns: {},
    opcodePatterns: {}
  });

  // Load required resources on mount
  useEffect(() => {
    const loadResources = async () => {
      try {
        const [opcodes, cryptoPatterns, opcodePatterns] = await Promise.all([
          getEvmOpcodes(),
          getCryptoPatterns(),
          getOpcodePatterns()
        ]);

        setResources({
          opcodes: opcodes.reduce((acc, op) => ({
            ...acc,
            [op.opcode.toLowerCase()]: op
          }), {}),
          cryptoPatterns: cryptoPatterns.reduce((acc, pattern) => ({
            ...acc,
            [pattern.pattern_name]: pattern.signature.toLowerCase()
          }), {}),
          opcodePatterns: opcodePatterns.reduce((acc, pattern) => ({
            ...acc,
            [pattern.pattern_name]: new RegExp(pattern.regex, 'g')
          }), {})
        });
      } catch (err) {
        console.error("Failed to load resources:", err);
        setError("Failed to load analysis resources");
      }
    };

    loadResources();
  }, []);

  const isEthereumAddress = (str) => /^0x[a-fA-F0-9]{40}$/.test(str);

  const getRiskLevel = (patternName) => {
    if (patternName.includes("ec_") || patternName.includes("ecrecover")) return 3;
    if (patternName.includes("sig") || patternName.includes("verify")) return 2;
    return 1;
  };

  const detectCryptoPatterns = (bytecode) => {
    const cleanBytecode = bytecode.toLowerCase().replace(/^0x/, "");
    const findings = [];

    // Check for function signature patterns
    Object.entries(resources.cryptoPatterns).forEach(([name, pattern]) => {
      let index = cleanBytecode.indexOf(pattern);
      while (index !== -1) {
        findings.push({
          type: pattern.length === 8 ? "function_sig" : "precompile",
          name,
          pattern,
          location: `0x${index.toString(16)}`,
          risk: getRiskLevel(name),
        });
        index = cleanBytecode.indexOf(pattern, index + 1);
      }
    });

    // Check for opcode patterns
    Object.entries(resources.opcodePatterns).forEach(([name, regex]) => {
      const matches = cleanBytecode.matchAll(regex);
      for (const match of matches) {
        findings.push({
          type: "opcode_pattern",
          name,
          location: `0x${match.index.toString(16)}`,
          risk: getRiskLevel(name),
        });
      }
    });

    return findings.sort((a, b) => b.risk - a.risk);
  };

  const analyzeInput = async () => {
    setLoading(true);
    setError(null);
    setAnalysis({
      findings: [],
      disassembly: "",
      pseudocode: "",
      bytecode: "",
      isContract: false
    });

    try {
      let bytecode = "";
      let disassembly = "";
      let pseudocode = "";
      let isContract = false;

      if (isEthereumAddress(input)) {
        // Address analysis flow
        const [bytecodeRes, disassemblyRes, pseudocodeRes] = await Promise.all([
          getByteCode(input),
          AddressDecompileToOpcodes(input),
          decompileAddress(input)
        ]);

        bytecode = bytecodeRes.data?.bytecode || "";
        disassembly = disassemblyRes.data?.disassembly?.join("\n") || "";
        pseudocode = pseudocodeRes.data?.pseudocode || "";
        isContract = true;
      } else {
        // Raw bytecode analysis flow
        const [disassemblyRes, pseudocodeRes] = await Promise.all([
          ByteCodeDecompileToOpcodes(input),
          decompileByteCode(input)
        ]);

        bytecode = input;
        disassembly = disassemblyRes.data?.disassembly?.join("\n") || "";
        pseudocode = pseudocodeRes.data?.pseudocode || "";
      }

      if (!bytecode) {
        throw new Error("No bytecode available for analysis");
      }

      const findings = detectCryptoPatterns(bytecode);

      setAnalysis({
        findings,
        disassembly,
        pseudocode,
        bytecode,
        isContract
      });

    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.message);
      setAnalysis(prev => ({
        ...prev,
        findings: [{
          type: "error",
          message: err.message
        }]
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          EVM Address or Bytecode to Analyze:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500 font-mono text-sm !text-gray-800"
          rows={8}
          placeholder="Paste contract address or bytecode (with or without 0x)"
          disabled={loading}
        />
      </div>

      <button
        onClick={analyzeInput}
        disabled={loading || !input.trim()}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          loading || !input.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "!bg-blue-950 hover:bg-blue-700"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze Contract"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-6">
        {/* Cryptographic Findings - Always show this section */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Cryptographic Findings:
          </h2>
          {loading ? (
            <p className="text-gray-500">Analyzing...</p>
          ) : error ? (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          ) : analysis.findings.length > 0 ? (
            <div className="space-y-3">
              {analysis.findings.map((finding, index) => (
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
                  {/* ... finding content ... */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No cryptographic operations detected</p>
          )}
        </div>

        {/* Disassembly - Only show if we have content */}
        {analysis.disassembly && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">Disassembly:</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm max-h-60">
              {analysis.disassembly}
            </pre>
          </div>
        )}

        {/* Pseudocode - Only show if we have content */}
        {analysis.pseudocode && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Reconstructed Solidity Code
            </h2>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {analysis.pseudocode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper components for better organization
const AnalysisSection = ({ title, content }) => (
  <div>
    <h2 className="text-lg font-medium text-gray-800 mb-2">{title}</h2>
    {content}
  </div>
);

const FindingCard = ({ finding }) => {
  const riskColors = {
    1: "bg-green-50 border-green-500 text-green-700",
    2: "bg-yellow-50 border-yellow-500 text-yellow-700",
    3: "bg-orange-50 border-orange-500 text-orange-700",
    error: "bg-red-50 border-red-500 text-red-700"
  };

  const colorClass = finding.type === "error" 
    ? riskColors.error 
    : riskColors[finding.risk] || riskColors[1];

  return (
    <div className={`p-3 rounded-md border-l-4 ${colorClass}`}>
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
  );
};