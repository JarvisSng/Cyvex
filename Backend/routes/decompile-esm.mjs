// decompile-esm.mjs
import { Contract } from 'sevm';

export async function decompileBytecode(bytecode) {
  const contract = new Contract(bytecode).patchdb();
  const pseudocode = contract.solidify();
  return pseudocode;
}
