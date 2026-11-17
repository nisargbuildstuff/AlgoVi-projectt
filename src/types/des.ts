export interface SBoxLookupDetail {
  box_index: number; // 1 to 8
  input_6bit: string; // e.g. "011011"
  row_bits: string; // e.g. "01" -> 1
  row: number;
  col_bits: string; // e.g. "1101" -> 13
  col: number;
  output_4bit: string; // e.g. "0101"
  output_val: number;
}

export type DesStageType =
  | 'input'
  | 'initial_permutation'
  | 'key_generation'
  | 'key_pc1'
  | 'key_shift'
  | 'key_pc2'
  | 'round_start'
  | 'expansion'
  | 'key_xor'
  | 's_box'
  | 'permutation'
  | 'feistel_xor'
  | 'round_swap'
  | 'preoutput_recombination'
  | 'final_permutation';

export interface DesTraceStep {
  step_number: number;
  stage: DesStageType;
  round_number?: number; // 1 to 16 if inside round
  name: string;
  description: string;
  data: {
    bits?: string;
    hex?: string;
    left?: string;
    right?: string;
    left_hex?: string;
    right_hex?: string;
    subkey_bits?: string;
    subkey_hex?: string;
    expanded_bits?: string;
    xor_bits?: string;
    sbox_out_bits?: string;
    sbox_out_hex?: string;
    permuted_bits?: string;
    permuted_hex?: string;
    f_output_bits?: string;
    f_output_hex?: string;
    sboxes?: SBoxLookupDetail[];
    round_key?: string;
    c?: string;
    d?: string;
    [key: string]: unknown;
  };
}

export interface DesRoundSummary {
  round: number;
  subkey_hex: string;
  left_hex: string;
  right_hex: string;
  f_hex: string;
}

export interface DesRoundGroup {
  round: number;
  steps: {
    round_start: DesTraceStep;
    expansion: DesTraceStep;
    key_xor: DesTraceStep;
    s_box: DesTraceStep;
    permutation: DesTraceStep;
    feistel_xor: DesTraceStep;
    round_swap?: DesTraceStep;
  };
}
