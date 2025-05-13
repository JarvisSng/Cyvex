const { SEVM } = require('sevm');
const express = require('express');
const router = express.Router();

// Middleware to validate bytecode
const validateBytecode = (req, res, next) => {
  const { bytecode } = req.body;
  
  if (!bytecode) {
    return res.status(400).json({
      success: false,
      error: 'Bytecode is required'
    });
  }

  if (typeof bytecode !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Bytecode must be a string'
    });
  }

  const cleanBytecode = bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`;
  
  if (!/^0x[0-9a-fA-F]+$/.test(cleanBytecode)) {
    return res.status(400).json({
      success: false,
      error: 'Bytecode must contain valid hexadecimal characters'
    });
  }

  // Attach cleaned bytecode to request for later use
  req.cleanBytecode = cleanBytecode;
  next();
};

// Decompilation endpoint
router.post('/', validateBytecode, async (req, res) => {
  const { cleanBytecode } = req;
  
  try {
    // Initialize SEVM with error handling
    let evm;
    try {
      evm = new SEVM();
    } catch (initError) {
      console.error('SEVM initialization failed:', initError);
      throw new Error('Internal decompiler error');
    }

    // Decompile with timeout protection
    const decompiled = await evm.solidify(cleanBytecode);

    // Format the output
    const formattedCode = formatDecompiledOutput(decompiled);

    console.log('Decompiled code:', formattedCode);
    res.json({
      success: true,
      data: {
        pseudocode: formattedCode,
        bytecodeSize: (cleanBytecode.length - 2) / 2, // Size in bytes
        warnings: getDecompilationWarnings(formattedCode)
      }
    });

  } catch (error) {
    console.error(`Decompilation Error (${cleanBytecode.slice(0, 20)}...):`, error);
  
    let fallback;
    try {
      fallback = generateFallbackOutput(cleanBytecode);
    } catch (fallbackErr) {
      console.error('Fallback generation failed:', fallbackErr);
      fallback = '// Error generating fallback pseudocode';
    }
  
    // Ensure a response is always sent
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      fallback
    });
  }  
});

// Helper functions
function formatDecompiledOutput(raw) {
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

${raw.replace(/^contract/m, 'contract Decompiled')}`;
}

function getDecompilationWarnings(code) {
  const warnings = [];
  if (code.includes('delegatecall')) warnings.push('Contains delegatecall - potential security risk');
  if (code.includes('selfdestruct')) warnings.push('Contains selfdestruct - potential security risk');
  return warnings;
}

function generateFallbackOutput(bytecode) {
  // Implement your existing fallback pseudocode generation
  return '// Fallback pseudocode generation...';
}

module.exports = router;