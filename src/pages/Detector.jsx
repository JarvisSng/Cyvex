// detector.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
const detectionRules = {
  JavaScript: {
    // Put \b before "crypto" or "MessageDigest" etc. to avoid partial matches like "mycrypto"
    // AES
    AES: /\bcrypto\.(?:createCipheriv|createCipher)\s*\(\s*['"]aes-\d+-cbc['"]/i,

    // RSA (Weak Key) before RSA
    "RSA (Weak Key)": /\bcrypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]\s*,\s*\{\s*[^}]*modulusLength\s*:\s*(512|1024)/i,
    RSA: /\bcrypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]\s*,\s*\{\s*[^}]*modulusLength\s*:\s*(?!.*(512|1024))\d+/i,

    // SHA-1, SHA-256, MD5, HMAC
    "SHA-1": /\bcrypto\.createHash\s*\(\s*['"]sha1['"]\s*\)/i,
    "SHA-256": /\bcrypto\.createHash\s*\(\s*['"]sha256['"]\s*\)/i,
    MD5: /\bcrypto\.createHash\s*\(\s*['"]md5['"]\s*\)/i,
    HMAC: /\bcrypto\.createHmac\s*\(\s*['"]sha\d+['"]\s*,/i,

    // DES
    DES: /\bcrypto\.createCipher\s*\(\s*['"]des(?:-\d+)?-cbc['"]\s*,/i,

    // Hardcoded Key
    "Hardcoded Key": /\b(?:const|let|var)\s+\w*(?:key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i,
  },

  Python: {
    // RSA (Weak Key) first
    "RSA (Weak Key)": /\bRSA\.generate\s*\(\s*(512|1024)(?:[^)]*)\)/i,
    RSA: /\bRSA\.generate\s*\(\s*(?!512|1024)\d+(?:[^)]*)\)/i,

    AES: /\bAES\.new\(/i,
    "SHA-1": /\bhashlib\.sha1\(|\bhashlib\.new\(['"]sha1['"]\)/i,
    "SHA-256": /\bhashlib\.sha256\(|\bhashlib\.new\(['"]sha256['"]\)/i,
    MD5: /\bhashlib\.md5\(|\bhashlib\.new\(['"]md5['"]\)/i,
    HMAC: /\bhmac\.new\(\s*.*,\s*hashlib\.sha\d+/i,
    DES: /\bDES\.new\(/i,
    "Hardcoded Key": /\b\w*(?:key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i,
  },

  Java: {
    // RSA (Weak Key) first
    "RSA (Weak Key)": /\bKeyPairGenerator\.getInstance\(\s*"RSA"\s*\)\.initialize\(\s*(512|1024)/i,
    RSA: /\bKeyPairGenerator\.getInstance\(\s*"RSA"\s*\)(?!.*(512|1024))/i,

    AES: /\bCipher\.getInstance\(\s*"AES/i,
    "SHA-1": /\bMessageDigest\.getInstance\(\s*"SHA-1"/i,
    "SHA-256": /\bMessageDigest\.getInstance\(\s*"SHA-256"/i,
    MD5: /\bMessageDigest\.getInstance\(\s*"MD5"/i,
    HMAC: /\bMac\.getInstance\(\s*"HmacSHA\d+"/i,
    DES: /\bCipher\.getInstance\(\s*"DES/i,
    "Hardcoded Key": /\b(?:String|char\s*\[\])\s+\w+\s*=\s*['"][^'"]{5,}['"]/i,
  },

  "C/C++": {
    // RSA (Weak Key) first
    "RSA (Weak Key)": /\bRSA_generate_key\s*\(\s*(512|1024)/i,
    RSA: /\bRSA_generate_key\s*\(\s*(?!.*(512|1024))/i,

    AES: /\bAES_set_encrypt_key\(/i,
    "SHA-1": /\bSHA1\s*\(/i,
    "SHA-256": /\bSHA256\s*\(/i,
    MD5: /\bMD5_Init\(|\bMD5_Update\(|\bMD5_Final\(/i,
    HMAC: /\bHMAC_Init_ex\(/i,
    DES: /\bDES_set_key_checked\(|\bDES_ecb_encrypt\(/i,
    "Hardcoded Key": /\b(?:char|const\s+char\*)\s+\w*(?:key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i,
  },
};

export default function Detector() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  // For demo, we always pick Python. Adapt as needed for real detection or user selection.
  const detectLanguage = () => "Python";

  const handleScan = () => {
    const language = detectLanguage();
    const rulesForLanguage = detectionRules[language] || {};

    const lines = code.split("\n");
    const detectedCryptographicFunctions = [];
    const securityWarnings = [];
    const snippets = [];

    lines.forEach((lineContent, index) => {
      // 1) Skip full comment lines
      if (isCommentLine(lineContent)) return;

      // 2) Strip inline comments
      const processedLine = stripInlineComment(lineContent);

      // 3) Only proceed if the line has "(" to reduce false positives
      if (!processedLine.includes("(")) return;

      // 4) Check each rule in the order listed
      Object.entries(rulesForLanguage).forEach(([ruleName, regex]) => {
        if (regex.test(processedLine)) {
          // If not already detected
          if (!detectedCryptographicFunctions.includes(ruleName)) {
            detectedCryptographicFunctions.push(ruleName);
          }
          // Add snippet
          snippets.push({
            line: index + 1,
            code: lineContent,
            rule: ruleName,
          });
        }
      });
    });

    // 5) Security warnings
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

    // 6) Build the report object
    const report = {
      language,
      codeLength: code.length,
      detectedCryptographicFunctions,
      securityWarnings,
      snippets,
    };

    // 7) Navigate to /report
    navigate("/report", { state: { report } });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Detector</h1>
      <p>Paste or type your code below, then click "Scan".</p>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        cols={60}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <button
        onClick={handleScan}
        style={{
          padding: "10px",
          backgroundColor: "navy",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Scan
      </button>
    </div>
  );
}
