import React, { useState } from 'react';
import CodeUploader from '../components/CodeUploader';
import AnalyticsReport from '../components/AnalyticsReport';
import RulesEditor from '../components/RulesEditor';

const Detector = () => {
  const [codeContent, setCodeContent] = useState('');
  const [report, setReport] = useState(null);
  const [fileType, setFileType] = useState('');
  const [fileExt, setFileExt] = useState('');

  // Define the complete list of rules
  const allRules = [
    'AES', 'RSA', 'SHA', 'SHA-1', 'MD5', 'HMAC', 'DES', 'Hardcoded Key', 'RSA (Weak Key)'
  ];
  // Start with all rules selected by default
  const [rules, setRules] = useState([...allRules]);

  // Multi-language detection rules with improved regexes
  const detectionRules = {
    'JavaScript': {
      'AES': /crypto\.createCipher\s*\(\s*['"]aes-\d+-cbc['"]\s*,/i,
      'RSA': /crypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]/i,
      'SHA-1': /crypto\.createHash\s*\(\s*['"]sha1['"]\s*\)/i,
      'MD5': /crypto\.createHash\s*\(\s*['"]md5['"]\s*\)/i,
      'Hardcoded Key': /(?:const|let|var)\s+\w+\s*=\s*['"][^'"]{5,}['"]\s*;/i
    },
    'Python': {
      'AES': /AES\.new\(/i,
      'RSA': /RSA\.generate\(/i,
      'SHA-1': /hashlib\.sha1\(|hashlib\.new\(['"]sha1['"]\)/i,
      'MD5': /hashlib\.md5\(|hashlib\.new\(['"]md5['"]\)/i,
      // Updated regex: case-insensitive; matches any variable name containing key, password, or secret
      'Hardcoded Key': /\b\w*(key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i
    },
    'Java': {
      'AES': /Cipher\.getInstance\("AES/i,
      'RSA': /KeyPairGenerator\.getInstance\("RSA/i,
      'SHA-1': /MessageDigest\.getInstance\("SHA-1/i,
      'MD5': /MessageDigest\.getInstance\("MD5/i,
      'Hardcoded Key': /\b(?:String|char\s*\[\])\s+\w+\s*=\s*['"][^'"]{5,}['"]/i
    },
    'C/C++': {
      'AES': /AES_set_encrypt_key\(/i,
      'RSA': /RSA_generate_key\(/i,
      // Updated regex: now matches any occurrence of SHA1 followed by optional spaces and an opening parenthesis
      'SHA-1': /SHA1\s*\(/i,
      'MD5': /MD5_Init\(/i,
      'Hardcoded Key': /\b(?:char|const\s+char\*)\s+\w+\s*=\s*['"][^'"]{5,}['"]/i
    }
  };

  // Analyze code using the file extension to determine language
  const analyzeCode = (code, ext) => {
    let detected = [];
    // Map file extension to language
    const language = {
      'js': 'JavaScript',
      'py': 'Python',
      'java': 'Java',
      'c': 'C/C++',
      'cpp': 'C/C++'
    }[ext] || 'Unknown';

    setFileType(language);
    setFileExt(ext);

    const selectedRules = detectionRules[language] || {};

    // Only check rules that are currently enabled
    Object.entries(selectedRules).forEach(([rule, regex]) => {
      if (rules.includes(rule) && regex.test(code)) {
        detected.push(rule);
      }
    });

    // Prepare security warnings
    const securityWarnings = [];
    if (detected.includes('Hardcoded Key')) securityWarnings.push("Avoid storing keys in source code.");
    if (detected.includes('SHA-1')) securityWarnings.push("SHA-1 is weak.");
    if (detected.includes('MD5')) securityWarnings.push("MD5 is vulnerable to hash collisions.");

    setReport({
      language,
      codeLength: code.length,
      detectedCryptographicFunctions: detected,
      securityWarnings,
      timestamp: new Date().toLocaleString(),
    });

    // Save code content for report regeneration
    setCodeContent(code);
  };

  // Callback for file uploader; receives both content and file extension
  const handleFileUpload = (fileContent, ext) => {
    analyzeCode(fileContent, ext);
  };

  // Regenerate report using stored code content and file extension
  const regenerateReport = () => {
    if (codeContent && fileExt) {
      analyzeCode(codeContent, fileExt);
    }
  };

  // Toggle a rule on or off
  const toggleRule = (rule) => {
    setRules(prevRules =>
      prevRules.includes(rule)
        ? prevRules.filter(r => r !== rule)
        : [...prevRules, rule]
    );
  };

  // Select all rules
  const addAllRules = () => {
    setRules([...allRules]);
  };

  // Deselect all rules
  const removeAllRules = () => {
    setRules([]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cryptographic Function Detector</h1>
      <CodeUploader onFileUpload={handleFileUpload} />

      <div style={{ marginTop: '20px' }}>
        <h3>Define Rules / Patterns</h3>
        {allRules.map((rule) => (
          <label key={rule} style={{ display: 'block', marginBottom: '5px' }}>
            <input
              type="checkbox"
              checked={rules.includes(rule)}
              onChange={() => toggleRule(rule)}
            />
            {rule}
          </label>
        ))}
        <button
          onClick={addAllRules}
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '5px'
          }}
        >
          Add All
        </button>
        <button
          onClick={removeAllRules}
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Remove All
        </button>
      </div>

      {fileType && <p><strong>Detected File Type:</strong> {fileType}</p>}

      {/* Always show regenerate report button if a file has been uploaded */}
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
