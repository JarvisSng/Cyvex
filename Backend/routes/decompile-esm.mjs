// decompile-esm.mjs
import { Contract } from 'sevm';
import { JsonRpcProvider } from 'ethers';
import 'sevm/4bytedb';

export async function decompileByteCode(bytecode) {
  const contract = new Contract(bytecode)
  const pseudocode = contract.solidify();

  const functions = contract.getFunctions();
  console.log(functions);

  const events = contract.getEvents();
  console.log(events);

  // Return the pseudocode, functions, and events
  return {
    pseudocode,
    functions,
    events
  };  
};

export async function decompileAddress(address) {
  const provider = new JsonRpcProvider('https://rpc.ankr.com/eth/d066d9a0660462ce9c0547bd9841e9e112b488dd7c0fbe984df18018329e0e42');
  const bytecode = await provider.getCode(address);
  console.log('Bytecode:', bytecode);

  const contract = new Contract(bytecode).patchdb();
  const pseudocode = contract.solidify();

  const functions = contract.getFunctions();
  console.log(functions);

  const events = contract.getEvents();
  console.log(events);

  // Return the pseudocode, functions, and events
  return {
    pseudocode,
    functions,
    events
  };
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