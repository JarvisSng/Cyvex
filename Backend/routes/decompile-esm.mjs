// decompile-esm.mjs
import { Contract } from 'sevm';

export async function decompileBytecode(bytecode) {
  const contract = new Contract(bytecode)
  const pseudocode = contract.solidify();
  const functions = contract.getFunctions();
  const events = contract.getEvents();

  // Return the pseudocode, functions, and events
  return {
    pseudocode,
    functions,
    events
  };
}

export async function getOpcodes(bytecode) {
  const contract = new Contract(bytecode);
  const opcodes = contract.opcodes();
  const formattedOpcodes = opcodes.map(opcode => opcode.format());
  console.log(formattedOpcodes);
  return formattedOpcodes;
}