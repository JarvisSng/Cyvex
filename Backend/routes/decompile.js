const express = require('express');
const router = express.Router();

// Decompile to Solidity-style pseudocode
router.post('/code', async (req, res) => {
  const { address } = req.body;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid address' });
  }

  // Normalize and fix bytecode
  const cleanBytecode = address.startsWith('0x') ? address : `0x${address}`;
  const evenBytecode = cleanBytecode.length % 2 === 0 ? cleanBytecode : cleanBytecode.slice(0, -1);

  try {
    const { decompileBytecode } = await import('./decompile-esm.mjs');
    const { pseudocode, functions, events } = await decompileBytecode(evenBytecode);

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
      fallback = generateFallbackOutput();
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
  const { address } = req.body;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid address' });
  }

  try {
    const { getOpcodes } = await import('./decompile-esm.mjs');
    const formattedOpcodes = await getOpcodes(address);

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
function generateFallbackOutput() {
  return '// Could not decompile; consider reviewing manually.';
}

module.exports = router;
