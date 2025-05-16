// decompile-esm.mjs
import { Contract } from 'sevm';
import { JsonRpcProvider } from 'ethers';
import 'sevm/4bytedb';

export async function decompileByteCode(bytecode) {
  const contract = new Contract(bytecode);
  const functions = contract.getFunctions();
  const events = contract.getEvents();

  // Generate function signatures to inject
  const functionSignatures = functions.map(fn => 
    `function ${fn.name}(${fn.inputs.map(i => `${i.type} ${i.name}`).join(', ')}) ${fn.visibility} ${fn.stateMutability}`
  ).join('\n');

  // Generate event signatures to inject
  const eventSignatures = events.map(ev => 
    `event ${ev.name}(${ev.inputs.map(i => `${i.type} ${i.indexed ? 'indexed ' : ''}${i.name}`).join(', ')})`
  ).join('\n');

  // Generate the pseudocode with injected signatures
  const pseudocode = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  ${eventSignatures.length > 0 ? `// Events\n${eventSignatures}\n\n` : ''}
  ${functionSignatures.length > 0 ? `// Function Interfaces\n${functionSignatures}\n\n` : ''}
  contract Decompiled {
  ${contract.solidify().replace('contract Decompiled {', '').replace(/\}$/, '')}
  }`;

  return {
    pseudocode,
    functions,
    events
  };
}

export async function decompileAddress(address) {
  const provider = new JsonRpcProvider('https://rpc.ankr.com/eth/d066d9a0660462ce9c0547bd9841e9e112b488dd7c0fbe984df18018329e0e42');
  const bytecode = await provider.getCode(address);

  if (!bytecode || bytecode === '0x') {
    return {
      pseudocode: '// No contract code at this address',
      functions: [],
      events: []
    };
  }

  return decompileByteCode(bytecode);
}

export async function getOpcodesByAddress(address) {
  const provider = new JsonRpcProvider('https://rpc.ankr.com/eth/d066d9a0660462ce9c0547bd9841e9e112b488dd7c0fbe984df18018329e0e42');
  const bytecode = await provider.getCode(address);
  console.log('Bytecode:', bytecode);

  const contract = new Contract(bytecode);
  const opcodes = contract.opcodes();

  const formattedOpcodes = opcodes.map(opcode => opcode.format());
  console.log(formattedOpcodes);
  return formattedOpcodes;
}

export async function getOpcodesByByteCode(bytecode) {
  const contract = new Contract(bytecode);
  const opcodes = contract.opcodes();

  const formattedOpcodes = opcodes.map(opcode => opcode.format());
  console.log(formattedOpcodes);
  return formattedOpcodes;
}

export async function getByteCode(address) {
  const provider = new JsonRpcProvider('https://rpc.ankr.com/eth/d066d9a0660462ce9c0547bd9841e9e112b488dd7c0fbe984df18018329e0e42');
  const bytecode = await provider.getCode(address);
  console.log('Bytecode:', bytecode);

  return bytecode;
}