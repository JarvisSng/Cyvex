import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // The analysis data from navigate("/report", { state: { report, rules } })
  const reportData = location.state?.report || null;
  const rules = location.state?.rules || [];

  // Debug: Log snippets to ensure they are being passed correctly
  console.log("Report snippets:", reportData ? reportData.snippets : "No reportData");

  // If no data was passed, show a "no report" message
  if (!reportData) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>No Report Data Available</h2>
        <button
          onClick={() => navigate("/detector")}
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "navy",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Detector
        </button>
      </div>
    );
  }

  /**
   * Generates a .txt file containing the report data
   */
  const downloadReport = () => {
    let reportContent = `Analysis Report\n\n`;
    reportContent += `Language Detected: ${reportData.language}\n`;
    reportContent += `Code Length: ${reportData.codeLength} characters\n\n`;

    reportContent += `Detected Cryptographic Functions:\n`;
    reportData.detectedCryptographicFunctions.forEach((func) => {
      reportContent += `- ${func}\n`;
    });

    reportContent += `\nSecurity Warnings:\n`;
    if (reportData.securityWarnings.length > 0) {
      reportData.securityWarnings.forEach((warning) => {
        reportContent += `- ${warning}\n`;
      });
    } else {
      reportContent += "None\n";
    }

    reportContent += `\nRecommended Alternatives:\n`;
    if (reportData.detectedCryptographicFunctions.includes("MD5")) {
      reportContent += `- Use SHA-256 instead of MD5\n`;
    }
    if (reportData.detectedCryptographicFunctions.includes("SHA-1")) {
      reportContent += `- Use SHA-256 instead of SHA-1\n`;
    }
    if (reportData.detectedCryptographicFunctions.includes("DES")) {
      reportContent += `- Use AES instead of DES\n`;
    }
    if (reportData.detectedCryptographicFunctions.includes("Hardcoded Key")) {
      reportContent += `- Use environment variables or a secure key management system instead of hardcoded keys\n`;
    }
    if (reportData.detectedCryptographicFunctions.includes("RSA (Weak Key)")) {
      reportContent += `- Use RSA with at least 2048 bits\n`;
    }

    reportContent += `\nCode Snippets:\n`;
    if (reportData.snippets && reportData.snippets.length > 0) {
      reportData.snippets.forEach((snippet) => {
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
      <h1>Analysis Report</h1>

      <h3>Code Details:</h3>
      <p>
        <strong>Language Detected:</strong> {reportData.language}
      </p>
      <p>
        <strong>Code Length:</strong> {reportData.codeLength} characters
      </p>

      <h3>
        <strong>Detected Cryptographic Functions:</strong>
      </h3>
      {reportData.detectedCryptographicFunctions.length > 0 ? (
        <ul>
          {reportData.detectedCryptographicFunctions.map((func, index) => (
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
      {reportData.securityWarnings.length > 0 ? (
        <ul>
          {reportData.securityWarnings.map((warning, index) => (
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
        {reportData.detectedCryptographicFunctions.includes("MD5") && (
          <li>Use SHA-256 instead of MD5</li>
        )}
        {reportData.detectedCryptographicFunctions.includes("SHA-1") && (
          <li>Use SHA-256 instead of SHA-1</li>
        )}
        {reportData.detectedCryptographicFunctions.includes("DES") && (
          <li>Use AES instead of DES</li>
        )}
        {reportData.detectedCryptographicFunctions.includes("Hardcoded Key") && (
          <li>
            Use environment variables or a secure key management system instead of hardcoded keys
          </li>
        )}
        {reportData.detectedCryptographicFunctions.includes("RSA (Weak Key)") && (
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
      {reportData.snippets && reportData.snippets.length > 0 ? (
        reportData.snippets.map((snippet, index) => {
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
          onClick={() => navigate("/detector")}
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
          Back to Detector
        </button>

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
    <div className="page-wrapper" style={{ color: "#333" }}>
      {/* ====== Top Navigation Bar ====== */}
      <header className="top-nav">
        <div className="nav-left">
          <a href="#" className="nav-brand">
            cyvex
          </a>
          <nav className="nav-links">
            <a href="#">solutions</a>
            <a href="#">customers</a>
            <a href="#">services</a>
            <a href="#">insights</a>
            <a href="#">company</a>
          </nav>
        </div>
        <div className="nav-right">
          <button className="login-btn">log in</button>
          <button className="try-btn">try it</button>
        </div>
      </header>

      {/* ====== Layout: Sidebar + Main Content ====== */}
      <div className="layout">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <a href="#">upload code</a>
          <a href="#">view results</a>
          <a href="#">view reports</a>
          <a href="#">settings</a>
          <a href="#">log out</a>
        </aside>

        {/* Main Content => Two-Column Design */}
        <main className="main-content" style={{ backgroundColor: "#fff" }}>
          {/* Row of tabs: "pending scans" / "completed scans" */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                fontWeight: "bold",
                backgroundColor: "navy",
                color: "white",
                cursor: "pointer",
              }}
            >
              pending scans
            </button>
            <button
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                fontWeight: "bold",
                backgroundColor: "darkblue",
                color: "white",
                cursor: "pointer",
              }}
            >
              completed scans
            </button>
          </div>

          {/* Two columns: left = logs + analysis placeholders, right = actual analysis */}
          <div style={{ display: "flex", gap: "20px" }}>
            {/* Left Column */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#f9f9f9",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              {/* Real-time log updates */}
              <h3>real-time log updates</h3>
              <p>status: completed</p>
              <p>... (placeholder for logs) ...</p>

              {/* cyvex analysis block */}
              <div style={{ marginTop: "20px" }}>
                <h3>cyvex analysis</h3>
                <p>scanned for cryptographic functions</p>
                <p>... (placeholder) ...</p>
              </div>

              {/* pagination at bottom */}
              <div
                style={{
                  marginTop: "30px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "30px",
                    height: "30px",
                    lineHeight: "30px",
                    background: "navy",
                    color: "white",
                    margin: "0 5px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  1
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "30px",
                    height: "30px",
                    lineHeight: "30px",
                    background: "navy",
                    color: "white",
                    margin: "0 5px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  2
                </span>
              </div>
            </div>

            {/* Right Column => Analysis Report */}
            <div
              style={{
                flex: 2,
                backgroundColor: "#fff",
                borderRadius: "5px",
              }}
            >
              {analysisReport}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
