import React from 'react';
import { BinarySearchStep } from '../../types/binarySearch';
import { Target, ArrowRight, CornerDownRight } from 'lucide-react';

interface PointerCardsProps {
  step: BinarySearchStep;
}

export const PointerCards: React.FC<PointerCardsProps> = ({ step }) => {
  const { low, high, mid, target, array } = step;

  const lowVal = low >= 0 && low < array.length ? array[low] : 'None';
  const highVal = high >= 0 && high < array.length ? array[high] : 'None';
  const midVal = mid !== null && mid >= 0 && mid < array.length ? array[mid] : '—';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Target Card */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase text-[10px] tracking-wider text-amber-400">Target Key</span>
          <Target className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-mono font-bold text-amber-300">{target}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono mt-1">Search objective</span>
      </div>

      {/* Low Pointer */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase text-[10px] tracking-wider text-blue-400">Low Pointer (L)</span>
          <span className="w-2 h-2 rounded-full bg-blue-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-blue-300">{low}</span>
          <span className="text-xs font-mono text-slate-400">val: {lowVal}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono mt-1">Left search bound</span>
      </div>

      {/* Mid Pointer */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase text-[10px] tracking-wider text-purple-400">Mid Pointer (M)</span>
          <span className="w-2 h-2 rounded-full bg-purple-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-purple-300">{mid !== null ? mid : '—'}</span>
          <span className="text-xs font-mono text-slate-400">val: {midVal}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono mt-1">⌊(low + high) / 2⌋</span>
      </div>

      {/* High Pointer */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase text-[10px] tracking-wider text-rose-400">High Pointer (H)</span>
          <span className="w-2 h-2 rounded-full bg-rose-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-rose-300">{high}</span>
          <span className="text-xs font-mono text-slate-400">val: {highVal}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono mt-1">Right search bound</span>
      </div>
    </div>
  );
};
