/**
 * Utilities for DES bit manipulation, hex conversion and validation.
 */

export function validateHex16(hexStr: string): boolean {
  const cleaned = hexStr.trim();
  return /^[0-9A-Fa-f]{16}$/.test(cleaned);
}

export function hex_to_binary(hexStr: string): string {
  const cleaned = hexStr.trim().toUpperCase();
  if (cleaned.length !== 16) {
    throw new Error(`Invalid hex length: expected 16 hex characters (64 bits), got ${cleaned.length}`);
  }
  if (!/^[0-9A-F]{16}$/.test(cleaned)) {
    throw new Error(`Invalid hexadecimal string: contains non-hex characters`);
  }

  let binary = '';
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const val = parseInt(char, 16);
    binary += val.toString(2).padStart(4, '0');
  }
  return binary;
}

export function binary_to_hex(binStr: string): string {
  if (binStr.length % 4 !== 0) {
    throw new Error(`Binary string length must be multiple of 4, got ${binStr.length}`);
  }
  let hex = '';
  for (let i = 0; i < binStr.length; i += 4) {
    const nibble = binStr.slice(i, i + 4);
    const val = parseInt(nibble, 2);
    hex += val.toString(16).toUpperCase();
  }
  return hex;
}

export function format_bits_spaced(bits: string, groupSize: number = 4): string {
  const chunks: string[] = [];
  for (let i = 0; i < bits.length; i += groupSize) {
    chunks.push(bits.slice(i, i + groupSize));
  }
  return chunks.join(' ');
}

export function permute(inputBits: string, table: number[]): string {
  let output = '';
  for (const pos of table) {
    // DES tables are 1-indexed
    output += inputBits[pos - 1];
  }
  return output;
}

export function xorBits(a: string, b: string): string {
  if (a.length !== b.length) {
    throw new Error(`XOR length mismatch: ${a.length} vs ${b.length}`);
  }
  let res = '';
  for (let i = 0; i < a.length; i++) {
    res += a[i] === b[i] ? '0' : '1';
  }
  return res;
}

export function leftShift(bits: string, shifts: number): string {
  const n = shifts % bits.length;
  return bits.slice(n) + bits.slice(0, n);
}
