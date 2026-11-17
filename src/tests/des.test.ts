import { describe, it, expect } from 'vitest';
import {
  des_encrypt,
  generate_subkeys,
  extract_des_rounds,
  extract_round_summary_table,
  extract_non_round_steps
} from '../algorithms/cryptography/des';
import {
  hex_to_binary,
  binary_to_hex,
  format_bits_spaced,
  validateHex16,
  permute,
  xorBits,
  leftShift
} from '../algorithms/cryptography/desUtils';
import { IP, IP_INV, PC1, PC2, E, P, S_BOXES, SHIFTS } from '../algorithms/cryptography/desTables';
import { mapDesStepToFlowchart } from '../explanations/des';

describe('DES Utilities & Conversions', () => {
  it('converts 16-hex characters to 64-bit binary correctly', () => {
    const hex = '0123456789ABCDEF';
    const bin = hex_to_binary(hex);
    expect(bin.length).toBe(64);
    expect(bin.slice(0, 4)).toBe('0000'); // '0'
    expect(bin.slice(60, 64)).toBe('1111'); // 'F'
  });

  it('converts 64-bit binary back to 16-hex characters (round trip)', () => {
    const hex = '133457799BBCDFF1';
    const bin = hex_to_binary(hex);
    const convertedHex = binary_to_hex(bin);
    expect(convertedHex).toBe(hex);
  });

  it('handles lowercase hex strings correctly', () => {
    const hex = '0123456789abcdef';
    const bin = hex_to_binary(hex);
    expect(bin.length).toBe(64);
    expect(binary_to_hex(bin)).toBe('0123456789ABCDEF');
  });

  it('rejects invalid hex lengths and characters', () => {
    expect(() => hex_to_binary('1234')).toThrow();
    expect(() => hex_to_binary('0123456789ABCDEG')).toThrow();
    expect(validateHex16('1234567890ABCDEF')).toBe(true);
    expect(validateHex16('XYZ')).toBe(false);
  });

  it('rejects binary strings not divisible by 4', () => {
    expect(() => binary_to_hex('101')).toThrow();
  });

  it('formats bits with spaced groups', () => {
    const formatted = format_bits_spaced('11110000', 4);
    expect(formatted).toBe('1111 0000');
  });

  it('formats bits with custom group size', () => {
    const formatted = format_bits_spaced('11110000', 2);
    expect(formatted).toBe('11 11 00 00');
  });

  it('performs cyclic left shift correctly', () => {
    expect(leftShift('1000', 1)).toBe('0001');
    expect(leftShift('1100', 2)).toBe('0011');
    expect(leftShift('10101', 5)).toBe('10101');
  });

  it('performs XOR correctly and validates length match', () => {
    expect(xorBits('1100', '1010')).toBe('0110');
    expect(() => xorBits('110', '11')).toThrow();
  });

  it('inverts IP using IP_INV correctly', () => {
    const testBits = '1'.repeat(32) + '0'.repeat(32);
    const permuted = permute(testBits, IP);
    const inverted = permute(permuted, IP_INV);
    expect(inverted).toBe(testBits);
  });

  it('verifies dimensions of standard DES tables', () => {
    expect(IP.length).toBe(64);
    expect(IP_INV.length).toBe(64);
    expect(PC1.length).toBe(56);
    expect(PC2.length).toBe(48);
    expect(E.length).toBe(48);
    expect(P.length).toBe(32);
    expect(S_BOXES.length).toBe(8);
    expect(SHIFTS.length).toBe(16);
  });

  it('verifies all 8 S-boxes have 4 rows and 16 columns each', () => {
    S_BOXES.forEach((sbox) => {
      expect(sbox.length).toBe(4);
      sbox.forEach((row) => {
        expect(row.length).toBe(16);
        row.forEach((val) => {
          expect(val).toBeGreaterThanOrEqual(0);
          expect(val).toBeLessThanOrEqual(15);
        });
      });
    });
  });
});

describe('DES NIST Test Vector & Algorithm Correctness', () => {
  const NIST_PLAINTEXT = '0123456789ABCDEF';
  const NIST_KEY = '133457799BBCDFF1';
  const NIST_EXPECTED_CIPHERTEXT = '85E813540F0AB405';

  it('produces the exact NIST FIPS 46-3 test vector ciphertext', () => {
    const result = des_encrypt(NIST_PLAINTEXT, NIST_KEY);
    expect(result.ciphertext_hex).toBe(NIST_EXPECTED_CIPHERTEXT);
  });

  it('produces 16 subkeys each having 48 bits', () => {
    const { subkeys } = generate_subkeys(NIST_KEY);
    expect(subkeys.length).toBe(16);
    subkeys.forEach((sk) => {
      expect(sk.length).toBe(48);
    });
  });

  it('verifies round 1 subkey matches known reference 1B02EFFC7072', () => {
    const { subkeys } = generate_subkeys(NIST_KEY);
    expect(binary_to_hex(subkeys[0])).toBe('1B02EFFC7072');
  });

  it('verifies shift schedule has 4 single shifts and 12 double shifts', () => {
    const singleShifts = SHIFTS.filter((s) => s === 1);
    const doubleShifts = SHIFTS.filter((s) => s === 2);
    expect(singleShifts.length).toBe(4); // rounds 1, 2, 9, 16
    expect(doubleShifts.length).toBe(12);
  });

  it('records exactly 108 trace steps', () => {
    const result = des_encrypt(NIST_PLAINTEXT, NIST_KEY);
    expect(result.steps.length).toBe(108);
    expect(result.steps[0].step_number).toBe(0);
    expect(result.steps[107].step_number).toBe(107);
  });

  it('extracts all 16 rounds with 6 sub-stages', () => {
    const result = des_encrypt(NIST_PLAINTEXT, NIST_KEY);
    const rounds = extract_des_rounds(result.steps);
    expect(rounds.length).toBe(16);

    rounds.forEach((rg, idx) => {
      expect(rg.round).toBe(idx + 1);
      expect(rg.steps.round_start).toBeDefined();
      expect(rg.steps.expansion).toBeDefined();
      expect(rg.steps.key_xor).toBeDefined();
      expect(rg.steps.s_box).toBeDefined();
      expect(rg.steps.permutation).toBeDefined();
      expect(rg.steps.feistel_xor).toBeDefined();
    });
  });

  it('verifies 8 S-box lookups per round with correct 4-bit outputs', () => {
    const result = des_encrypt(NIST_PLAINTEXT, NIST_KEY);
    const rounds = extract_des_rounds(result.steps);

    rounds.forEach((rg) => {
      const sboxStep = rg.steps.s_box;
      const sboxes = sboxStep.data.sboxes;
      expect(sboxes).toBeDefined();
      expect(sboxes?.length).toBe(8);

      sboxes?.forEach((sb, sIdx) => {
        expect(sb.box_index).toBe(sIdx + 1);
        expect(sb.input_6bit.length).toBe(6);
        expect(sb.output_4bit.length).toBe(4);
        expect(sb.row).toBeGreaterThanOrEqual(0);
        expect(sb.row).toBeLessThanOrEqual(3);
        expect(sb.col).toBeGreaterThanOrEqual(0);
        expect(sb.col).toBeLessThanOrEqual(15);
        expect(sb.output_val).toBe(S_BOXES[sIdx][sb.row][sb.col]);
      });
    });
  });

  it('extracts 16-row summary matrix table', () => {
    const result = des_encrypt(NIST_PLAINTEXT, NIST_KEY);
    const summary = extract_round_summary_table(result.steps);
    expect(summary.length).toBe(16);
    summary.forEach((row, i) => {
      expect(row.round).toBe(i + 1);
      expect(row.subkey_hex.length).toBe(12); // 48 bits = 12 hex chars
      expect(row.left_hex.length).toBe(8); // 32 bits = 8 hex chars
      expect(row.right_hex.length).toBe(8);
      expect(row.f_hex.length).toBe(8);
    });
  });

  it('extracts non-round steps correctly', () => {
    const result = des_encrypt(NIST_PLAINTEXT, NIST_KEY);
    const nonRound = extract_non_round_steps(result.steps);
    expect(nonRound.input).toBeDefined();
    expect(nonRound.initial_permutation).toBeDefined();
    expect(nonRound.preoutput_recombination).toBeDefined();
    expect(nonRound.final_permutation).toBeDefined();
    expect(nonRound.final_permutation?.data.hex).toBe(NIST_EXPECTED_CIPHERTEXT);
  });

  it('verifies IP output halves for NIST test vector (L0=CC00CCFF, R0=F0AAF0AA)', () => {
    const result = des_encrypt(NIST_PLAINTEXT, NIST_KEY);
    const nonRound = extract_non_round_steps(result.steps);
    expect(nonRound.initial_permutation?.data.left_hex).toBe('CC00CCFF');
    expect(nonRound.initial_permutation?.data.right_hex).toBe('F0AAF0AA');
  });

  it('verifies round 1 L1=F0AAF0AA and R1=EF4A6544', () => {
    const result = des_encrypt(NIST_PLAINTEXT, NIST_KEY);
    const rounds = extract_des_rounds(result.steps);
    expect(rounds[0].steps.feistel_xor.data.left_hex).toBe('F0AAF0AA');
    expect(rounds[0].steps.feistel_xor.data.right_hex).toBe('EF4A6544');
  });

  it('correctly maps trace steps to 5-stage flowchart automaton', () => {
    const result = des_encrypt(NIST_PLAINTEXT, NIST_KEY);

    // Step 0: input
    const inputStage = mapDesStepToFlowchart(result.steps[0], result.steps.length, false);
    expect(inputStage.stage_id).toBe('input');

    // Step 1: IP
    const ipStage = mapDesStepToFlowchart(result.steps[1], result.steps.length, false);
    expect(ipStage.stage_id).toBe('step1_ip');

    // Step 2: Divide halves (round 1 start)
    const r1Start = result.steps.find((s) => s.stage === 'round_start' && s.round_number === 1)!;
    const divideStage = mapDesStepToFlowchart(r1Start, result.steps.length, false);
    expect(divideStage.stage_id).toBe('step2_divide');

    // Step 3: Feistel round operations
    const expStep = result.steps.find((s) => s.stage === 'expansion' && s.round_number === 1)!;
    const expStage = mapDesStepToFlowchart(expStep, result.steps.length, false);
    expect(expStage.stage_id).toBe('step3_feistel');
    expect(expStage.active_substep).toBe('expansion');

    // Step 4: Swap after Round 16
    const preoutputStep = result.steps.find((s) => s.stage === 'preoutput_recombination')!;
    const swapStage = mapDesStepToFlowchart(preoutputStep, result.steps.length, false);
    expect(swapStage.stage_id).toBe('step4_swap');

    // Step 5: Final Permutation & Output
    const fpStep = result.steps.find((s) => s.stage === 'final_permutation')!;
    const fpStage = mapDesStepToFlowchart(fpStep, result.steps.length, true);
    expect(fpStage.stage_id).toBe('output');
    expect(fpStage.active_nodes).toContain('output');
  });
});

