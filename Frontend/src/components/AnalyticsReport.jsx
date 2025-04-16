import React from 'react';

const AnalyticsReport = ({ report }) => {
  if (!report) return null;

  const vulnerabilities = [];

  // Add warnings based on detected cryptographic functions
  if (report.detectedCryptographicFunctions.includes("Hardcoded Key")) {
    vulnerabilities.push("Hardcoded encryption keys found. Avoid storing keys in source code.");
  }
  if (report.detectedCryptographicFunctions.includes("SHA-1")) {
    vulnerabilities.push("SHA-1 is considered weak and should not be used.");
  }
  if (report.detectedCryptographicFunctions.includes("MD5")) {
    vulnerabilities.push("MD5 is vulnerable to hash collisions and should be avoided.");
  }
  if (report.detectedCryptographicFunctions.includes("RSA (Weak Key)")) {
    vulnerabilities.push("RSA keys should be at least 2048 bits for security.");
  }
  if (report.detectedCryptographicFunctions.includes("DES")) {
    vulnerabilities.push("DES is outdated and insecure. Use AES instead.");
  }

  const downloadReport = () => {
  let reportText = `Analysis Summary\n\n`;
  reportText += `Code Length: ${report.codeLength} characters\n\n`;
  reportText += `Detected Cryptographic Functions:\n`;

  if (report.detectedCryptographicFunctions.length > 0) {
    report.detectedCryptographicFunctions.forEach((func) => {
      reportText += `- ${func}\n`;
    });
  } else {
    reportText += "No cryptographic functions detected.\n";
  }

  if (vulnerabilities.length > 0) {
    reportText += `\nSecurity Warnings:\n`;
    vulnerabilities.forEach((warning) => {
      reportText += `- ${warning}\n`;
    });
  }

  reportText += `\nReport Generated: ${report.timestamp}\n`;

  const blob = new Blob([reportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'report.txt'; 
  link.click();
};


  return (
    <div style={{ marginTop: '20px', padding: '15px', background: '#222', color: '#fff', borderRadius: '5px' }}>
      <h2>Analysis Summary</h2>
      <p><strong>Code Length:</strong> {report.codeLength} characters</p>
      
      <p><strong>Detected Cryptographic Functions:</strong></p>
      <ul>
        {report.detectedCryptographicFunctions.length > 0 ? (
          report.detectedCryptographicFunctions.map((func, index) => (
            <li key={index} style={{ fontWeight: 'bold', color: '#ffcc00' }}>{func}</li>
          ))
        ) : (
          <li style={{ fontStyle: 'italic', color: '#bbb' }}>No cryptographic functions detected.</li>
        )}
      </ul>

      {vulnerabilities.length > 0 && (
        <>
          <p><strong>Security Warnings:</strong></p>
          <ul style={{ color: 'red' }}>
            {vulnerabilities.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </>
      )}

      <p><strong>Report Generated:</strong> {report.timestamp}</p>
      <button onClick={downloadReport} style={{ marginTop: '10px', padding: '10px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Save Report
      </button>
    </div>
  );
};

export default AnalyticsReport;
