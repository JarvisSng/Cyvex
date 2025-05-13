const { SEVM } = require('sevm');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { bytecode } = req.body;

  if (!bytecode || !bytecode.startsWith('0x')) {
    return res.status(400).json({ error: 'Invalid bytecode format. Must start with 0x.' });
  }

  try {
    const evm = new SEVM();
    const decompiled = await evm.decompile(bytecode);
    res.json({ success: true, code: decompiled });
  } catch (error) {
    res.status(500).json({ error: `Decompilation failed: ${error.message}` });
  }
});

module.exports = router;