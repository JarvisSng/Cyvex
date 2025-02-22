import React, { useState } from 'react';
import CodeUploader from '../components/CodeUploader';
import AnalyticsReport from '../components/AnalyticsReport';
import RulesEditor from '../components/RulesEditor';

const Detector = () => {
  const [codeContent, setCodeContent] = useState('');
  const [report, setReport] = useState(null);

  //  List of available rules
  const [rules, setRules] = useState([
    'AES', 'RSA', 'SHA', 'SHA-1', 'MD5', 'HMAC', 'DES', 'Hardcoded Key', 'RSA (Weak Key)'
  ]);

  //  Detection rules with corresponding regex patterns
  const detectionRules = {
    'AES': /crypto\.createCipher\s*\(\s*['"]aes-\d+-cbc['"]\s*,/i,
    'RSA': /crypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]/i,
    'SHA-1': /crypto\.createHash\s*\(\s*['"]sha1['"]\s*\)/i,
    'MD5': /crypto\.createHash\s*\(\s*['"]md5['"]\s*\)/i,
    'HMAC': /crypto\.createHmac\s*\(\s*['"]sha\d+['"]\s*,/i,
    'DES': /crypto\.createCipher\s*\(\s*['"]des-ede3['"]\s*,/i,
    'Hardcoded Key': /(?:const|let|var)\s+\w+\s*=\s*['"][^'"]{5,}['"]\s*;/i,
    'RSA (Weak Key)': /crypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]\s*,\s*{[^}]*modulusLength\s*:\s*(512|1024)/i,
  };

  const analyzeCode = (code) => {
    let detected = [];

    //  Only check selected rules
    Object.entries(detectionRules).forEach(([rule, regex]) => {
      if (rules.includes(rule) && regex.test(code)) {
        detected.push(rule);
      }
    });

    //  Generate security warnings
    const securityWarnings = [];
    if (detected.includes('Hardcoded Key')) {
      securityWarnings.push("Hardcoded encryption keys found. Avoid storing keys in source code.");
    }
    if (detected.includes('SHA-1')) {
      securityWarnings.push("SHA-1 is considered weak and should not be used.");
    }
    if (detected.includes('MD5')) {
      securityWarnings.push("MD5 is vulnerable to hash collisions and should be avoided.");
    }
    if (detected.includes('RSA (Weak Key)')) {
      securityWarnings.push("RSA keys should be at least 2048 bits for security.");
    }
    if (detected.includes('DES')) {
      securityWarnings.push("DES is outdated and insecure. Use AES instead.");
    }

    const newReport = {
      codeLength: code.length,
      detectedCryptographicFunctions: detected,
      securityWarnings: securityWarnings,
      timestamp: new Date().toLocaleString(),
    };

    setReport(newReport);
  };

  const handleFileUpload = (fileContent) => {
    setCodeContent(fileContent);
    analyzeCode(fileContent);
  };

  const regenerateReport = () => {
    if (codeContent) {
      analyzeCode(codeContent); //  Re-analyze using currently selected rules
    }
  };

  const toggleRule = (rule) => {
    setRules(prevRules =>
      prevRules.includes(rule)
        ? prevRules.filter(r => r !== rule)  // Remove rule if already selected
        : [...prevRules, rule]  // Add rule if not selected
    );
  };

  const removeAllRules = () => {
    setRules([]);  // Clears all rules
  };

  const addAllRules = () => {
    setRules([
      'AES', 'RSA', 'SHA', 'SHA-1', 'MD5', 'HMAC', 'DES', 'Hardcoded Key', 'RSA (Weak Key)'
    ]);  //  Now includes SHA
};

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cryptographic Function Detector</h1>
      <CodeUploader onFileUpload={handleFileUpload} />
      <RulesEditor 
        rules={rules} 
        toggleRule={toggleRule} 
        removeAllRules={removeAllRules} 
        addAllRules={addAllRules} 
      />

      {codeContent && (
        <button
          onClick={regenerateReport}
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          Regenerate Report
        </button>
      )}

      {report && <AnalyticsReport report={report} />}
    </div>
  );
};

export default Detector;
