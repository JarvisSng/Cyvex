const { Contract } = require('sevm');
const express = require('express');
const router = express.Router();

// Middleware (if you had one before to clean bytecode, keep it)
const validateBytecode = (req, res, next) => {
  const { bytecode } = req.body;
  if (!bytecode || typeof bytecode !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid bytecode' });
  }

  req.cleanBytecode = bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`;
  next();
};

router.post('/', validateBytecode, async (req, res) => {
  const { cleanBytecode } = req;

  try {
    const contract = new Contract(cleanBytecode).patchdb();
    const pseudocode = contract.solidify(); // Returns Solidity-style pseudocode

    const formattedCode = formatDecompiledOutput(pseudocode);

    res.json({
      success: true,
      data: {
        pseudocode: formattedCode,
        bytecodeSize: (cleanBytecode.length - 2) / 2,
        warnings: getDecompilationWarnings(formattedCode)
      }
    });

  } catch (error) {
    console.error(`Decompilation Error (${cleanBytecode.slice(0, 20)}...):`, error);

    let fallback = '// Fallback pseudocode unavailable';
    try {
      fallback = generateFallbackOutput(cleanBytecode);
    } catch (fallbackErr) {
      console.error('Error generating fallback:', fallbackErr);
    }

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
        fallback
      });
    }
  }
});

// Helpers
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
  return '// Could not decompile; consider reviewing manually.';
}

export default router;
