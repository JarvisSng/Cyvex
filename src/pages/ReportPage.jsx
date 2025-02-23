import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportData = location.state?.report || null;
  const rules = location.state?.rules || [];

  // A small map of recommended actions for insecure rules
  const recommendedMap = {
    "MD5": "Use SHA-256 instead of MD5",
    "SHA-1": "Use SHA-256 instead of SHA-1",
    "DES": "Use AES instead of DES",
    "Hardcoded Key": "Use environment variables or a secure key management system instead of hardcoded keys",
    "RSA (Weak Key)": "Use RSA with at least 2048 bits",
  };

  // Track which snippet index is hovered, so we can show a tooltip
  const [hoveredSnippet, setHoveredSnippet] = useState(null);

  if (!reportData) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>No Report Data Available</h2>
        <button
          onClick={() => navigate('/detector')}
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Back to Detector
        </button>
      </div>
    );
  }

  // Generate and download .txt report
  const downloadReport = () => {
    let reportContent = `Analysis Report\n\n`;
    reportContent += `Language Detected: ${reportData.language}\n`;
    reportContent += `Code Length: ${reportData.codeLength} characters\n\n`;

    reportContent += `Detected Cryptographic Functions:\n`;
    reportData.detectedCryptographicFunctions.forEach(func => {
      reportContent += `- ${func}\n`;
    });
    
    reportContent += `\nSecurity Warnings:\n`;
    if (reportData.securityWarnings.length > 0) {
      reportData.securityWarnings.forEach(warning => {
        reportContent += `- ${warning}\n`;
      });
    } else {
      reportContent += "None\n";
    }

    reportContent += `\nRecommended Alternatives:\n`;
    if (reportData.detectedCryptographicFunctions.includes('MD5')) {
      reportContent += `- Use SHA-256 instead of MD5\n`;
    }
    if (reportData.detectedCryptographicFunctions.includes('SHA-1')) {
      reportContent += `- Use SHA-256 instead of SHA-1\n`;
    }
    if (reportData.detectedCryptographicFunctions.includes('DES')) {
      reportContent += `- Use AES instead of DES\n`;
    }
    if (reportData.detectedCryptographicFunctions.includes('Hardcoded Key')) {
      reportContent += `- Use environment variables or a secure key management system instead of hardcoded keys\n`;
    }
    if (reportData.detectedCryptographicFunctions.includes('RSA (Weak Key)')) {
      reportContent += `- Use RSA with at least 2048 bits\n`;
    }

    reportContent += `\nCode Snippets:\n`;
    if (reportData.snippets.length > 0) {
      reportData.snippets.forEach(snippet => {
        reportContent += `Line ${snippet.line}: ${snippet.code}\n`;
      });
    } else {
      reportContent += "No relevant code snippets found.\n";
    }

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Analysis_Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif', 
        color: '#f4f4f4',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <h1>Analysis Report</h1>
      <h3>Code Details:</h3>
      <p><strong>Language Detected:</strong> {reportData.language}</p>
      <p><strong>Code Length:</strong> {reportData.codeLength} characters</p>

      <h3><strong>Detected Cryptographic Functions:</strong></h3>
      {reportData.detectedCryptographicFunctions.length > 0 ? (
        <ul>
          {reportData.detectedCryptographicFunctions.map((func, index) => (
            <li 
              key={index}
              style={{ 
                color: ['MD5','SHA-1','DES','Hardcoded Key','RSA (Weak Key)'].includes(func) 
                  ? 'red' 
                  : 'green' 
              }}
            >
              {func}
            </li>
          ))}
        </ul>
      ) : (
        <p>No cryptographic functions detected.</p>
      )}

      <h3><strong>Security Warnings:</strong></h3>
      {reportData.securityWarnings.length > 0 ? (
        <ul>
          {reportData.securityWarnings.map((warning, index) => (
            <li key={index} style={{ color: 'red' }}>{warning}</li>
          ))}
        </ul>
      ) : (
        <p>No security warnings.</p>
      )}

      <h3><strong>Recommended Alternatives:</strong></h3>
      <ul>
        {reportData.detectedCryptographicFunctions.includes('MD5') && <li>Use SHA-256 instead of MD5</li>}
        {reportData.detectedCryptographicFunctions.includes('SHA-1') && <li>Use SHA-256 instead of SHA-1</li>}
        {reportData.detectedCryptographicFunctions.includes('DES') && <li>Use AES instead of DES</li>}
        {reportData.detectedCryptographicFunctions.includes('Hardcoded Key') && <li>Use environment variables or a secure key management system instead of hardcoded keys</li>}
        {reportData.detectedCryptographicFunctions.includes('RSA (Weak Key)') && <li>Use RSA with at least 2048 bits</li>}
      </ul>

      <h3><strong>Code Snippets:</strong></h3>
      {reportData.snippets && reportData.snippets.length > 0 ? (
        reportData.snippets.map((snippet, index) => {
          const snippetBg = snippet.secure ? '#ccffcc' : '#ffcccc'; // green if secure, red if insecure
          const textColor = snippet.secure ? '#000' : '#800';       // black if secure, dark red if insecure
          
          // recommended action if snippet is insecure
          const recAction = !snippet.secure && recommendedMap[snippet.rule] 
            ? recommendedMap[snippet.rule] 
            : null;

          return (
            <div
              key={index}
              style={{ 
                position: 'relative',
                margin: '10px 0', 
                borderRadius: '5px',
                backgroundColor: snippetBg,
                border: '1px solid #666',
                padding: '10px'
              }}
              onMouseEnter={() => setHoveredSnippet(index)}
              onMouseLeave={() => setHoveredSnippet(null)}
            >
              <p style={{ fontWeight: 'bold', color: textColor, marginBottom: '5px' }}>
                Line {snippet.line} ({snippet.rule}):
              </p>
              <pre style={{
                color: textColor,
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Courier New, monospace',
                margin: 0
              }}>
                {snippet.code}
              </pre>

              {/* Show a tooltip if hovered, insecure, and we have a recommended action */}
              {hoveredSnippet === index && !snippet.secure && recAction && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: '105%',
                  backgroundColor: '#333',
                  color: '#fff',
                  padding: '8px',
                  borderRadius: '5px',
                  width: '200px'
                }}>
                  <strong>{snippet.rule}</strong>:
                  <div style={{ marginTop: '5px' }}>
                    {recAction}
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>No relevant code snippets found.</p>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button
          onClick={() => navigate('/detector')}
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Back to Detector
        </button>

        <button
          onClick={downloadReport}
          style={{
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ReportPage;
