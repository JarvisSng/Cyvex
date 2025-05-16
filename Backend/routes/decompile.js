const express = require('express');
const { decompileAddress } = require('./decompile-esm.mjs');
const router = express.Router();

const normalizeBytecode = (bytecode) => {
  if (!bytecode || typeof bytecode !== 'string') {
    throw new Error('Bytecode must be a string');
  }
  
  // Remove 0x prefix if present
  const hex = bytecode.startsWith('0x') ? bytecode.slice(2) : bytecode;
  
  // Validate hex characters
  if (!/^[0-9a-fA-F]*$/.test(hex)) {
    throw new Error('Bytecode contains invalid hex characters');
  }
  
  // Check for empty bytecode
  if (hex.length === 0) {
    throw new Error('Bytecode cannot be empty');
  }
  
  // Ensure even length
  if (hex.length % 2 !== 0) {
    throw new Error(`Bytecode must have even length (got ${hex.length} characters)`);
  }
  
  return `0x${hex}`;
};

const normalizeAddress = (address) => {
  if (!address || typeof address !== 'string') {
    throw new Error('Address must be a string');
  }
  
  const cleanAddress = address.startsWith('0x') ? address : `0x${address}`;
  
  if (!/^0x[a-fA-F0-9]{40}$/.test(cleanAddress)) {
    throw new Error('Invalid Ethereum address format');
  }
  
  return cleanAddress.toLowerCase(); // Normalize to lowercase
};

// Decompile from bytecode
router.post('/code/bytecode', async (req, res) => {
  try {
    const { bytecode } = req.body;
    const cleanBytecode = normalizeBytecode(bytecode);
    
    const { decompileByteCode } = await import('./decompile-esm.mjs');
    const { pseudocode, functions, events } = await decompileByteCode(cleanBytecode);

    res.json({
      success: true,
      data: {
        pseudocode,
        functions,
        events,
        bytecodeSize: (cleanBytecode.length - 2) / 2, // Correct byte size calculation
      }
    });
  } catch (error) {
    console.error('Bytecode decompilation error:', error);
    
    if (!res.headersSent) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
        details: {
          inputType: 'bytecode',
          validationFailed: error.message.includes('must') || 
                          error.message.includes('invalid') ||
                          error.message.includes('cannot')
        }
      });
    }
  }
});

// Decompile from address
router.post('/code/address', async (req, res) => {
  try {
    const { address } = req.body;
    const cleanAddress = normalizeAddress(address);
    
    const { decompileAddress } = await import('./decompile-esm.mjs');
    const result = await decompileAddress(cleanAddress);

    // Handle empty contract case
    if (result.pseudocode.includes('No contract code')) {
      return res.json({
        success: true,
        data: {
          ...result,
          isContract: false,
          warnings: ['No bytecode found at this address']
        }
      });
    }

    res.json({
      success: true,
      data: {
        ...result,
        isContract: true,
        bytecodeSize: result.bytecodeSize || 0
      }
    });
  } catch (error) {
    console.error(`Address decompilation error (${req.body.address}):`, error);
    
    if (!res.headersSent) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message,
        details: {
          inputType: 'address',
          validationFailed: error.message.includes('Invalid') ||
                          error.message.includes('must')
        }
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
