import React, { useEffect, useState, useMemo } from "react";
import { getDetectionRules } from "../controller/rulesController";
import { getUserProfileNoAuth } from "../controller/userController.js"
import { uploadUserFile } from "../controller/uploadController.js";
import EmptyState from "./EmptyState.jsx";

// Define which rules are considered "insecure" with severity levels
const insecureRules = {
  "MD5" : {severity : "high", cwe : "CWE-328"}, 
  "SHA-1" : {severity : "high", cwe : "CWE-328"},
  "DES" : {severity : "high", cwe : "CWE-326"},
  "Hardcoded Key" : {severity : "critical", cwe : "CWE-798"},
  "RSA (Weak Key)" : {severity : "medium", cwe : "CWE-326"}
};

// Severity color mapping
const severityColors = {
  critical: "#ff0000",
  high: "#ff4500",
  medium: "#ffa500",
  low: "#ffff00",
  info: "#6495ed"
};

const FALLBACK_RULES = {
  "MD5": "\\bmd5\\b|\\bMD5\\b",
  "SHA-1": "\\bsha1\\b|\\bSHA-1\\b",
  "DES": "\\bdes\\b|\\bDES\\b",
  "Hardcoded Key": "['\"][0-9a-fA-F]{16,}['\"]",
  "RSA (Weak Key)": "\\brsa\\b.*\\b1024\\b|\\bRSA\\b.*\\b1024\\b"
};

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

export default function ViewResults({code, fileExt}) {
  const [userId, setUserId] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [detectionRules, setDetectionRules] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isScanComplete, setIsScanComplete] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve userId
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // 1. Get username from localStorage
        const username = localStorage.getItem('username');
        
        if (!username) {
          throw new Error('Please sign in to continue');
        }
  
        setIsLoading(true);
        setError(null);
        
        // 2. Fetch user profile
        const { data } = await getUserProfileNoAuth(username);
        
        // 3. Debug the response (remove in production)
        console.log('Full API Response:', data);
  
        // 4. Handle the array response structure
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('User profile not found');
        }
  
        // 5. Extract user ID from the first array element
        const userObject = data[0];
        const fetchedUserId = userObject?.id;
  
        if (!fetchedUserId) {
          throw new Error('User ID missing in profile data');
        }
  
        // 6. Validate UUID format
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(fetchedUserId);
        if (!isUUID) {
          console.warn('User ID is not in standard UUID format:', fetchedUserId);
        }
  
        // 7. Store the validated user ID
        setUserId(fetchedUserId);
        localStorage.setItem('userId', fetchedUserId);
        console.log('Successfully set user ID:', fetchedUserId);
        
      } catch (err) {
        console.error('Failed to fetch user ID:', err);
        setError(err.message);
        setUserId(null);
        localStorage.removeItem('userId');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserId();
  }, []);

  // Empty state content definition
  const emptyStateContent = (
    <EmptyState 
      title="No code to analyze"
      description="Please upload or paste your code to begin cryptographic analysis"
    />
  );

  // Early return for empty state
  if (!code) {
    return (
      <div className="flex pt-20">
        <main className="flex flex-col p-6 w-full">
          {emptyStateContent}
        </main>
      </div>
    );
  }

  // Default report
  const defaultReport = {
    language: "",
    codeLength: 0,
    detectedCryptographicFunctions: [],
    securityWarnings: [],
    snippets: [],
    timestamp: new Date().toISOString()
  };

  const [report, setReport] = useState(defaultReport);

  useEffect(() => {
    const fetchRules = async () => {
      setIsLoading(true);
      try {
        const result = await getDetectionRules();
        if (result.error) {
          setError(result.error);
        } else {
          setDetectionRules(result);
        }
      } catch (err) {
        setError("Failed to load detection rules. Please try again later.");
        console.error("Error fetching rules:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRules();
  }, []);

  useEffect(() => {
    if (code && !isLoading && detectionRules) {
      handleScan();
    }
  }, [code, detectionRules, isLoading]);

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const detectLanguage = (fileExt, code) => {
    // 1. First try to detect by file extension
    const extensionMap = {
      py: 'Python',
      js: 'JavaScript',
      java: 'Java',
      cpp: 'C++',
      sol: 'Solidity'
    };

    if (fileExt) {
      const ext = fileExt.replace('.', '').toLowerCase();
      return extensionMap[ext] || 'Unknown';
    }

    // 2. For pasted code, use more aggressive content detection
    const codeStr = code.toLowerCase();
    
    if (/(^|\n)\s*(import|def|class)\s/.test(codeStr)) return 'Python';
    if (/(^|\n)\s*(function|const|let|var)\s/.test(codeStr)) return 'JavaScript';
    if (/(^|\n)\s*(#include|using namespace)/.test(codeStr)) return 'C++';
    if (/(^|\n)\s*(contract|pragma solidity)/.test(codeStr)) return 'Solidity';
    if (/(^|\n)\s*(public class|import java\.)/.test(codeStr)) return 'Java';

    return 'Unknown';
  };

  const handleScan = () => {
    setIsScanComplete(false);
    setActiveButton(null);

    if (!code || !detectionRules) {
      setReport({
        ...defaultReport,
        codeLength: code?.length || 0
      });
      return;
    }

    const language = detectLanguage(fileExt, code);
    const rulesForLanguage = detectionRules[language] || FALLBACK_RULES;
    const ruleEntries = Object.entries(rulesForLanguage);

    // Early return if no rules for this language
    if (ruleEntries.length === 0) {
      setReport({
        ...defaultReport,
        language,
        codeLength: code.length,
      });
      return;
    }

    const lines = code.split("\n");
    const detectedCryptographicFunctions = [];
    const securityWarnings = [];
    const snippets = [];

    lines.forEach((lineContent, index) => {
      if (isCommentLine(lineContent)) return;

      const processedLine = stripInlineComment(lineContent);

      ruleEntries.forEach(([ruleName, regexPattern]) => {
        try {
          const regex = new RegExp(regexPattern, 'i');
          if (regex.test(processedLine)) {
            if (!detectedCryptographicFunctions.includes(ruleName)) {
              detectedCryptographicFunctions.push(ruleName);
            }
            
            snippets.push({
              line: index + 1,
              code: lineContent,
              rule: ruleName,
              severity: insecureRules[ruleName]?.severity || "info",
              cwe: insecureRules[ruleName]?.cwe || null
            });
          }
        } catch (err) {
          console.error(`Invalid regex for rule ${ruleName}:`, err);
        }
      });
    });

    // Generate security warnings
    detectedCryptographicFunctions.forEach(func => {
      if (insecureRules[func]) {
        switch (func) {
          case "SHA-1":
            securityWarnings.push({
              message: "SHA-1 is cryptographically weak and should not be used for security purposes.",
              severity: "high",
              cwe: "CWE-328"
            });
            break;
          case "MD5":
            securityWarnings.push({
              message: "MD5 is vulnerable to hash collisions and should not be used for security purposes.",
              severity: "high",
              cwe: "CWE-328"
            });
            break;
          case "RSA (Weak Key)":
            securityWarnings.push({
              message: "Weak RSA key detected. Use 2048 bits or more for secure applications.",
              severity: "medium",
              cwe: "CWE-326"
            });
            break;
          case "Hardcoded Key":
            securityWarnings.push({
              message: "Avoid storing cryptographic keys in source code. Use secure key management systems.",
              severity: "critical",
              cwe: "CWE-798"
            });
            break;
          case "DES":
            securityWarnings.push({
              message: "DES is considered insecure. Use AES instead.",
              severity: "high",
              cwe: "CWE-326"
            });
            break;
        }
      }
    });

    // Create report object
    const newReport = {
      language,
      codeLength: code.length,
      detectedCryptographicFunctions,
      securityWarnings,
      snippets,
      timestamp: new Date().toISOString()
    };

    setReport(newReport);
    setIsScanComplete(true);
    setActiveButton("completed");
  };

  /**
   * Generates a .txt file containing the report data
   */
  const downloadReport = async () => {
    let reportContent = `Cryptographic Analysis Report\n`;
    reportContent += `Generated: ${new Date(report.timestamp).toLocaleString()}\n\n`;
    reportContent += `Language Detected: ${report.language}\n`;
    reportContent += `Code Length: ${report.codeLength} characters\n\n`;

    reportContent += `=== Detected Cryptographic Functions ===\n`;
    report.detectedCryptographicFunctions.forEach((func) => {
      const ruleInfo = insecureRules[func] || {};
      reportContent += `- ${func}${ruleInfo.cwe ? ` (${ruleInfo.cwe})` : ''}\n`;
    });

    reportContent += `\n=== Security Warnings ===\n`;
    if (report.securityWarnings.length > 0) {
      report.securityWarnings.forEach((warning) => {
        reportContent += `[${warning.severity.toUpperCase()}] ${warning.message}${warning.cwe ? ` (${warning.cwe})` : ''}\n`;
      });
    } else {
      reportContent += "No critical security warnings found.\n";
    }

    reportContent += `\n=== Recommended Alternatives ===\n`;
    if (report.detectedCryptographicFunctions.includes("MD5")) {
      reportContent += `- [HIGH] Replace MD5 with SHA-256 or SHA-3 (CWE-328)\n`;
    }
    if (report.detectedCryptographicFunctions.includes("SHA-1")) {
      reportContent += `- [HIGH] Replace SHA-1 with SHA-256 or SHA-3 (CWE-328)\n`;
    }
    if (report.detectedCryptographicFunctions.includes("DES")) {
      reportContent += `- [HIGH] Replace DES with AES-256 (CWE-326)\n`;
    }
    if (report.detectedCryptographicFunctions.includes("Hardcoded Key")) {
      reportContent += `- [CRITICAL] Use environment variables or secure key management systems instead of hardcoded keys (CWE-798)\n`;
    }
    if (report.detectedCryptographicFunctions.includes("RSA (Weak Key)")) {
      reportContent += `- [MEDIUM] Use RSA with at least 2048 bits (CWE-326)\n`;
    }

    reportContent += `\n=== Vulnerable Code Snippets ===\n`;
    if (report.snippets && report.snippets.length > 0) {
      report.snippets.forEach((snippet) => {
        reportContent += `\nLine ${snippet.line} [${snippet.rule.toUpperCase()} - ${snippet.severity.toUpperCase()}${snippet.cwe ? ` - ${snippet.cwe}` : ''}]:\n`;
        reportContent += `${snippet.code}\n`;
      });
    } else {
      reportContent += "No vulnerable code snippets detected.\n";
    }

    const blob = new Blob([reportContent], { type: "text/plain" });
    const defaultName = `CryptoReport_${new Date(report.timestamp).toISOString().slice(0, 10)}`;
    const customName = prompt("Enter report name (without extension):", defaultName) || defaultName;
    
    // Ensure filename is safe and has .txt extension
    const fileName = `${customName.replace(/[^a-z0-9_-]/gi, '_').trim()}.txt`;

    // Download button is created
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // 4. Only proceed with upload if we have a userId
    if (userId) {
      setIsUploading(true);
      setUploadError(null);
      
      try {
        const uploadResult = await uploadUserFile(
          userId,
          blob,
          {
            filename: fileName,
            contentType: "text/plain",
            metadata: {
              reportId: report.id,
              type: "crypto_analysis"
            }
          }
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Upload failed");
        }
        
        console.log("Upload successful:", uploadResult.path);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError(error.message);
      } finally {
        setIsUploading(false);
      }
    }

    // 5. Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 100);
  };

  // Memoized report sections for better performance
  const summarySection = useMemo(() => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Scan Information</h3>
        <p><strong>Language Detected:</strong> {report.language}</p>
        <p><strong>Code Length:</strong> {report.codeLength} characters</p>
        <p><strong>Scan Date:</strong> {new Date(report.timestamp).toLocaleString()}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Detected Cryptographic Functions</h3>
        {report.detectedCryptographicFunctions.length > 0 ? (
          <ul className="space-y-2">
            {report.detectedCryptographicFunctions.map((func, index) => {
              const isInsecure = insecureRules[func];
              return (
                <li key={index} className="flex items-center">
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: isInsecure 
                        ? severityColors[insecureRules[func].severity] 
                        : severityColors.info
                    }}
                  ></span>
                  {func}
                  {isInsecure && (
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                      {insecureRules[func].cwe}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No cryptographic functions detected.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Security Warnings</h3>
        {report.securityWarnings.length > 0 ? (
          <ul className="space-y-3">
            {report.securityWarnings.map((warning, index) => (
              <li key={index} className="p-3 rounded-md" style={{
                backgroundColor: `${severityColors[warning.severity]}20`,
                borderLeft: `4px solid ${severityColors[warning.severity]}`
              }}>
                <div className="font-medium" style={{ color: severityColors[warning.severity] }}>
                  {warning.severity.toUpperCase()}: {warning.message}
                </div>
                {warning.cwe && (
                  <div className="text-sm mt-1">
                    <strong>Reference:</strong> {warning.cwe}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No security warnings found.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Recommended Actions</h3>
        <ul className="space-y-2">
          {report.detectedCryptographicFunctions.includes("MD5") && (
            <li className="flex items-start">
              <span className="inline-block w-3 h-3 rounded-full mr-2 mt-1 bg-red-500"></span>
              <div>
                <strong>Replace MD5:</strong> Use SHA-256 or SHA-3 for cryptographic hashing (CWE-328)
              </div>
            </li>
          )}
          {report.detectedCryptographicFunctions.includes("SHA-1") && (
            <li className="flex items-start">
              <span className="inline-block w-3 h-3 rounded-full mr-2 mt-1 bg-red-500"></span>
              <div>
                <strong>Replace SHA-1:</strong> Use SHA-256 or SHA-3 for cryptographic hashing (CWE-328)
              </div>
            </li>
          )}
          {report.detectedCryptographicFunctions.includes("DES") && (
            <li className="flex items-start">
              <span className="inline-block w-3 h-3 rounded-full mr-2 mt-1 bg-red-500"></span>
              <div>
                <strong>Replace DES:</strong> Use AES-256 for symmetric encryption (CWE-326)
              </div>
            </li>
          )}
          {report.detectedCryptographicFunctions.includes("Hardcoded Key") && (
            <li className="flex items-start">
              <span className="inline-block w-3 h-3 rounded-full mr-2 mt-1 bg-purple-500"></span>
              <div>
                <strong>Remove hardcoded keys:</strong> Use environment variables or secure key management systems (CWE-798)
              </div>
            </li>
          )}
          {report.detectedCryptographicFunctions.includes("RSA (Weak Key)") && (
            <li className="flex items-start">
              <span className="inline-block w-3 h-3 rounded-full mr-2 mt-1 bg-orange-500"></span>
              <div>
                <strong>Strengthen RSA keys:</strong> Use at least 2048-bit keys (CWE-326)
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  ), [report]);

  const snippetsSection = useMemo(() => (
    <div className="h-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Code Snippets</h3>
        <p className="text-sm text-gray-600">
          {report.snippets?.length || 0} vulnerable patterns detected
        </p>
      </div>
      
      <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
        {report.snippets && report.snippets.length > 0 ? (
          report.snippets.map((snippet, index) => {
            const isInsecure = insecureRules[snippet.rule];
            const severity = isInsecure ? insecureRules[snippet.rule].severity : 'info';
            const severityColor = severityColors[severity];

            return (
              <div
                key={index}
                className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                style={{
                  borderLeft: `4px solid ${severityColor}`
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span 
                      className="inline-block px-2 py-1 rounded text-xs font-medium text-white mr-2"
                      style={{ backgroundColor: severityColor }}
                    >
                      {severity.toUpperCase()}
                    </span>
                    <span className="font-medium">{snippet.rule}</span>
                    {isInsecure && (
                      <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                        {insecureRules[snippet.rule].cwe}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Line {snippet.line}</div>
                </div>
                
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500">
            No vulnerable code snippets detected
          </div>
        )}
      </div>
    </div>
  ), [report]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading detection rules...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading rules</h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex pt-20">
      <main className="flex flex-col ml-64 p-6 w-full">
        <div className="flex gap-2.5 mb-5 mt-5">
          <button
            onClick={() => handleButtonClick("pending")}
            className={`px-4 py-2 rounded-lg border-none font-bold cursor-pointer ${
              activeButton === "pending"
                ? "!bg-blue-950 text-white"
                : "bg-white text-black border-2 border-black"
            }`}
            aria-label="View pending scans"
          >
            Pending Scans
          </button>
          <button
            onClick={() => handleButtonClick("completed")}
            className={`px-4 py-2 rounded-lg border-none font-bold cursor-pointer ${
              activeButton === "completed"
                ? "!bg-blue-950 text-white"
                : "bg-white text-black border-2 border-black"
            }`}
            aria-label="View completed scans"
          >
            Completed Scans
          </button>
        </div>

        <div className="flex gap-5 w-full">
          <div className="flex flex-col gap-5 w-1/3">
            <div className="bg-gray-100 p-5 rounded-lg">
              <h3 className="text-xl font-semibold">Scan Log</h3>
              <div className="mt-2 space-y-2">
                <p className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Scan completed successfully</span>
                </p>
                <p className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  <span>Analyzed {report.codeLength} characters</span>
                </p>
                <p className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  <span>Detected {report.detectedCryptographicFunctions.length} cryptographic functions</span>
                </p>
                <p className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <span>Found {report.securityWarnings.length} security warnings</span>
                </p>
              </div>
            </div>

            {summarySection}

            <div className="mt-auto">
              <button
                onClick={downloadReport}
                className="w-full px-4 py-3 !bg-blue-950 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors"
                aria-label="Download full report"
              >
                Download Full Report
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5 w-2/3">
            {snippetsSection}
          </div>
        </div>
      </main>
    </div>
  );  
}