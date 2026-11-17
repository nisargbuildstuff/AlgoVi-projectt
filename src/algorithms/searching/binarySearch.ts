import { BinarySearchResult, BinarySearchStep } from '../../types/binarySearch';

/**
 * Executes Binary Search and produces a step-by-step trace.
 * Assumption: arr should be sorted for correct binary search behavior.
 */
export function binary_search(arr: number[], target: number): BinarySearchResult {
  const steps: BinarySearchStep[] = [];
  let stepNumber = 0;
  const n = arr.length;

  const getEliminated = (l: number, h: number): number[] => {
    const eliminated: number[] = [];
    for (let i = 0; i < n; i++) {
      if (i < l || i > h) {
        eliminated.push(i);
      }
    }
    return eliminated;
  };

  let low = 0;
  let high = n - 1;
  let foundIndex = -1;

  // Step 0: Initial
  steps.push({
    step_number: stepNumber++,
    action: 'initial',
    low,
    high,
    mid: null,
    target,
    array: [...arr],
    eliminated_indices: getEliminated(low, high),
    description: `Searching for target ${target} in array of length ${n} with search space [0, ${high}].`
  });

  if (n === 0) {
    steps.push({
      step_number: stepNumber++,
      action: 'not_found',
      low: 0,
      high: -1,
      mid: null,
      target,
      array: [],
      eliminated_indices: [],
      description: `Array is empty. Target ${target} cannot be found.`
    });
    return { found_index: -1, steps };
  }

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    // 1. Calculate mid
    steps.push({
      step_number: stepNumber++,
      action: 'calculate_mid',
      low,
      high,
      mid,
      target,
      array: [...arr],
      eliminated_indices: getEliminated(low, high),
      description: `Calculated middle index: mid = ⌊(${low} + ${high}) / 2⌋ = ${mid} (value = ${arr[mid]}).`
    });

    const midVal = arr[mid];

    // 2. Compare mid value with target
    steps.push({
      step_number: stepNumber++,
      action: 'compare',
      low,
      high,
      mid,
      target,
      array: [...arr],
      eliminated_indices: getEliminated(low, high),
      description: `Comparing arr[${mid}] (${midVal}) with target (${target}).`
    });

    if (midVal === target) {
      foundIndex = mid;
      steps.push({
        step_number: stepNumber++,
        action: 'match',
        low,
        high,
        mid,
        target,
        array: [...arr],
        eliminated_indices: getEliminated(low, high),
        description: `Target ${target} found at index ${mid}!`
      });
      break;
    } else if (midVal < target) {
      // Discard left half
      const prevLow = low;
      low = mid + 1;
      steps.push({
        step_number: stepNumber++,
        action: 'discard_left',
        low,
        high,
        mid,
        target,
        array: [...arr],
        eliminated_indices: getEliminated(low, high),
        description: `Since arr[${mid}] (${midVal}) < ${target}, target must be in right half. Discarding left range [${prevLow}, ${mid}]. New low = ${low}.`
      });
    } else {
      // Discard right half
      const prevHigh = high;
      high = mid - 1;
      steps.push({
        step_number: stepNumber++,
        action: 'discard_right',
        low,
        high,
        mid,
        target,
        array: [...arr],
        eliminated_indices: getEliminated(low, high),
        description: `Since arr[${mid}] (${midVal}) > ${target}, target must be in left half. Discarding right range [${mid}, ${prevHigh}]. New high = ${high}.`
      });
    }
  }

  if (foundIndex === -1) {
    steps.push({
      step_number: stepNumber++,
      action: 'not_found',
      low,
      high,
      mid: null,
      target,
      array: [...arr],
      eliminated_indices: getEliminated(low, high),
      description: `low (${low}) > high (${high}): Search interval is empty. Target ${target} is not in the array.`
    });
  }

  return { found_index: foundIndex, steps };
}
