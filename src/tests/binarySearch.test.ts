import { describe, it, expect } from 'vitest';
import { binary_search } from '../algorithms/searching/binarySearch';
import { mapBinarySearchStepToInsight } from '../explanations/binarySearch';

describe('Binary Search Algorithm & Trace Generator', () => {
  const array = [10, 20, 30, 40, 50, 60, 70];

  it('finds target at middle index', () => {
    const { found_index, steps } = binary_search(array, 40);
    expect(found_index).toBe(3);
    const matchStep = steps.find((s) => s.action === 'match');
    expect(matchStep).toBeDefined();
    expect(matchStep?.mid).toBe(3);
  });

  it('finds target at first index', () => {
    const { found_index } = binary_search(array, 10);
    expect(found_index).toBe(0);
  });

  it('finds target at last index', () => {
    const { found_index } = binary_search(array, 70);
    expect(found_index).toBe(6);
  });

  it('returns -1 and not_found action when target is not present', () => {
    const { found_index, steps } = binary_search(array, 99);
    expect(found_index).toBe(-1);
    const notFoundStep = steps[steps.length - 1];
    expect(notFoundStep.action).toBe('not_found');
  });

  it('returns -1 when target is lower than smallest element', () => {
    const { found_index } = binary_search(array, 2);
    expect(found_index).toBe(-1);
  });

  it('returns -1 when target is between existing elements', () => {
    const { found_index } = binary_search(array, 25);
    expect(found_index).toBe(-1);
  });

  it('handles single element array matching target', () => {
    const { found_index } = binary_search([42], 42);
    expect(found_index).toBe(0);
  });

  it('handles single element array missing target', () => {
    const { found_index } = binary_search([42], 10);
    expect(found_index).toBe(-1);
  });

  it('handles empty array cleanly', () => {
    const { found_index, steps } = binary_search([], 5);
    expect(found_index).toBe(-1);
    expect(steps[steps.length - 1].action).toBe('not_found');
  });

  it('handles arrays with negative numbers', () => {
    const negArray = [-50, -20, -5, 0, 15, 30];
    const { found_index } = binary_search(negArray, -20);
    expect(found_index).toBe(1);
  });

  it('handles even length arrays', () => {
    const evenArray = [2, 4, 6, 8];
    const { found_index } = binary_search(evenArray, 6);
    expect(found_index).toBe(2);
  });

  it('initial step has full bounds and 0 eliminated indices', () => {
    const { steps } = binary_search(array, 20);
    expect(steps[0].action).toBe('initial');
    expect(steps[0].low).toBe(0);
    expect(steps[0].high).toBe(6);
    expect(steps[0].eliminated_indices.length).toBe(0);
  });

  it('monotonically expands eliminated indices on discard_left and discard_right', () => {
    const { steps } = binary_search(array, 60);
    let prevEliminatedCount = 0;

    for (const step of steps) {
      if (step.action === 'discard_left' || step.action === 'discard_right') {
        expect(step.eliminated_indices.length).toBeGreaterThanOrEqual(prevEliminatedCount);
        prevEliminatedCount = step.eliminated_indices.length;
      }
    }
    expect(prevEliminatedCount).toBeGreaterThan(0);
  });

  it('calculates mid accurately using floor division', () => {
    const { steps } = binary_search([1, 2, 3, 4], 3);
    const midStep = steps.find((s) => s.action === 'calculate_mid');
    expect(midStep).toBeDefined();
    expect(midStep?.mid).toBe(Math.floor((0 + 3) / 2)); // 1
  });
});

describe('Binary Search Pedagogical Explanation Mapper', () => {
  it('maps initial step to formula and interval text', () => {
    const step = {
      step_number: 0,
      action: 'initial' as const,
      low: 0,
      high: 4,
      mid: null,
      target: 25,
      array: [10, 20, 30, 40, 50],
      eliminated_indices: [],
      description: 'Init'
    };
    const insight = mapBinarySearchStepToInsight(step, 5);
    expect(insight.badge).toContain('Initialized');
    expect(insight.formula).toContain('low = 0');
    expect(insight.interval_text).toContain('[0, 4]');
    expect(insight.remaining_elements).toBe(5);
  });

  it('maps calculate_mid and compare steps with explanations', () => {
    const step = {
      step_number: 1,
      action: 'calculate_mid' as const,
      low: 0,
      high: 4,
      mid: 2,
      target: 30,
      array: [10, 20, 30, 40, 50],
      eliminated_indices: [],
      description: 'Mid'
    };
    const insight = mapBinarySearchStepToInsight(step, 5);
    expect(insight.formula).toContain('mid');
    expect(insight.what_happened).toBeDefined();
    expect(insight.why_it_matters).toBeDefined();
  });

  it('maps match step with celebration insight', () => {
    const step = {
      step_number: 3,
      action: 'match' as const,
      low: 2,
      high: 4,
      mid: 2,
      target: 30,
      array: [10, 20, 30, 40, 50],
      eliminated_indices: [0, 1],
      description: 'Match'
    };
    const insight = mapBinarySearchStepToInsight(step, 5);
    expect(insight.badge).toBe('Target Found!');
    expect(insight.badge_color).toBe('emerald');
  });

  it('maps discard_left step with boundary update insight', () => {
    const step = {
      step_number: 2,
      action: 'discard_left' as const,
      low: 3,
      high: 4,
      mid: 2,
      target: 40,
      array: [10, 20, 30, 40, 50],
      eliminated_indices: [0, 1, 2],
      description: 'Discard left'
    };
    const insight = mapBinarySearchStepToInsight(step, 5);
    expect(insight.badge).toContain('Pruning Left');
    expect(insight.formula).toContain('low = mid + 1');
  });
});
