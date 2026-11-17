import { describe, it, expect } from 'vitest';
import { bubble_sort_steps } from '../algorithms/sorting/bubbleSort';
import { mapBubbleSortStepToFlowchart, FLOWCHART_NODES } from '../explanations/bubbleSort';

describe('Bubble Sort Algorithm & Trace Generator', () => {
  it('initial step has action=start with initial array snapshot', () => {
    const input = [5, 2, 8, 1];
    const steps = bubble_sort_steps(input);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].action).toBe('start');
    expect(steps[0].state).toEqual([5, 2, 8, 1]);
    expect(steps[0].step_number).toBe(0);
  });

  it('records comparisons and swap actions for unsorted pairs', () => {
    const input = [3, 1];
    const steps = bubble_sort_steps(input);
    const compareStep = steps.find((s) => s.action === 'compare');
    const swapStep = steps.find((s) => s.action === 'swap');

    expect(compareStep).toBeDefined();
    expect(compareStep?.indices).toEqual([0, 1]);
    expect(swapStep).toBeDefined();
    expect(swapStep?.state).toEqual([1, 3]);
  });

  it('records no_swap action when elements are already ordered', () => {
    const input = [1, 3];
    const steps = bubble_sort_steps(input);
    const noSwapStep = steps.find((s) => s.action === 'no_swap');
    expect(noSwapStep).toBeDefined();
    expect(noSwapStep?.indices).toEqual([0, 1]);
  });

  it('records pass_complete and sorted termination', () => {
    const input = [4, 3, 2];
    const steps = bubble_sort_steps(input);
    const passSteps = steps.filter((s) => s.action === 'pass_complete');
    const lastStep = steps[steps.length - 1];

    expect(passSteps.length).toBeGreaterThanOrEqual(1);
    expect(lastStep.action).toBe('sorted');
    expect(lastStep.state).toEqual([2, 3, 4]);
  });

  it('handles already sorted input efficiently with early termination', () => {
    const input = [1, 2, 3, 4, 5];
    const steps = bubble_sort_steps(input);
    // Only 1 pass is needed because no swaps occurred!
    const passSteps = steps.filter((s) => s.action === 'pass_complete');
    expect(passSteps.length).toBe(1);
    expect(steps[steps.length - 1].action).toBe('sorted');
    expect(steps[steps.length - 1].state).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles single element and empty arrays cleanly', () => {
    const single = bubble_sort_steps([42]);
    expect(single.length).toBe(2);
    expect(single[1].action).toBe('sorted');
    expect(single[1].state).toEqual([42]);

    const empty = bubble_sort_steps([]);
    expect(empty.length).toBe(2);
    expect(empty[1].action).toBe('sorted');
    expect(empty[1].state).toEqual([]);
  });

  it('sorts reverse ordered arrays correctly', () => {
    const input = [9, 7, 5, 3, 1];
    const steps = bubble_sort_steps(input);
    const finalStep = steps[steps.length - 1];
    expect(finalStep.action).toBe('sorted');
    expect(finalStep.state).toEqual([1, 3, 5, 7, 9]);
  });

  it('handles duplicate elements and negative numbers correctly', () => {
    const input = [5, -2, 5, 1, -2];
    const steps = bubble_sort_steps(input);
    const finalStep = steps[steps.length - 1];
    expect(finalStep.state).toEqual([-2, -2, 1, 5, 5]);
  });

  it('ensures step numbers are strictly sequential starting from 0', () => {
    const input = [8, 4, 6, 2];
    const steps = bubble_sort_steps(input);
    steps.forEach((step, idx) => {
      expect(step.step_number).toBe(idx);
    });
  });

  it('creates immutable copies for state snapshots so mutations do not leak', () => {
    const input = [3, 2, 1];
    const steps = bubble_sort_steps(input);
    // Mutating input array should not alter recorded snapshots
    input[0] = 999;
    expect(steps[0].state[0]).toBe(3);
  });
});

describe('Bubble Sort Flowchart & Explanation Mapper', () => {
  it('contains exactly 12 flowchart node specifications', () => {
    expect(FLOWCHART_NODES.length).toBe(12);
    const nodeIds = FLOWCHART_NODES.map((n) => n.id);
    expect(nodeIds).toContain('start');
    expect(nodeIds).toContain('init_outer');
    expect(nodeIds).toContain('check_outer');
    expect(nodeIds).toContain('init_inner');
    expect(nodeIds).toContain('check_inner');
    expect(nodeIds).toContain('compare_elements');
    expect(nodeIds).toContain('decision_swap');
    expect(nodeIds).toContain('do_swap');
    expect(nodeIds).toContain('advance_inner');
    expect(nodeIds).toContain('pass_done');
    expect(nodeIds).toContain('all_sorted');
    expect(nodeIds).toContain('end');
  });

  it('maps start step to flowchart stage correctly', () => {
    const step = {
      step_number: 0,
      state: [5, 2],
      action: 'start',
      indices: [],
      description: 'Start'
    };
    const info = mapBubbleSortStepToFlowchart(step, 5, 2);
    expect(info.stage_id).toBe('start');
    expect(info.active_nodes).toContain('start');
    expect(info.operation).toBeDefined();
  });

  it('maps compare step with decision branch yes/no correctly', () => {
    const stepA = {
      step_number: 1,
      state: [5, 2],
      action: 'compare',
      indices: [0, 1],
      description: 'Compare'
    };
    const infoA = mapBubbleSortStepToFlowchart(stepA, 5, 2);
    expect(infoA.decision_branch).toBe('yes'); // 5 > 2 -> yes

    const stepB = {
      step_number: 1,
      state: [2, 5],
      action: 'compare',
      indices: [0, 1],
      description: 'Compare'
    };
    const infoB = mapBubbleSortStepToFlowchart(stepB, 5, 2);
    expect(infoB.decision_branch).toBe('no'); // 2 <= 5 -> no
  });

  it('maps swap step to do_swap node with active nodes and explanation', () => {
    const step = {
      step_number: 2,
      state: [2, 5],
      action: 'swap',
      indices: [0, 1],
      description: 'Swapped'
    };
    const info = mapBubbleSortStepToFlowchart(step, 5, 2);
    expect(info.stage_id).toBe('do_swap');
    expect(info.active_nodes).toContain('do_swap');
    expect(info.what_happened).toBeDefined();
    expect(info.why_it_matters).toBeDefined();
  });

  it('maps pass_complete step with locked element indicator', () => {
    const step = {
      step_number: 3,
      state: [2, 5],
      action: 'pass_complete',
      indices: [1],
      description: 'Pass 1 complete'
    };
    const info = mapBubbleSortStepToFlowchart(step, 5, 2);
    expect(info.stage_id).toBe('pass_done');
    expect(info.active_nodes).toContain('pass_done');
    expect(info.indices_examined).toBe('Index 1');
  });

  it('maps sorted step to all_sorted node', () => {
    const step = {
      step_number: 4,
      state: [2, 5],
      action: 'sorted',
      indices: [0, 1],
      description: 'Sorted'
    };
    const info = mapBubbleSortStepToFlowchart(step, 5, 2);
    expect(info.stage_id).toBe('all_sorted');
    expect(info.active_nodes).toContain('all_sorted');
    expect(info.active_nodes).toContain('end');
  });
});
