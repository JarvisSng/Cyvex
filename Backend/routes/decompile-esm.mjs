// decompile-esm.mjs
import { Contract } from 'sevm';
import { JsonRpcProvider } from 'ethers';
import 'sevm/4bytedb';

export async function decompileBytecode(address) {
  const provider = new JsonRpcProvider('https://cloudflare-eth.com/');
  const bytecode = await provider.getCode(address);

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

export async function getOpcodes(address) {
  const provider = new JsonRpcProvider('https://cloudflare-eth.com/');
  const bytecode = await provider.getCode(address);

  const contract = new Contract(bytecode);
  const opcodes = contract.opcodes();

  const formattedOpcodes = opcodes.map(opcode => opcode.format());
  console.log(formattedOpcodes);
  return formattedOpcodes;
}

export async function getByteCode(address) {
  const provider = new JsonRpcProvider('https://cloudflare-eth.com/');
  const bytecode = await provider.getCode(address);

  return bytecode;
}