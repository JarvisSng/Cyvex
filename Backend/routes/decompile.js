const express = require('express');
const router = express.Router();

// Decompile to Solidity-style pseudocode
router.post('/code', async (req, res) => {
  const { bytecode } = req.body;

  if (!bytecode || typeof bytecode !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid bytecode' });
  }

  // Normalize and fix bytecode
  const cleanBytecode = bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`;
  const evenBytecode = cleanBytecode.length % 2 === 0 ? cleanBytecode : cleanBytecode.slice(0, -1);

  try {
    const { decompileBytecode } = await import('./decompile-esm.mjs');
    const pseudocode = await decompileBytecode(evenBytecode);

    res.json({
      success: true,
      data: {
        pseudocode,
        functions,
        events,
        bytecodeSize: (evenBytecode.length - 2) / 2,
      }
    });
  } catch (error) {
    console.error(`Decompilation Error (${evenBytecode.slice(0, 20)}...):`, error);

    let fallback = '// Fallback pseudocode unavailable';
    try {
      fallback = generateFallbackOutput(evenBytecode);
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

// Disassemble to opcodes
router.post('/opcode', async (req, res) => {
  const { bytecode } = req.body;

  if (!bytecode || typeof bytecode !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid bytecode' });
  }

  const cleanBytecode = bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`;
  const evenBytecode = cleanBytecode.length % 2 === 0 ? cleanBytecode : cleanBytecode.slice(0, -1);

  try {
    const { getOpcodes } = await import('./decompile-esm.mjs');
    const formattedOpcodes = await getOpcodes(evenBytecode);

    res.json({
      success: true,
      data: {
        opcodeCount: formattedOpcodes.length,
        disassembly: formattedOpcodes
      }
    });
  } catch (err) {
    console.error('Opcode Decompilation Error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to disassemble bytecode',
    });
  }
});

// Optional fallback
function generateFallbackOutput(bytecode) {
  return '// Could not decompile; consider reviewing manually.';
}

module.exports = router;
