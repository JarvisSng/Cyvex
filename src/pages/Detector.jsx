import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeUploader from '../components/CodeUploader';

const Detector = () => {
  const navigate = useNavigate();

  // Full list of rules
  const allRules = [
    'AES', 
    'RSA', 
    'RSA (Weak Key)',
    'SHA', 
    'SHA-1', 
    'MD5', 
    'HMAC', 
    'DES', 
    'Hardcoded Key'
  ];

  // States
  const [codeContent, setCodeContent] = useState('');
  const [fileExt, setFileExt] = useState('');
  const [fileType, setFileType] = useState(''); // RE-INTRODUCED
  const [rules, setRules] = useState([...allRules]);

  // Improved detection rules for each language
  const detectionRules = {
    'JavaScript': {
      'AES': /crypto\.(?:createCipheriv|createCipher)\s*\(\s*['"]aes-\d+-cbc['"]/i,
      'RSA (Weak Key)': /crypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]\s*,\s*\{\s*[^}]*modulusLength\s*:\s*(512|1024)/i,
      'RSA': /crypto\.generateKeyPairSync\s*\(\s*['"]rsa['"]\s*,\s*\{\s*[^}]*modulusLength\s*:\s*(?!.*(512|1024))\d+/i,
      'SHA': /crypto\.createHash\s*\(\s*['"]sha256['"]\s*\)/i,
      'SHA-1': /crypto\.createHash\s*\(\s*['"]sha1['"]\s*\)/i,
      'MD5': /crypto\.createHash\s*\(\s*['"]md5['"]\s*\)/i,
      'HMAC': /crypto\.createHmac\s*\(\s*['"]sha\d+['"]\s*,/i,
      'DES': /crypto\.createCipher\s*\(\s*['"]des(?:-\d+)?-cbc['"]\s*,/i,
      'Hardcoded Key': /(?:const|let|var)\s+\w*(?:key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i
    },
    'Python': {
      'AES': /AES\.new\(/i,
      'RSA (Weak Key)': /RSA\.generate\s*\(\s*(512|1024)/i,
      'RSA': /RSA\.generate\s*\(\s*(?!.*(512|1024))/i,
      'SHA-1': /hashlib\.sha1\(|hashlib\.new\(['"]sha1['"]\)/i,
      'SHA': /hashlib\.sha256\(|hashlib\.new\(['"]sha256['"]\)/i,
      'MD5': /hashlib\.md5\(|hashlib\.new\(['"]md5['"]\)/i,
      'HMAC': /hmac\.new\(\s*.*,\s*hashlib\.sha\d+/i,
      'DES': /DES\.new\(/i,
      'Hardcoded Key': /\b\w*(?:key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i
    },
    'Java': {
      'AES': /Cipher\.getInstance\(\s*"AES/i,
      'RSA (Weak Key)': /KeyPairGenerator\.getInstance\(\s*"RSA"\s*\)\.initialize\(\s*(512|1024)/i,
      'RSA': /KeyPairGenerator\.getInstance\(\s*"RSA"\s*\)(?!.*(512|1024))/i,
      'SHA-1': /MessageDigest\.getInstance\(\s*"SHA-1"/i,
      'SHA': /MessageDigest\.getInstance\(\s*"SHA-256"/i,
      'MD5': /MessageDigest\.getInstance\(\s*"MD5"/i,
      'HMAC': /Mac\.getInstance\(\s*"HmacSHA\d+"/i,
      'DES': /Cipher\.getInstance\(\s*"DES/i,
      'Hardcoded Key': /\b(?:String|char\s*\[\])\s+\w+\s*=\s*['"][^'"]{5,}['"]/i
    },
    'C/C++': {
      'AES': /AES_set_encrypt_key\(/i,
      'RSA (Weak Key)': /RSA_generate_key\s*\(\s*(512|1024)/i,
      'RSA': /RSA_generate_key\s*\(\s*(?!.*(512|1024))/i,
      'SHA-1': /SHA1\s*\(/i,
      'SHA': /SHA256\s*\(/i,
      'MD5': /MD5_Init\(|MD5_Update\(|MD5_Final\(/i,
      'HMAC': /HMAC_Init_ex\(/i,
      'DES': /DES_set_key_checked\(|DES_ecb_encrypt\(/i,
      'Hardcoded Key': /\b(?:char|const\s+char\*)\s+\w*(?:key|password|secret)\w*\s*=\s*['"][^'"]{5,}['"]/i
    }
  };

  // Merge lines into statements
  const parseStatements = (lines) => {
    const statements = [];
    let buffer = [];
    let startLine = 0;

    const statementEndRegex = /;\s*$|;\s*\}\s*$|\);\s*$|},?\s*$/;

    for (let i = 0; i < lines.length; i++) {
      buffer.push(lines[i]);
      if (statementEndRegex.test(lines[i])) {
        statements.push({
          start: startLine,
          end: i,
          code: buffer.join('\n')
        });
        buffer = [];
        startLine = i + 1;
      }
    }

    if (buffer.length > 0) {
      statements.push({
        start: startLine,
        end: lines.length - 1,
        code: buffer.join('\n')
      });
    }
    return statements;
  };

  // Extract snippets in the order of the allRules array
  const extractSnippetsOrdered = (code, language) => {
    const lines = code.split('\n');
    const statements = parseStatements(lines);
    const selectedRules = detectionRules[language] || {};
    let snippetMatches = [];

    for (const rule of allRules) {
      if (!rules.includes(rule)) continue;
      const regex = selectedRules[rule];
      if (!regex) continue;

      statements.forEach(stmt => {
        if (regex.test(stmt.code)) {
          snippetMatches.push({
            rule,
            line: stmt.start + 1,
            code: stmt.code.trim(),
            secure: !['MD5','SHA-1','DES','Hardcoded Key','RSA (Weak Key)'].includes(rule)
          });
        }
      });
    }
    return snippetMatches;
  };

  // Detect language from code
  const detectLanguage = (code) => {
    if (/import\s+crypto|crypto\./.test(code)) return 'JavaScript';
    if (/from\s+Crypto|import\s+hashlib|AES\.new\(/i.test(code)) return 'Python';
    if (/import\s+javax\.crypto|Cipher\.getInstance\(/.test(code)) return 'Java';
    if (/#include\s+<openssl\//.test(code)) return 'C/C++';
    return 'Unknown';
  };

  // Analyze code
  const analyzeCode = () => {
    if (!codeContent.trim()) return;

    // Determine language
    const language = fileExt
      ? {
          'js': 'JavaScript',
          'py': 'Python',
          'java': 'Java',
          'c': 'C/C++',
          'cpp': 'C/C++'
        }[fileExt] || 'Unknown'
      : detectLanguage(codeContent);

    // RE-INTRODUCED setFileType
    setFileType(language);

    // Extract snippet matches
    const snippetMatches = extractSnippetsOrdered(codeContent, language);

    // Determine which rules were found
    let detected = [];
    snippetMatches.forEach(s => {
      if (!detected.includes(s.rule)) {
        detected.push(s.rule);
      }
    });

    // Build security warnings
    const securityWarnings = [];
    if (detected.includes('Hardcoded Key')) {
      securityWarnings.push("Avoid storing keys in source code.");
    }
    if (detected.includes('SHA-1')) {
      securityWarnings.push("SHA-1 is weak.");
    }
    if (detected.includes('MD5')) {
      securityWarnings.push("MD5 is vulnerable to hash collisions.");
    }
    if (detected.includes('DES')) {
      securityWarnings.push("DES is outdated, use AES instead.");
    }
    if (detected.includes('RSA (Weak Key)')) {
      securityWarnings.push("Weak RSA key detected. Use 2048 bits or more.");
    }

    // Navigate
    navigate('/report', {
      state: {
        report: {
          language,
          codeLength: codeContent.length,
          detectedCryptographicFunctions: detected,
          securityWarnings,
          snippets: snippetMatches,
          timestamp: new Date().toLocaleString()
        },
        rules
      }
    });
  };

  // Toggling rules
  const toggleRule = (rule) => {
    setRules(prev =>
      prev.includes(rule)
        ? prev.filter(r => r !== rule)
        : [...prev, rule]
    );
  };

  const addAllRules = () => {
    setRules([
      'AES', 
      'RSA', 
      'RSA (Weak Key)',
      'SHA', 
      'SHA-1', 
      'MD5', 
      'HMAC', 
      'DES', 
      'Hardcoded Key'
    ]);
  };

  const removeAllRules = () => {
    setRules([]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cryptographic Function Detector</h1>
      <CodeUploader onFileUpload={setCodeContent} onPaste={setCodeContent} />

      <div style={{ marginTop: '20px' }}>
        <h3>Define Rules / Patterns</h3>
        {rules.length === 0 && <p>No rules selected.</p>}

        {[
          'AES', 
          'RSA', 
          'RSA (Weak Key)',
          'SHA', 
          'SHA-1', 
          'MD5', 
          'HMAC', 
          'DES', 
          'Hardcoded Key'
        ].map(rule => (
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
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Remove All
        </button>
      </div>

      <button
        onClick={analyzeCode}
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Analyze Code
      </button>
    </div>
  );
};

export default Detector;
