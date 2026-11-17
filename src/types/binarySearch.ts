export type BinarySearchAction =
  | 'initial'
  | 'calculate_mid'
  | 'compare'
  | 'match'
  | 'discard_left'
  | 'discard_right'
  | 'not_found';

export interface BinarySearchStep {
  step_number: number;
  action: BinarySearchAction;
  low: number;
  high: number;
  mid: number | null;
  target: number;
  array: number[];
  eliminated_indices: number[];
  description: string;
}

export interface BinarySearchResult {
  found_index: number; // index or -1
  steps: BinarySearchStep[];
}
