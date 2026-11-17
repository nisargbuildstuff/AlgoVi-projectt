import { ExecutionStep } from '../../types/steps';

/**
 * Generates step-by-step execution trace for Bubble Sort with early termination.
 */
export function bubble_sort_steps(inputArray: number[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const arr = [...inputArray];
  const n = arr.length;
  let stepNumber = 0;

  // 1. Initial start step
  steps.push({
    step_number: stepNumber++,
    state: [...arr],
    action: 'start',
    indices: [],
    description: `Initialized array with ${n} elements: [${arr.join(', ')}]`
  });

  if (n <= 1) {
    steps.push({
      step_number: stepNumber++,
      state: [...arr],
      action: 'sorted',
      indices: n === 1 ? [0] : [],
      description: `Array is fully sorted.`
    });
    return steps;
  }

  // Outer pass loop
  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      // Compare step
      const valA = arr[j];
      const valB = arr[j + 1];

      steps.push({
        step_number: stepNumber++,
        state: [...arr],
        action: 'compare',
        indices: [j, j + 1],
        description: `Comparing elements at indices ${j} and ${j + 1}: ${valA} and ${valB}`
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swappedInPass = true;

        steps.push({
          step_number: stepNumber++,
          state: [...arr],
          action: 'swap',
          indices: [j, j + 1],
          description: `Swapped elements at indices ${j} and ${j + 1}: ${temp} > ${arr[j]}, new order is [${arr[j]}, ${temp}]`
        });
      } else {
        // No swap
        steps.push({
          step_number: stepNumber++,
          state: [...arr],
          action: 'no_swap',
          indices: [j, j + 1],
          description: `No swap needed: ${valA} <= ${valB} at indices ${j} and ${j + 1}`
        });
      }
    }

    // Pass complete
    const sortedFromIndex = n - 1 - i;
    steps.push({
      step_number: stepNumber++,
      state: [...arr],
      action: 'pass_complete',
      indices: Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx),
      description: `Pass ${i + 1} complete. Element at index ${sortedFromIndex} (${arr[sortedFromIndex]}) is locked in place.`
    });

    // Optimized early break if no swaps occurred
    if (!swappedInPass) {
      break;
    }
  }

  // Final sorted step
  steps.push({
    step_number: stepNumber++,
    state: [...arr],
    action: 'sorted',
    indices: Array.from({ length: n }, (_, idx) => idx),
    description: `All elements are sorted: [${arr.join(', ')}]`
  });

  return steps;
}
