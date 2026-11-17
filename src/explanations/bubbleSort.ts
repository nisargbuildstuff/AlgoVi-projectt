import { ExecutionStep, FlowchartStageInfo } from '../types/steps';

/**
 * 12-stage Flowchart definition and insight mapper for Bubble Sort.
 */

export interface FlowchartNode {
  id: string;
  label: string;
  shape: 'oval' | 'box' | 'diamond';
  description: string;
}

export const FLOWCHART_NODES: FlowchartNode[] = [
  { id: 'start', label: 'Start', shape: 'oval', description: 'Begin Bubble Sort execution' },
  { id: 'init_outer', label: 'i = 0\n(Outer Loop Init)', shape: 'box', description: 'Initialize outer pass counter i' },
  { id: 'check_outer', label: 'i < n - 1 ?', shape: 'diamond', description: 'Check if more passes are required' },
  { id: 'init_inner', label: 'j = 0\n(Inner Loop Init)', shape: 'box', description: 'Initialize adjacent comparison index j' },
  { id: 'check_inner', label: 'j < n - i - 1 ?', shape: 'diamond', description: 'Check if current comparison is within unsorted boundary' },
  { id: 'compare_elements', label: 'Compare arr[j]\n& arr[j+1]', shape: 'box', description: 'Inspect adjacent element pair' },
  { id: 'decision_swap', label: 'arr[j] > arr[j+1] ?', shape: 'diamond', description: 'Evaluate if elements are inverted' },
  { id: 'do_swap', label: 'Swap arr[j]\n& arr[j+1]', shape: 'box', description: 'Exchange elements to maintain ascending order' },
  { id: 'advance_inner', label: 'j = j + 1', shape: 'box', description: 'Advance to next adjacent pair' },
  { id: 'pass_done', label: 'Pass Complete\n(Lock Element)', shape: 'box', description: 'Largest unsorted item bubbled to terminal position' },
  { id: 'all_sorted', label: 'Array is Sorted!', shape: 'box', description: 'Termination condition met early or all passes completed' },
  { id: 'end', label: 'End', shape: 'oval', description: 'Algorithm terminates' }
];

export function mapBubbleSortStepToFlowchart(
  step: ExecutionStep,
  totalSteps: number,
  arrayLength: number
): FlowchartStageInfo {
  const { action, indices, state } = step;

  switch (action) {
    case 'start':
      return {
        stage_id: 'start',
        active_nodes: ['start', 'init_outer'],
        decision_branch: null,
        operation: 'Initializing Bubble Sort',
        indices_examined: 'None',
        condition: null,
        evaluation: null,
        what_happened: `Loaded array with ${arrayLength} items: [${state.join(', ')}].`,
        why_it_matters: 'Bubble sort needs an array of length n. Pass counter i will begin at 0.'
      };

    case 'compare': {
      const [j, jNext] = indices;
      const valA = state[j];
      const valB = state[jNext];
      const willSwap = valA > valB;

      return {
        stage_id: 'compare_elements',
        active_nodes: ['check_inner', 'compare_elements', 'decision_swap'],
        decision_branch: willSwap ? 'yes' : 'no',
        operation: `Comparing arr[${j}] and arr[${jNext}]`,
        indices_examined: `Indices ${j} and ${jNext}`,
        condition: `arr[${j}] > arr[${jNext}] (${valA} > ${valB})`,
        evaluation: willSwap ? 'True -> Swap required' : 'False -> Elements in order',
        what_happened: `Read elements ${valA} (at index ${j}) and ${valB} (at index ${jNext}) for comparison.`,
        why_it_matters: 'Bubble sort bubbles larger elements to the right by repeatedly checking adjacent pairs.'
      };
    }

    case 'swap': {
      const [j, jNext] = indices;
      const valA = state[j]; // Note: in state it is already swapped!
      const valB = state[jNext];

      return {
        stage_id: 'do_swap',
        active_nodes: ['decision_swap', 'do_swap', 'advance_inner'],
        decision_branch: 'yes',
        operation: `Swapped arr[${j}] and arr[${jNext}]`,
        indices_examined: `Indices ${j} and ${jNext}`,
        condition: `Inversion found: Previous value > next value`,
        evaluation: 'Elements exchanged',
        what_happened: `Exchanged values so that smaller element is at ${j} (${valA}) and larger at ${jNext} (${valB}).`,
        why_it_matters: 'Every swap reduces total inversions in the array, moving toward sorted stability.'
      };
    }

    case 'no_swap': {
      const [j, jNext] = indices;
      const valA = state[j];
      const valB = state[jNext];

      return {
        stage_id: 'advance_inner',
        active_nodes: ['decision_swap', 'advance_inner'],
        decision_branch: 'no',
        operation: `Kept arr[${j}] and arr[${jNext}] in place`,
        indices_examined: `Indices ${j} and ${jNext}`,
        condition: `arr[${j}] <= arr[${jNext}] (${valA} <= ${valB})`,
        evaluation: 'No swap needed',
        what_happened: `Elements are already in ascending order (${valA} <= ${valB}). Moving forward.`,
        why_it_matters: 'Skipping unnecessary swaps preserves the relative order of equal elements (stability).'
      };
    }

    case 'pass_complete': {
      const lockedIdx = indices[0];
      return {
        stage_id: 'pass_done',
        active_nodes: ['pass_done', 'check_outer'],
        decision_branch: null,
        operation: `Pass Complete`,
        indices_examined: `Index ${lockedIdx}`,
        condition: 'Inner loop boundary reached (j == n - i - 1)',
        evaluation: 'Item settled',
        what_happened: `The maximum element in the unsorted partition has surfaced to its final position at index ${lockedIdx}.`,
        why_it_matters: 'After pass i, the last (i+1) elements are guaranteed to be in their final sorted positions.'
      };
    }

    case 'sorted':
    default:
      return {
        stage_id: 'all_sorted',
        active_nodes: ['all_sorted', 'end'],
        decision_branch: null,
        operation: 'Sorting Complete!',
        indices_examined: 'All',
        condition: 'Outer loop terminated or zero swaps detected',
        evaluation: 'Array sorted',
        what_happened: `Algorithm finished in ${totalSteps} steps. All elements are sorted ascendingly.`,
        why_it_matters: 'Best-case time complexity is O(n) when early swap detection breaks, worst-case is O(n²).'
      };
  }
}
