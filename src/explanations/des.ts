import { DesTraceStep } from '../types/des';

export interface DesStagePedagogicalInfo {
  stage_number: number;
  stage_name: string;
  category: 'Key Schedule' | 'Feistel Round' | 'Structure & Output';
  purpose: string;
  cryptographic_principle: 'Diffusion' | 'Confusion' | 'Permutation' | 'Avalanche Effect' | 'Feistel Invertibility';
  mathematical_expression: string;
  detailed_explanation: string;
}

export const DES_12_STAGES: DesStagePedagogicalInfo[] = [
  {
    stage_number: 1,
    stage_name: 'Plaintext Input Parsing',
    category: 'Structure & Output',
    purpose: 'Validate and format 64-bit plaintext block',
    cryptographic_principle: 'Feistel Invertibility',
    mathematical_expression: 'P \\in \\{0, 1\\}^{64}',
    detailed_explanation: 'DES operates on fixed 64-bit blocks. The input hexadecimal string is validated and converted into an exact 64-bit binary vector.'
  },
  {
    stage_number: 2,
    stage_name: 'Initial Permutation (IP)',
    category: 'Structure & Output',
    purpose: 'Transposes 64 bits to optimize hardware routing and begin diffusion',
    cryptographic_principle: 'Permutation',
    mathematical_expression: 'IP(P) = L_0 \\parallel R_0',
    detailed_explanation: 'Reorders the 64 bits using the standard IP table without adding cryptographic strength by itself, but standardizing bit placement.'
  },
  {
    stage_number: 3,
    stage_name: 'Permuted Choice 1 (PC-1)',
    category: 'Key Schedule',
    purpose: 'Discards 8 parity bits from 64-bit key and splits into two 28-bit halves',
    cryptographic_principle: 'Permutation',
    mathematical_expression: 'PC1(K) = C_0 \\parallel D_0, \\quad |C_0|=|D_0|=28',
    detailed_explanation: 'Every 8th bit in the 64-bit key is an error-checking parity bit. PC-1 selects 56 effective key bits and splits them into registers C and D.'
  },
  {
    stage_number: 4,
    stage_name: 'Key Rotation & PC-2 (Subkey Derivation)',
    category: 'Key Schedule',
    purpose: 'Generates 16 distinct 48-bit subkeys K₁ ... K₁₆ via left circular shifts and PC-2 compression',
    cryptographic_principle: 'Avalanche Effect',
    mathematical_expression: 'K_i = PC2(LS_i(C_{i-1}) \\parallel LS_i(D_{i-1}))',
    detailed_explanation: 'In rounds 1, 2, 9, 16 the registers shift by 1 bit; in other rounds by 2 bits. PC-2 then extracts 48 bits for that round.'
  },
  {
    stage_number: 5,
    stage_name: 'Round Start & Half Partitioning',
    category: 'Feistel Round',
    purpose: 'Separates previous block into 32-bit left (L_{i-1}) and right (R_{i-1}) halves',
    cryptographic_principle: 'Feistel Invertibility',
    mathematical_expression: '(L_{i-1}, R_{i-1}) \\in \\{0, 1\\}^{32} \\times \\{0, 1\\}^{32}',
    detailed_explanation: 'The Feistel cipher structure processes half the block at a time, making decryption identical to encryption by reversing subkeys.'
  },
  {
    stage_number: 6,
    stage_name: 'Expansion Permutation (Table E)',
    category: 'Feistel Round',
    purpose: 'Expands 32-bit R_{i-1} to 48 bits so it can be combined with 48-bit subkey',
    cryptographic_principle: 'Diffusion',
    mathematical_expression: 'E(R_{i-1}) \\in \\{0, 1\\}^{48}',
    detailed_explanation: 'Certain bits are duplicated so that each bit affects two adjacent S-boxes, spreading influence and ensuring rapid avalanche across rounds.'
  },
  {
    stage_number: 7,
    stage_name: 'Round Subkey XOR Mixing',
    category: 'Feistel Round',
    purpose: 'Combines key entropy with data entropy',
    cryptographic_principle: 'Confusion',
    mathematical_expression: 'B = E(R_{i-1}) \\oplus K_i',
    detailed_explanation: 'Bitwise XOR mixes the expanded right half with round subkey Ki. Without this key mixing, the transformation would be independent of the secret key.'
  },
  {
    stage_number: 8,
    stage_name: 'S-Box Substitution (The Heart of DES)',
    category: 'Feistel Round',
    purpose: 'Provides critical non-linear transformation preventing linear and differential attacks',
    cryptographic_principle: 'Confusion',
    mathematical_expression: 'S(B) = S_1(B_1) \\parallel S_2(B_2) \\dots S_8(B_8) \\in \\{0, 1\\}^{32}',
    detailed_explanation: 'Eight 6-to-4 bit S-boxes look up row (outer bits 0 & 5) and column (inner bits 1-4). This is the only non-linear component in DES.'
  },
  {
    stage_number: 9,
    stage_name: 'P-Box Permutation',
    category: 'Feistel Round',
    purpose: 'Permutes 32-bit S-box outputs so output bits diffuse into different S-boxes next round',
    cryptographic_principle: 'Diffusion',
    mathematical_expression: 'f(R_{i-1}, K_i) = P(S(E(R_{i-1}) \\oplus K_i))',
    detailed_explanation: 'Straight 32-bit permutation table P scatters the 4-bit S-box outputs across the entire 32-bit register.'
  },
  {
    stage_number: 10,
    stage_name: 'Feistel XOR Addition',
    category: 'Feistel Round',
    purpose: 'Masks left half with the output of the round function',
    cryptographic_principle: 'Feistel Invertibility',
    mathematical_expression: 'R_i = L_{i-1} \\oplus f(R_{i-1}, K_i)',
    detailed_explanation: 'XORing with L_{i-1} is completely reversible during decryption without requiring the round function f to be invertible.'
  },
  {
    stage_number: 11,
    stage_name: '32-Bit Half Swap',
    category: 'Feistel Round',
    purpose: 'Interchanges L and R halves between rounds (omitted in Round 16)',
    cryptographic_principle: 'Feistel Invertibility',
    mathematical_expression: 'L_i = R_{i-1}, \\quad R_i = \\text{FeistelXOR} \\quad (i < 16)',
    detailed_explanation: 'Swapping ensures both halves are transformed alternately in consecutive rounds. Round 16 skips the swap so decryption uses identical structure.'
  },
  {
    stage_number: 12,
    stage_name: 'Pre-output Recombination & Final Permutation (IP⁻¹)',
    category: 'Structure & Output',
    purpose: 'Recombines halves and applies inverse initial permutation to produce 64-bit ciphertext',
    cryptographic_principle: 'Permutation',
    mathematical_expression: 'C = IP^{-1}(R_{16} \\parallel L_{16})',
    detailed_explanation: 'Concatenates R₁₆ and L₁₆ and passes the 64-bit block through IP⁻¹ to generate the final 64-bit ciphertext.'
  }
];

export function mapDesStepToStageInfo(step: DesTraceStep): DesStagePedagogicalInfo {
  switch (step.stage) {
    case 'input':
      return DES_12_STAGES[0];
    case 'initial_permutation':
      return DES_12_STAGES[1];
    case 'key_generation':
    case 'key_pc1':
      return DES_12_STAGES[2];
    case 'key_shift':
    case 'key_pc2':
      return DES_12_STAGES[3];
    case 'round_start':
      return DES_12_STAGES[4];
    case 'expansion':
      return DES_12_STAGES[5];
    case 'key_xor':
      return DES_12_STAGES[6];
    case 's_box':
      return DES_12_STAGES[7];
    case 'permutation':
      return DES_12_STAGES[8];
    case 'feistel_xor':
      return step.round_number === 16 ? DES_12_STAGES[9] : DES_12_STAGES[10];
    case 'round_swap':
      return DES_12_STAGES[10];
    case 'preoutput_recombination':
    case 'final_permutation':
    default:
      return DES_12_STAGES[11];
  }
}

export type DesFlowchartNodeId =
  | 'input'
  | 'step1_ip'
  | 'step2_divide'
  | 'step3_feistel'
  | 'substep_expansion'
  | 'substep_key_xor'
  | 'substep_sbox'
  | 'substep_pbox'
  | 'substep_feistel_xor'
  | 'substep_swap'
  | 'step4_swap'
  | 'step5_fp'
  | 'output';

export interface DesFlowchartStageInfo {
  stage_id: DesFlowchartNodeId;
  active_nodes: string[];
  step_number: number;
  step_label: string;
  round_number?: number;
  active_substep?: 'expansion' | 'key_xor' | 'sbox' | 'permutation' | 'feistel_xor' | 'swap_halves';
  operation: string;
  badge_color: string;
  mathematical_expression: string;
  cryptographic_principle: string;
  what_happened: string;
  why_it_matters: string;
  left_hex?: string;
  right_hex?: string;
  subkey_hex?: string;
  f_hex?: string;
  bits_detail?: string;
  hex_detail?: string;
}

export function mapDesStepToFlowchart(
  step: DesTraceStep,
  totalSteps: number,
  isAtEnd: boolean = false
): DesFlowchartStageInfo {
  const round = step.round_number;
  const leftHex = (step.data.left_hex as string) || '';
  const rightHex = (step.data.right_hex as string) || '';
  const subkeyHex = (step.data.subkey_hex as string) || (step.data.round_key as string) || '';
  const fHex = (step.data.f_output_hex as string) || (step.data.permuted_hex as string) || '';
  const bitsDetail = (step.data.bits as string) || (step.data.expanded_bits as string) || (step.data.xor_bits as string) || '';
  const hexDetail = (step.data.hex as string) || '';

  if (isAtEnd || step.stage === 'final_permutation') {
    return {
      stage_id: 'output',
      active_nodes: ['step5_fp', 'output'],
      step_number: step.step_number,
      step_label: 'Step 5 & Output',
      operation: 'Final Permutation (FP) → 64-Bit Ciphertext',
      badge_color: 'emerald',
      mathematical_expression: 'C = IP^{-1}(R_{16} \\parallel L_{16})',
      cryptographic_principle: 'Permutation Inversion',
      what_happened: `Applies the Inverse Initial Permutation (IP⁻¹) to produce the final 64-bit ciphertext: ${hexDetail || 'computed ciphertext'}.`,
      why_it_matters: 'The final permutation is the exact inverse of IP. It completes the Feistel encryption pipeline.',
      hex_detail: hexDetail,
      bits_detail: bitsDetail,
    };
  }

  switch (step.stage) {
    case 'input':
      return {
        stage_id: 'input',
        active_nodes: ['input'],
        step_number: step.step_number,
        step_label: 'Input Block',
        operation: '64-Bit Plaintext & Key Specification',
        badge_color: 'sky',
        mathematical_expression: 'P \\in \\{0, 1\\}^{64}, \\quad K \\in \\{0, 1\\}^{64}',
        cryptographic_principle: 'Block Size (64 Bits)',
        what_happened: `The 64-bit plaintext ${hexDetail} is validated and parsed into binary. DES processes fixed 64-bit blocks.`,
        why_it_matters: 'Uniform 64-bit block sizing allows hardware pipelining and clean separation into two 32-bit registers.',
        hex_detail: hexDetail,
        bits_detail: bitsDetail,
      };

    case 'initial_permutation':
      return {
        stage_id: 'step1_ip',
        active_nodes: ['step1_ip'],
        step_number: step.step_number,
        step_label: 'Step 1: Initial Permutation (IP)',
        operation: 'Step 1: Initial Permutation (IP)',
        badge_color: 'sky',
        mathematical_expression: 'IP(P) = L_0 \\parallel R_0',
        cryptographic_principle: 'Permutation',
        what_happened: 'Rearranges the 64-bit plaintext bits using the standard IP transposition table.',
        why_it_matters: 'Standardizes bit routing for hardware efficiency; does not add cryptographic strength alone, but organizes bits for diffusion.',
        left_hex: leftHex,
        right_hex: rightHex,
        hex_detail: hexDetail,
        bits_detail: bitsDetail,
      };

    case 'key_generation':
    case 'key_pc1':
    case 'key_shift':
    case 'key_pc2':
      return {
        stage_id: 'step2_divide',
        active_nodes: ['step2_divide'],
        step_number: step.step_number,
        step_label: 'Key Schedule (PC-1 & Shifts)',
        operation: 'Key Generation: Parity Bit Removal (56 Effective Bits)',
        badge_color: 'amber',
        mathematical_expression: 'PC1(K) = C_0 \\parallel D_0, \\quad |C_0|=|D_0|=28',
        cryptographic_principle: 'Key Schedule Parity Discarding',
        what_happened: '8 parity check bits are removed from the 64-bit key, leaving 56 effective bits partitioned into C₀ and D₀ (28 bits each).',
        why_it_matters: 'Although DES uses a 64-bit input key, only 56 bits determine security, making brute-force feasible on modern hardware.',
        subkey_hex: subkeyHex,
        bits_detail: bitsDetail,
      };

    case 'round_start':
      if (round === 1) {
        return {
          stage_id: 'step2_divide',
          active_nodes: ['step2_divide'],
          step_number: step.step_number,
          step_label: 'Step 2: Divide into Two Halves',
          round_number: 1,
          operation: 'Step 2: Divide into Two Halves (L₀ & R₀)',
          badge_color: 'sky',
          mathematical_expression: 'L_0 = 32\\text{ bits}, \\quad R_0 = 32\\text{ bits}',
          cryptographic_principle: 'Feistel Network Splitting',
          what_happened: `The 64 permuted bits are partitioned into Left half L₀ (${leftHex}) and Right half R₀ (${rightHex}).`,
          why_it_matters: 'Splitting into 32-bit halves allows Feistel round operations to modify one half while the other remains temporarily untouched for reversibility.',
          left_hex: leftHex,
          right_hex: rightHex,
          subkey_hex: subkeyHex,
        };
      }
      return {
        stage_id: 'step3_feistel',
        active_nodes: ['step3_feistel'],
        step_number: step.step_number,
        step_label: `Step 3: Feistel Round ${round}`,
        round_number: round,
        operation: `Round ${round} of 16 Initialization`,
        badge_color: 'purple',
        mathematical_expression: `(L_{${(round || 1) - 1}}, R_{${(round || 1) - 1}}) \\parallel K_{${round}}`,
        cryptographic_principle: 'Feistel Iteration',
        what_happened: `Round ${round} begins with Left half L${(round || 1) - 1} = ${leftHex}, Right half R${(round || 1) - 1} = ${rightHex}, and 48-bit subkey K${round}.`,
        why_it_matters: '16 repeated rounds guarantee complete avalanche effect and maximum resistance against differential cryptanalysis.',
        left_hex: leftHex,
        right_hex: rightHex,
        subkey_hex: subkeyHex,
      };

    case 'expansion':
      return {
        stage_id: 'step3_feistel',
        active_nodes: ['step3_feistel', 'substep_expansion'],
        step_number: step.step_number,
        step_label: `Step 3: Round ${round} Expansion`,
        round_number: round,
        active_substep: 'expansion',
        operation: `Round ${round}: Expand Right Half (32b → 48b)`,
        badge_color: 'purple',
        mathematical_expression: `E(R_{${(round || 1) - 1}}) \\in \\{0, 1\\}^{48}`,
        cryptographic_principle: 'Diffusion (Table E)',
        what_happened: `Expands the 32-bit right half R${(round || 1) - 1} to 48 bits via expansion table E, duplicating 16 bits.`,
        why_it_matters: 'Expands the data to match the 48-bit round subkey and ensures each bit influences multiple S-boxes.',
        left_hex: leftHex,
        right_hex: rightHex,
        bits_detail: (step.data.expanded_bits as string) || '',
      };

    case 'key_xor':
      return {
        stage_id: 'step3_feistel',
        active_nodes: ['step3_feistel', 'substep_key_xor'],
        step_number: step.step_number,
        step_label: `Step 3: Round ${round} Key XOR`,
        round_number: round,
        active_substep: 'key_xor',
        operation: `Round ${round}: XOR with 48-Bit Round Key`,
        badge_color: 'amber',
        mathematical_expression: `B = E(R_{${(round || 1) - 1}}) \\oplus K_{${round}}`,
        cryptographic_principle: 'Confusion (Key Mixing)',
        what_happened: `The 48-bit expanded right half is bitwise XORed with 48-bit round subkey K${round} (${subkeyHex}).`,
        why_it_matters: 'Injects the secret key entropy directly into the block, binding the ciphertext to the secret key.',
        subkey_hex: subkeyHex,
        bits_detail: (step.data.xor_bits as string) || '',
      };

    case 's_box':
      return {
        stage_id: 'step3_feistel',
        active_nodes: ['step3_feistel', 'substep_sbox'],
        step_number: step.step_number,
        step_label: `Step 3: Round ${round} S-Boxes`,
        round_number: round,
        active_substep: 'sbox',
        operation: `Round ${round}: Pass through 8 S-Boxes (48b → 32b)`,
        badge_color: 'pink',
        mathematical_expression: 'S(B) = S_1(B_1) \\parallel \\dots \\parallel S_8(B_8) \\in \\{0, 1\\}^{32}',
        cryptographic_principle: 'Confusion (Non-Linear Substitution)',
        what_happened: 'The 48 bits are partitioned into 8 6-bit blocks. Each passes into an S-box (S1–S8), shrinking to 4 bits (32 bits total).',
        why_it_matters: 'S-boxes are the ONLY non-linear operation in DES. They provide confusion and destroy algebraic relationships.',
        f_hex: (step.data.sbox_out_hex as string) || '',
        bits_detail: (step.data.sbox_out_bits as string) || '',
      };

    case 'permutation':
      return {
        stage_id: 'step3_feistel',
        active_nodes: ['step3_feistel', 'substep_pbox'],
        step_number: step.step_number,
        step_label: `Step 3: Round ${round} P-Box`,
        round_number: round,
        active_substep: 'permutation',
        operation: `Round ${round}: Apply P-Box Permutation (32 Bits)`,
        badge_color: 'indigo',
        mathematical_expression: `f(R_{${(round || 1) - 1}}, K_{${round}}) = P(S(E(R) \\oplus K))`,
        cryptographic_principle: 'Diffusion (Straight Permutation)',
        what_happened: `Permutes the 32-bit S-box output using table P to produce round function output f(R, K): ${fHex}.`,
        why_it_matters: 'Diffuses the output of each S-box across different S-boxes in subsequent rounds, causing rapid avalanche.',
        f_hex: fHex,
        bits_detail: (step.data.permuted_bits as string) || '',
      };

    case 'feistel_xor':
    case 'round_swap':
      return {
        stage_id: 'step3_feistel',
        active_nodes: ['step3_feistel', 'substep_feistel_xor', 'substep_swap'],
        step_number: step.step_number,
        step_label: `Step 3: Round ${round} Feistel XOR & Swap`,
        round_number: round,
        active_substep: 'feistel_xor',
        operation: round === 16 ? 'Round 16: XOR with Left Half (No Swap)' : `Round ${round}: XOR with Left Half & Swap`,
        badge_color: 'purple',
        mathematical_expression: round === 16
          ? 'L_{16} = L_{15} \\oplus f(R_{15}, K_{16}), \\quad R_{16} = R_{15}'
          : 'L_i = R_{i-1}, \\quad R_i = L_{i-1} \\oplus f(R_{i-1}, K_i)',
        cryptographic_principle: 'Feistel Invertibility',
        what_happened: round === 16
          ? `L₁₅ XORed with f(R₁₅, K₁₆). Swap is omitted in Round 16 per DES specification. L₁₆=${leftHex}, R₁₆=${rightHex}.`
          : `Left half L${(round || 1) - 1} XORed with f(R, K) to become new Right half R${round} (${rightHex}). Halves are swapped: L${round}=${leftHex}.`,
        why_it_matters: 'Feistel XOR addition guarantees that the exact same structure decrypts the data without needing an invertible f function.',
        left_hex: leftHex,
        right_hex: rightHex,
        f_hex: fHex,
      };

    case 'preoutput_recombination':
      return {
        stage_id: 'step4_swap',
        active_nodes: ['step4_swap'],
        step_number: step.step_number,
        step_label: 'Step 4: Swap Left & Right Halves',
        operation: 'Step 4: Swap Left and Right Halves (R₁₆ ∥ L₁₆)',
        badge_color: 'amber',
        mathematical_expression: '\\text{Preoutput} = R_{16} \\parallel L_{16}',
        cryptographic_principle: 'Feistel Invertibility Cancellation',
        what_happened: `After Round 16, the halves are swapped: R₁₆ (${rightHex}) concatenated with L₁₆ (${leftHex}) to form the 64-bit pre-output block.`,
        why_it_matters: 'Swapping the halves ensures encryption and decryption can share identical hardware implementations.',
        left_hex: leftHex,
        right_hex: rightHex,
        hex_detail: hexDetail,
      };

    default:
      return {
        stage_id: 'step5_fp',
        active_nodes: ['step5_fp', 'output'],
        step_number: step.step_number,
        step_label: 'Step 5: Final Permutation (FP)',
        operation: 'Step 5: Final Permutation (FP / IP⁻¹)',
        badge_color: 'emerald',
        mathematical_expression: 'C = IP^{-1}(R_{16} \\parallel L_{16})',
        cryptographic_principle: 'Permutation',
        what_happened: `Inverse Initial Permutation (IP⁻¹) produces the final 64-bit ciphertext: ${hexDetail}.`,
        why_it_matters: 'Reverses the initial transposition from Step 1, concluding the NIST FIPS 46-3 encryption algorithm.',
        hex_detail: hexDetail,
      };
  }
}

