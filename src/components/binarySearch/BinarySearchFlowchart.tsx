import React from 'react';
import { BinarySearchStep } from '../../types/binarySearch';
import { ArrowDown, CheckCircle2, Search, SplitSquareVertical, RefreshCw, AlertCircle } from 'lucide-react';

interface BinarySearchFlowchartProps {
  step: BinarySearchStep;
  totalSteps: number;
}

export const BinarySearchFlowchart: React.FC<BinarySearchFlowchartProps> = ({ step }) => {
  const { action, low, high, mid, target, array } = step;
  const midVal = mid !== null && mid >= 0 && mid < array.length ? array[mid] : null;

  // Determine which flowchart node is currently active
  const isInitial = action === 'initial';
  const isCalcMid = action === 'calculate_mid';
  const isCompare = action === 'compare';
  const isMatch = action === 'match';
  const isDiscardLeft = action === 'discard_left';
  const isDiscardRight = action === 'discard_right';
  const isNotFound = action === 'not_found';

  const isBoundsCheckActive = isInitial || isCalcMid || isNotFound;
  const boundsCondition = low <= high;

  return (
    <div className="algovi-card bg-[var(--surface-card)] border border-slate-800/80 p-4 flex flex-col h-full space-y-3 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-100">Binary Search Flowchart</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
              O(log n)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Automaton tracking current decision branch</p>
        </div>

        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
          Step {step.step_number + 1}
        </span>
      </div>

      {/* Synchronized Flowchart Nodes */}
      <div className="flex-1 overflow-y-auto space-y-2 py-1 pr-1 font-sans text-xs">
        {/* Node 1: Start & Bounds Initialization */}
        <div
          className={`p-3 rounded-xl border transition-all duration-300 ${
            isInitial
              ? 'bg-cyan-950/70 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
              : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <span className={`w-2 h-2 rounded-full ${isInitial ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className={isInitial ? 'text-cyan-300' : 'text-slate-300'}>
                1. Start & Init Bounds
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">low = 0, high = {array.length - 1}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Target:</span>
              <span className="text-amber-300 font-bold">{target}</span>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Array Size:</span>
              <span className="text-slate-200 font-bold">{array.length} items</span>
            </div>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className={`w-4 h-4 transition ${isBoundsCheckActive ? 'text-cyan-400 scale-125' : ''}`} />
        </div>

        {/* Node 2: Loop Condition Check: low <= high ? */}
        <div
          className={`p-3 rounded-xl border transition-all duration-300 ${
            isBoundsCheckActive
              ? 'bg-slate-900 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40 text-slate-200'
              : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <SplitSquareVertical className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Check: low ≤ high ?</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                boundsCondition
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {boundsCondition ? 'TRUE (Interval Active)' : 'FALSE (Crossed)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            low ({low}) ≤ high ({high}) → {boundsCondition ? 'Continue search' : 'Search space exhausted'}
          </p>
        </div>

        {/* Branch Down Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className={`w-4 h-4 transition ${isCalcMid || isCompare ? 'text-purple-400 scale-125' : ''}`} />
        </div>

        {/* Node 3: Compute Midpoint */}
        <div
          className={`p-3 rounded-xl border transition-all duration-300 ${
            isCalcMid
              ? 'bg-purple-950/70 border-purple-400 shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
              : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isCalcMid ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className={isCalcMid ? 'text-purple-300' : 'text-slate-300'}>
                3. Compute Midpoint
              </span>
            </span>
            <span className="text-[10px] font-mono text-purple-400 font-bold">mid = ⌊(L + H)/2⌋</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            mid = ⌊({low} + {high}) / 2⌋ = <strong className="text-purple-300 font-mono">{mid ?? '—'}</strong>
            {midVal !== null && (
              <span> (Value: <strong className="text-amber-300 font-mono">{midVal}</strong>)</span>
            )}
          </p>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className={`w-4 h-4 transition ${isCompare || isMatch ? 'text-amber-400 scale-125' : ''}`} />
        </div>

        {/* Node 4: Target Comparison: arr[mid] == target ? */}
        <div
          className={`p-3 rounded-xl border transition-all duration-300 ${
            isCompare
              ? 'bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400 text-slate-200'
              : isMatch
              ? 'bg-emerald-950/60 border-emerald-500/50 text-slate-300'
              : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Compare: arr[mid] == target ?</span>
            </span>
            {midVal !== null && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                {midVal} vs {target}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {midVal === target
              ? 'Match confirmed! Immediate O(1) return.'
              : midVal !== null && midVal < target
              ? `arr[${mid}] (${midVal}) < ${target} → Target is on the right.`
              : midVal !== null
              ? `arr[${mid}] (${midVal}) > ${target} → Target is on the left.`
              : 'Inspect current midpoint element.'}
          </p>
        </div>

        {/* Node 5: Branching Decisions: Discard Left or Discard Right */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Discard Left Branch */}
          <div
            className={`p-2.5 rounded-xl border transition-all duration-300 text-[11px] ${
              isDiscardLeft
                ? 'bg-rose-950/80 border-rose-400 shadow-md ring-1 ring-rose-400 text-slate-100'
                : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
            }`}
          >
            <div className="font-bold flex items-center justify-between mb-1">
              <span className={isDiscardLeft ? 'text-rose-300 font-bold' : 'text-slate-300'}>
                arr[mid] &lt; target
              </span>
              {isDiscardLeft && <span className="text-[9px] px-1 bg-rose-500/30 text-rose-200 rounded">Active</span>}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">low = mid + 1</p>
            <p className="text-[10px] text-slate-400 mt-1">Discard left half</p>
          </div>

          {/* Discard Right Branch */}
          <div
            className={`p-2.5 rounded-xl border transition-all duration-300 text-[11px] ${
              isDiscardRight
                ? 'bg-rose-950/80 border-rose-400 shadow-md ring-1 ring-rose-400 text-slate-100'
                : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
            }`}
          >
            <div className="font-bold flex items-center justify-between mb-1">
              <span className={isDiscardRight ? 'text-rose-300 font-bold' : 'text-slate-300'}>
                arr[mid] &gt; target
              </span>
              {isDiscardRight && <span className="text-[9px] px-1 bg-rose-500/30 text-rose-200 rounded">Active</span>}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">high = mid - 1</p>
            <p className="text-[10px] text-slate-400 mt-1">Discard right half</p>
          </div>
        </div>

        {/* Node 6: Terminal States (Match or Not Found) */}
        <div className="pt-2">
          {isMatch ? (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Result: Target Found at Index {mid}!</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 font-bold">
                Return {mid}
              </span>
            </div>
          ) : isNotFound ? (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-400 text-rose-300 shadow-lg shadow-rose-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Result: Target Not Present</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-200 font-bold">
                Return -1
              </span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Searching interval [{low}, {high}]...</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {Math.max(0, high - low + 1)} candidates left
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
