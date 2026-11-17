import { BinarySearchStep } from '../types/binarySearch';

export interface BinarySearchInsight {
  badge: string;
  badge_color: 'blue' | 'amber' | 'emerald' | 'rose' | 'purple';
  formula: string;
  interval_text: string;
  remaining_elements: number;
  what_happened: string;
  why_it_matters: string;
}

export function mapBinarySearchStepToInsight(
  step: BinarySearchStep,
  totalSteps: number
): BinarySearchInsight {
  const { action, low, high, mid, target, array } = step;
  const remaining = Math.max(0, high - low + 1);

  switch (action) {
    case 'initial':
      return {
        badge: 'Initialized Search Bounds',
        badge_color: 'blue',
        formula: `low = 0, high = ${high}`,
        interval_text: `[${low}, ${high}] (${array.length} candidates)`,
        remaining_elements: array.length,
        what_happened: `Initial pointers established covering the full sorted array of ${array.length} elements.`,
        why_it_matters: 'Binary search requires sorted data so monotonic ordering can rule out half the space on each check.'
      };

    case 'calculate_mid':
      return {
        badge: 'Middle Pointer Computed',
        badge_color: 'purple',
        formula: `mid = ⌊(${low} + ${high}) / 2⌋ = ${mid}`,
        interval_text: `Current midpoint: index ${mid} (value ${mid !== null ? array[mid] : 'N/A'})`,
        remaining_elements: remaining,
        what_happened: `Computed the middle index ${mid} dividing the search interval into two halves.`,
        why_it_matters: 'Probing the midpoint guarantees that regardless of which branch is taken, at least half of remaining candidates are pruned.'
      };

    case 'compare': {
      const midVal = mid !== null ? array[mid] : null;
      return {
        badge: 'Evaluating Midpoint',
        badge_color: 'amber',
        formula: `arr[${mid}] (${midVal}) vs target (${target})`,
        interval_text: `Inspecting middle element ${midVal}`,
        remaining_elements: remaining,
        what_happened: `Comparing value ${midVal} at index ${mid} against target ${target}.`,
        why_it_matters: 'Three cases are possible: match found (done), value < target (target is on right), or value > target (target is on left).'
      };
    }

    case 'match':
      return {
        badge: 'Target Found!',
        badge_color: 'emerald',
        formula: `arr[${mid}] == ${target}`,
        interval_text: `Target locked at index ${mid}`,
        remaining_elements: 1,
        what_happened: `Target ${target} successfully matched at index ${mid}!`,
        why_it_matters: `Target located in just ${step.step_number + 1} steps out of maximum ⌈log₂(n)⌉ = ${Math.ceil(Math.log2(array.length || 1))} steps.`
      };

    case 'discard_left':
      return {
        badge: 'Pruning Left Half',
        badge_color: 'rose',
        formula: `low = mid + 1 = ${low}`,
        interval_text: `New search interval: [${low}, ${high}]`,
        remaining_elements: remaining,
        what_happened: `Since arr[${mid}] < ${target}, target cannot be anywhere in [0, ${mid}]. Shifted low pointer to ${low}.`,
        why_it_matters: 'Left partition eliminated in O(1) time without inspecting any of its individual elements.'
      };

    case 'discard_right':
      return {
        badge: 'Pruning Right Half',
        badge_color: 'rose',
        formula: `high = mid - 1 = ${high}`,
        interval_text: `New search interval: [${low}, ${high}]`,
        remaining_elements: remaining,
        what_happened: `Since arr[${mid}] > ${target}, target cannot be anywhere in [${mid}, ${array.length - 1}]. Shifted high pointer to ${high}.`,
        why_it_matters: 'Right partition eliminated in O(1) time without inspecting any of its individual elements.'
      };

    case 'not_found':
    default:
      return {
        badge: 'Target Not Present',
        badge_color: 'rose',
        formula: `low (${low}) > high (${high})`,
        interval_text: `Search range inverted / empty`,
        remaining_elements: 0,
        what_happened: `Pointers crossed (low > high). The search space contains 0 elements.`,
        why_it_matters: 'Proves conclusively that the target does not exist in the array within O(log n) total comparisons.'
      };
  }
}
