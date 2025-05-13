// decompile-esm.mjs
import { Contract } from 'sevm';

export async function decompileBytecode(bytecode) {
  const contract = new Contract(bytecode)
  const pseudocode = contract.solidify();
  return pseudocode;
}

export async function getOpcodes(bytecode) {
  const contract = new Contract(bytecode);
  const opcodes = contract.opcodes();
  const formattedOpcodes = opcodes.map(opcode => opcode.format());
  console.log(formattedOpcodes);
  return formattedOpcodes;
}