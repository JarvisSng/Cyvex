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

export default function ViewResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
  const [activeTab, setActiveTab] = useState("/report"); // Set default active tab

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const login = () => {
    navigate("/login/email");
  }

  const detector = () => {
    navigate("/detector");
  }

	// Highlights which tab is active
	const handleTabClick = (path) => {
		setActiveTab(path);
		navigate(path);
	};

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
    <>
      {/* Header (Fixed at the Top) */}
      <header className="bg-blue-950 fixed top-0 left-0 w-full py-4 px-8 shadow-md z-50 h-20">
        <div className="flex items-center justify-between w-full h-full">
          
          {/* Logo (Left) */}
          <h2 className="text-stone-50 text-4xl font-bold flex items-center">cyvex</h2>
  
          {/* Navigation Links (Centered) */}
          <nav className="flex items-center gap-8">
            <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">solutions</h2>
            <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">customers</h2>
            <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">services</h2>
            <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">insights</h2>
            <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">company</h2>
          </nav>
  
          {/* Buttons (Right) */}
          <div className="flex items-center gap-4">
            <button 
              onClick={login}
              className="w-32 bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Login
            </button>
            <button 
              onClick={detector}
              className="w-32 bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Try It
            </button>
          </div>
        </div>
      </header>
  
      {/* ====== Layout: Sidebar + Main Content ====== */}
      <div className="flex pt-20"> {/* Adding pt-20 to make space for the fixed header */}
        {/* Left Sidebar */}
				<aside className="w-64 h-screen bg-gray-200 p-6 fixed top-20 left-0">
					<nav className="flex flex-col gap-4">
						<button
							onClick={() => handleTabClick("/detector")}
							className={`p-2 rounded-md text-left ${
								activeTab === "/detector" ? "!bg-blue-950 text-white" : "hover:bg-gray-300"
							}`}
						>
							Upload Code
						</button>
						<button
							onClick={() => handleTabClick("/report")}
							className={`p-2 rounded-md text-left ${
								activeTab === "/report" ? "!bg-blue-950 text-white" : "hover:bg-gray-300"
							}`}
						>
							View Results
						</button>
					</nav>
				</aside>

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
