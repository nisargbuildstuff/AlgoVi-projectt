export interface ExecutionStep<T = number[]> {
  step_number: number;
  state: T;
  action: 'start' | 'compare' | 'swap' | 'no_swap' | 'pass_complete' | 'sorted' | string;
  indices: number[];
  description: string;
}

export interface FlowchartStageInfo {
  stage_id: string; // Node ID in flowchart graph (e.g. "compare_elements")
  active_nodes: string[]; // Highlighted nodes for current step
  decision_branch: 'yes' | 'no' | null; // 'yes' or 'no' if evaluating a decision diamond
  operation: string; // Badge text, e.g. "Comparing arr[0] and arr[1]"
  indices_examined: string; // e.g. "Indices 0 and 1"
  condition: string | null; // e.g. "arr[0] > arr[1] (5 > 2)"
  evaluation: string | null; // "True -> Swap required" or "False -> No swap"
  what_happened: string; // Precise description of the transformation
  why_it_matters: string; // Pedagogical significance
}
