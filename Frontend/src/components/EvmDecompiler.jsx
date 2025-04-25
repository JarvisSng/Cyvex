import { useState } from 'react';
import { ethers } from 'ethers';

// Common cryptographic function patterns
const CRYPTO_PATTERNS = {
  // Ethereum precompiles
  'ecrecover': '0000000000000000000000000000000000000001',
  'sha256': '0000000000000000000000000000000000000002',
  'ripemd160': '0000000000000000000000000000000000000003',
  'identity': '0000000000000000000000000000000000000004',
  'mod_exp': '0000000000000000000000000000000000000005',
  'ec_add': '0000000000000000000000000000000000000006',
  'ec_mul': '0000000000000000000000000000000000000007',
  'ec_pairing': '0000000000000000000000000000000000000008',
  'blake2f': '0000000000000000000000000000000000000009',
  
  // Common function signatures
  'verifySig': '1626ba7e',
  'isValidSignature': '20c13b0b',
  'recoverSigner': 'e3a9db1a'
};

export default function CryptoDetector() {
  const [bytecode, setBytecode] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const detectCryptoFunctions = (code) => {
    const detected = [];
    const cleanCode = code.toLowerCase().replace(/^0x/, '');

    // Check for precompiles
    for (const [name, pattern] of Object.entries(CRYPTO_PATTERNS)) {
      if (cleanCode.includes(pattern)) {
        detected.push({
          type: 'precompile',
          name,
          pattern,
          location: `0x${cleanCode.indexOf(pattern).toString(16)}`
        });
      }
    }

    // Check for common opcode sequences
    const opcodePatterns = {
      'sha3': /a2646970667358/,
      'signature_verification': /64792b2b34ba3c59a7a5a5f8/,
      'ecdsa_recovery': /60003560205260206000f3/
    };

    for (const [name, regex] of Object.entries(opcodePatterns)) {
      const match = cleanCode.match(regex);
      if (match) {
        detected.push({
          type: 'pattern',
          name,
          location: `0x${match.index.toString(16)}`
        });
      }
    }

    return detected;
  };

  const analyzeBytecode = () => {
    setIsLoading(true);
    setResults([]);

    try {
      if (!bytecode.trim()) {
        throw new Error('Please enter EVM bytecode');
      }

      const normalizedBytecode = bytecode.startsWith('0x') 
        ? bytecode 
        : `0x${bytecode}`;

      const detected = detectCryptoFunctions(normalizedBytecode);
      setResults(detected);

      if (detected.length === 0) {
        setResults([{ type: 'info', message: 'No cryptographic functions detected' }]);
      }
    } catch (err) {
      setResults([{ type: 'error', message: err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          EVM Bytecode:
        </label>
        <textarea
          value={bytecode}
          onChange={(e) => setBytecode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-blue-500 font-mono text-sm"
          rows={8}
          placeholder="Enter address or bytecode"
          disabled={isLoading}
        />
      </div>
      
      <button
        onClick={analyzeBytecode}
        disabled={isLoading || !bytecode.trim()}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          isLoading || !bytecode.trim()
            ? '!bg-blue-950 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Analyzing...' : 'Detect Cryptographic Functions'}
      </button>
      
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Results:</h2>
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md ${
                  result.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-700' :
                  result.type === 'info' ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' :
                  'bg-green-50 border-l-4 border-green-500 text-green-700'
                }`}
              >
                {result.type === 'error' || result.type === 'info' ? (
                  <p>{result.message}</p>
                ) : (
                  <>
                    <p className="font-bold">{result.name}</p>
                    <p>Type: {result.type}</p>
                    {result.pattern && <p>Pattern: {result.pattern}</p>}
                    <p>Location: {result.location}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No analysis performed yet</p>
        )}
      </div>
    </div>
  );
}