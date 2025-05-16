const express = require('express');
const { decompileAddress } = require('./decompile-esm.mjs');
const router = express.Router();

// Decompile to Solidity-style pseudocode from bytecode
router.post('/code/bytecode', async (req, res) => {
  const {bytecode} = req.body;
  console.log('Received bytecode:', bytecode);

  // Normalize and fix bytecode
  let hex = bytecode.startsWith('0x') ? bytecode.slice(2) : bytecode;
  console.log(hex);

  if (hex.length % 2 !== 0) {
    return res.status(400).json({
      success: false,
      error: `Bytecode must have even length. Got ${hex.length} characters.`
    });
}
  const cleanBytecode = '0x' + hex;
  console.log(cleanBytecode);

  try {
    const { decompileByteCode } = await import('./decompile-esm.mjs');
    const { pseudocode, functions, events } = await decompileByteCode(cleanBytecode);

    res.json({
      success: true,
      data: {
        pseudocode,
        functions,
        events,
        bytecodeSize: (cleanBytecode.length - 4),
      }
    });
  } catch (error) {
    
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

// Decompile to Solidity-style pseudocode from address
router.post('/code/address', async (req, res) => {
  const { address } = req.body;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid address' });
  }

  // Normalize and fix bytecode
  const cleanBytecode = address.startsWith('0x') ? address : `0x${address}`;
  const evenBytecode = cleanBytecode.length % 2 === 0 ? cleanBytecode : cleanBytecode.slice(0, -1);

  try {
    const { decompileAddress } = await import('./decompile-esm.mjs');
    const { pseudocode, functions, events } = await decompileAddress(evenBytecode);

    res.json({
      success: true,
      data: {
        pseudocode,
        functions,
        events,
        bytecodeSize: (evenBytecode.length - 4),
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
router.post('/opcode/address', async (req, res) => {
  const { address } = req.body;
  console.log(address);

  // Validate Ethereum address
  const isAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
  if (!address || typeof address !== 'string' || !isAddress) {
    return res.status(400).json({ success: false, error: 'Invalid Ethereum address' });
  }

  try {
    const { getOpcodesByAddress } = await import('./decompile-esm.mjs');
    const formattedOpcodes = await getOpcodesByAddress(address);

    res.json({
      success: true,
      data: {
        opcodeCount: formattedOpcodes.length,
        disassembly: formattedOpcodes,
      },
    });
  } catch (err) {
    console.error('Opcode Decompilation Error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to disassemble contract opcodes',
    });
  }
});

router.post('/opcode/bytecode', async (req, res) => {
  const { bytecode } = req.body;
  console.log('Received bytecode:', bytecode);

  // Normalize and validate bytecode
  let hex = bytecode.startsWith('0x') ? bytecode.slice(2) : bytecode;

  if (!/^[0-9a-fA-F]*$/.test(hex)) {
    return res.status(400).json({
      success: false,
      error: 'Bytecode contains non-hex characters.'
    });
  }

  if (hex.length % 2 !== 0) {
    return res.status(400).json({
      success: false,
      error: `Bytecode must have even length. Got ${hex.length} characters.`
    });
  }

  const cleanBytecode = '0x' + hex;
  console.log('Sanitized bytecode:', cleanBytecode);

  try {
    const { getOpcodesByByteCode } = await import('./decompile-esm.mjs');
    const formattedOpcodes = await getOpcodesByByteCode(cleanBytecode);

    res.json({
      success: true,
      data: {
        opcodeCount: formattedOpcodes.length,
        disassembly: formattedOpcodes,
      },
    });
  } catch (err) {
    console.error('Opcode Decompilation Error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to disassemble contract opcodes',
    });
  }
});

router.post('/getByteCode', async (req, res) => {
  const { address } = req.body;

  try {
    const { getByteCode } = await import('./decompile-esm.mjs');
    const bytecode = await getByteCode(address);

    res.json({
      success: true,
      data: {
        bytecode
      },
    });
  } catch (err) {
    console.error('Bytecode Error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to get bytecode',
    });
  }
});

// Optional fallback
function generateFallbackOutput() {
  return '// Could not decompile; consider reviewing manually.';
}

module.exports = router;
