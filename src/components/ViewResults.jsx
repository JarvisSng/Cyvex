import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetectionRules } from "../controller/rulesController";

/**
 * A small map of recommended actions for insecure rules
 */
const recommendedMap = {
  MD5: "Use SHA-256 instead of MD5",
  "SHA-1": "Use SHA-256 instead of SHA-1",
  DES: "Use AES instead of DES",
  "Hardcoded Key":
    "Use environment variables or a secure key management system instead of hardcoded keys",
  "RSA (Weak Key)": "Use RSA with at least 2048 bits",
};

// Define which rules are considered "insecure"
const insecureRules = ["MD5", "SHA-1", "DES", "Hardcoded Key", "RSA (Weak Key)"];

// 1) Skip lines that start with // or #
function isCommentLine(line) {
	const trimmed = line.trim();
	return trimmed.startsWith("//") || trimmed.startsWith("#");
}

// 2) Strip inline comments (everything after //)
function stripInlineComment(line) {
	const index = line.indexOf("//");
	return index !== -1 ? line.substring(0, index) : line;
}

// 3) Detection rules for each language, using word boundaries (\b)
const Rules = {
	JavaScript: {
		AES: /\bcrypto\.(?:createCipheriv|createCipher)\s*\(\s*['"]aes-\d+-cbc['"]/i,
		"RSA (Weak Key)":
			/\bcrypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]\s*,\s*\{\s*[^}]*modulusLength\s*:\s*(512|1024)/i,
		RSA: /\bcrypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]\s*,\s*\{\s*[^}]*modulusLength\s*:\s*(?!.*(512|1024))\d+/i,
		"SHA-1": /\bcrypto\.createHash\s*\(\s*['"]sha1['"]\s*\)/i,
		"SHA-256": /\bcrypto\.createHash\s*\(\s*['"]sha256['"]\s*\)/i,
		MD5: /\bcrypto\.createHash\s*\(\s*['"]md5['"]\s*\)/i,
		HMAC: /\bcrypto\.createHmac\s*\(\s*['"]sha\d+['"]\s*,/i,
		DES: /\bcrypto\.createCipher\s*\(\s*['"]des(?:-\d+)?-cbc['"]\s*,/i,
		"Hardcoded Key":
			/\b(?:const|let|var)\s+\w*(?:key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i,
	},

	Python: {
		"RSA (Weak Key)": /\bRSA\.generate\s*\(\s*(512|1024)(?:[^)]*)\)/i,
		RSA: /\bRSA\.generate\s*\(\s*(?!512|1024)\d+(?:[^)]*)\)/i,
		AES: /\bAES\.new\(/i,
		"SHA-1": /\bhashlib\.sha1\(|\bhashlib\.new\(['"]sha1['"]\)/i,
		"SHA-256": /\bhashlib\.sha256\(|\bhashlib\.new\(['"]sha256['"]\)/i,
		MD5: /\bhashlib\.md5\(|\bhashlib\.new\(['"]md5['"]\)/i,
		HMAC: /\bhmac\.new\(\s*.*,\s*hashlib\.sha\d+/i,
		DES: /\bDES\.new\(/i,
		"Hardcoded Key":
			/\b\w*(?:key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i,
	},
};

export default function ViewResults({code, fileExt}) {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
  const [activeTab, setActiveTab] = useState(""); // Set default active tab
  const [detectionRules, setDetectionRules] = useState({});

  // Default report
  const defaultReport = {
    language: "",
    codeLength: 0,
    detectedCryptographicFunctions: [],
    securityWarnings: [],
    snippets: [],
  };

  const [report, setReport] = useState(defaultReport);

  useEffect(() => {
    const fetchRules = async () => {
      const result = await getDetectionRules();
      if (result.error) {
        setError(result.error);
      } else {
        setDetectionRules(result);
      }
    };

    fetchRules();
  }, []);

  useEffect(() => {
    console.log("Received code:", code);
    console.log("Received file extension:", fileExt);
  }, [code, fileExt]);

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  // Debug: Log snippets to ensure they are being passed correctly
  console.log("Report snippets:", report ? report.snippets : "No report");

  // Detect the programming language based on file extension or string content
  const detectLanguage = (fileExt) => {
    if (typeof fileExt === 'string') {
      if (fileExt.includes("py")) {
        return "Python";
      }
      if (fileExt.includes("js")) {
        return "JavaScript";
      sx}
      if (fileExt.includes("cpp") || fileExt.includes("c++")) {
        return "C++";
      }
    }
    return "Unknown";
  };

  const handleScan = () => {
    if (!code) return;

    const language = detectLanguage(fileExt);
    const rulesForLanguage = detectionRules[language] || {};

    const lines = code.split("\n");
    const detectedCryptographicFunctions = [];
    const securityWarnings = [];
    const snippets = [];

    lines.forEach((lineContent, index) => {
      if (isCommentLine(lineContent)) return;

      const processedLine = stripInlineComment(lineContent);
      if (!processedLine.includes("(")) return;

      Object.entries(rulesForLanguage).forEach(([ruleName, regex]) => {
        if (regex.test(processedLine)) {
          if (!detectedCryptographicFunctions.includes(ruleName)) {
            detectedCryptographicFunctions.push(ruleName);
          }
          snippets.push({
            line: index + 1,
            code: lineContent,
            rule: ruleName,
          });
        }
      });
    });

    // Security Warnings
    if (detectedCryptographicFunctions.includes("SHA-1")) {
      securityWarnings.push("SHA-1 is weak.");
    }
    if (detectedCryptographicFunctions.includes("MD5")) {
      securityWarnings.push("MD5 is vulnerable to hash collisions.");
    }
    if (detectedCryptographicFunctions.includes("RSA (Weak Key)")) {
      securityWarnings.push("Weak RSA key detected. Use 2048 bits or more.");
    }
    if (detectedCryptographicFunctions.includes("Hardcoded Key")) {
      securityWarnings.push("Avoid storing keys in source code.");
    }

    // Create report object
    const Report = {
      language,
      codeLength: code.length,
      detectedCryptographicFunctions,
      securityWarnings,
      snippets,
    };

    console.log(Report);
    setReport(Report);
  };

  useEffect(() => {
    if (code && detectionRules) {
      handleScan();
    }
  }, [code, detectionRules]); // Ensure scan runs only after detectionRules is set

  // Prevent rendering if report remains unchanged
  if (JSON.stringify(report) === JSON.stringify(defaultReport)) {
    return <p>No report detected.</p>;
  }

  /**
   * Generates a .txt file containing the report data
   */
  const downloadReport = () => {
    let reportContent = `Analysis Report\n\n`;
    reportContent += `Language Detected: ${report.language}\n`;
    reportContent += `Code Length: ${report.codeLength} characters\n\n`;

    reportContent += `Detected Cryptographic Functions:\n`;
    report.detectedCryptographicFunctions.forEach((func) => {
      reportContent += `- ${func}\n`;
    });

    reportContent += `\nSecurity Warnings:\n`;
    if (report.securityWarnings.length > 0) {
      report.securityWarnings.forEach((warning) => {
        reportContent += `- ${warning}\n`;
      });
    } else {
      reportContent += "None\n";
    }

    reportContent += `\nRecommended Alternatives:\n`;
    if (report.detectedCryptographicFunctions.includes("MD5")) {
      reportContent += `- Use SHA-256 instead of MD5\n`;
    }
    if (report.detectedCryptographicFunctions.includes("SHA-1")) {
      reportContent += `- Use SHA-256 instead of SHA-1\n`;
    }
    if (report.detectedCryptographicFunctions.includes("DES")) {
      reportContent += `- Use AES instead of DES\n`;
    }
    if (report.detectedCryptographicFunctions.includes("Hardcoded Key")) {
      reportContent += `- Use environment variables or a secure key management system instead of hardcoded keys\n`;
    }
    if (report.detectedCryptographicFunctions.includes("RSA (Weak Key)")) {
      reportContent += `- Use RSA with at least 2048 bits\n`;
    }

    reportContent += `\nCode Snippets:\n`;
    if (report.snippets && report.snippets.length > 0) {
      report.snippets.forEach((snippet) => {
        reportContent += `Line ${snippet.line}: ${snippet.code}\n`;
      });
    } else {
      reportContent += "No relevant code snippets found.\n";
    }

    const blob = new Blob([reportContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Analysis_Report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Separate the summary from the code snippet display
  const summarySection = (
    <div>
      <p>
        <strong>Language Detected:</strong> {report.language}
      </p>
      <p>
        <strong>Code Length:</strong> {report.codeLength} characters
      </p>

      <h3>
        <strong>Detected Cryptographic Functions:</strong>
      </h3>
      {report.detectedCryptographicFunctions.length > 0 ? (
        <ul>
          {report.detectedCryptographicFunctions.map((func, index) => (
            <li
              key={index}
              style={{
                color: insecureRules.includes(func) ? "red" : "green",
              }}
            >
              {func}
            </li>
          ))}
        </ul>
      ) : (
        <p>No cryptographic functions detected.</p>
      )}

      <h3>
        <strong>Security Warnings:</strong>
      </h3>
      {report.securityWarnings.length > 0 ? (
        <ul>
          {report.securityWarnings.map((warning, index) => (
            <li key={index} style={{ color: "red" }}>
              {warning}
            </li>
          ))}
        </ul>
      ) : (
        <p>No security warnings.</p>
      )}

      <h3>
        <strong>Recommended Alternatives:</strong>
      </h3>
      <ul>
        {report.detectedCryptographicFunctions.includes("MD5") && (
          <li>Use SHA-256 instead of MD5</li>
        )}
        {report.detectedCryptographicFunctions.includes("SHA-1") && (
          <li>Use SHA-256 instead of SHA-1</li>
        )}
        {report.detectedCryptographicFunctions.includes("DES") && (
          <li>Use AES instead of DES</li>
        )}
        {report.detectedCryptographicFunctions.includes("Hardcoded Key") && (
          <li>
            Use environment variables or a secure key management system instead of hardcoded keys
          </li>
        )}
        {report.detectedCryptographicFunctions.includes("RSA (Weak Key)") && (
          <li>Use RSA with at least 2048 bits</li>
        )}
      </ul>
    </div>
  );

  const snippetsSection = (
    <div
      style={{
        maxHeight: "500px",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        <strong>Code Snippets:</strong>
      </h3>
      {report.snippets && report.snippets.length > 0 ? (
        report.snippets.map((snippet, index) => {
          // Determine if snippet rule is insecure or safe
          const isInsecure = insecureRules.includes(snippet.rule);

          return (
            <div
              key={index}
              style={{
                border: "1px solid black",
                margin: "10px 0",
                padding: "10px",
                backgroundColor: isInsecure ? "#ffe5e5" : "#e5ffe5", // Red-ish or green-ish
              }}
            >
              <p
                style={{
                  fontWeight: "bold",
                  color: isInsecure ? "red" : "green",
                }}
              >
                Starting at Line {snippet.line} ({snippet.rule}):
              </p>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "Courier New, monospace" }}>
                {snippet.code.split("\n").map((line, idx) => (
                  <div key={idx} style={{ display: "flex" }}>
                    <span
                      style={{
                        width: "40px",
                        textAlign: "right",
                        marginRight: "10px",
                        color: "#888",
                      }}
                    >
                      {snippet.line + idx}
                    </span>
                    <span>{line}</span>
                  </div>
                ))}
              </pre>
            </div>
          );
        })
      ) : (
        <p>No relevant code snippets found.</p>
      )}
    </div>
  );

  // The combined layout for the Analysis Report
  const analysisReport = (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Left column: summary/report details */}
        <div style={{ flex: 1 }}>{summarySection}</div>

        {/* Right column: scrollable code snippets */}
        <div style={{ flex: 1 }}>{snippetsSection}</div>
      </div>

      {/* Bottom buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          onClick={downloadReport}
          style={{
            padding: "10px",
            backgroundColor: "navy",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            flex: 1,
          }}
        >
          Download Report
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ====== Layout: Sidebar + Main Content ====== */}
      <div className="flex pt-20"> {/* Adding pt-20 to make space for the fixed header */}
        {/* Main Content => Two-Column Design */}
        <main className="flex flex-col ml-64 p-6"> {/* Adding ml-64 to give space for sidebar */}
          {/* Buttons (Positioned at the top of the content) */}
          <div className="flex gap-2.5 mb-5 mt-5"> {/* Use margin-top (mt-5) for spacing */}
            <button
              onClick={() => handleButtonClick("pending")}
              className={`px-4 py-2 rounded-lg border-none font-bold cursor-pointer ${
                activeButton === "pending"
                  ? "!bg-blue-950 text-white"
                  : "bg-white text-black border-2 border-black"
              }`}
            >
              pending scans
            </button>
            <button
              onClick={() => handleButtonClick("completed")}
              className={`px-4 py-2 rounded-lg border-none font-bold cursor-pointer ${
                activeButton === "completed"
                  ? "!bg-blue-950 text-white"
                  : "bg-white text-black border-2 border-black"
              }`}
            >
              completed scans
            </button>
          </div>

          <div className="flex gap-5 w-full"> {/* Flex container to separate the two columns */}
            {/* Left Column: Logs + Analysis */}
            <div className="flex flex-col gap-5 w-1/3"> {/* Left column takes 1/3 of the space */}
              {/* Real-time log updates */}
              <div className="bg-gray-100 p-5 rounded-lg">
                <h3 className="text-xl font-semibold">real-time log updates</h3>
                <p>Status: completed</p>
                <p>... (placeholder for logs) ...</p>
              </div>

              {/* cyvex analysis block */}
              <div className="bg-gray-100 p-5 rounded-lg">
                <div className="mt-5 mb-5">
                  <h3 className="text-xl font-semibold">cyvex analysis</h3>
                  <p>Scanned for cryptographic functions</p>
                  <p>... (placeholder) ...</p>
                </div>
              </div>

              {/* Pagination at bottom */}
              <div className="mt-8 text-center">
                <span className="inline-block w-8 h-8 leading-8 bg-blue-900 text-white mx-2 rounded-md cursor-pointer font-semibold">
                  1
                </span>
                <span className="inline-block w-8 h-8 leading-8 bg-blue-900 text-white mx-2 rounded-md cursor-pointer font-semibold">
                  2
                </span>
              </div>
            </div>

            {/* Right Column => Analysis Report */}
            <div className="flex flex-col gap-5 w-2/3"> {/* Right column takes 2/3 of the space */}
              <div className="bg-gray-100 p-5 rounded-lg">
                {analysisReport}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );  
}
