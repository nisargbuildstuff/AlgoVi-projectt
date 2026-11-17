import React from 'react';
import { ExecutionStep } from '../../types/steps';

interface ArrayCardViewProps {
  step: ExecutionStep;
}

export const ArrayCardView: React.FC<ArrayCardViewProps> = ({ step }) => {
  const { state, action, indices } = step;

  const getCardStyle = (index: number) => {
    if (action === 'sorted' || (action === 'pass_complete' && indices.includes(index))) {
      return 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 ring-2 ring-emerald-500/40 shadow-emerald-500/20';
    }
    if (action === 'compare' && indices.includes(index)) {
      return 'bg-amber-500/15 border-amber-500/50 text-amber-300 ring-2 ring-amber-500/40 shadow-amber-500/20 scale-105';
    }
    if (action === 'swap' && indices.includes(index)) {
      return 'bg-rose-500/15 border-rose-500/50 text-rose-300 ring-2 ring-rose-500/40 shadow-rose-500/20 scale-105';
    }
    return 'bg-slate-800/80 border-slate-700/80 text-slate-200';
  };

  return (
    <div className="w-full py-8 flex flex-wrap items-center justify-center gap-4">
      {state.map((val, idx) => {
        const isExamined = indices.includes(idx);
        return (
          <div key={idx} className="flex flex-col items-center gap-1.5">
            {/* Index Header */}
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              Index {idx}
            </span>

            {/* Value Card Pill */}
            <div
              className={`w-16 h-20 rounded-xl border flex flex-col items-center justify-center shadow-lg transition-all duration-300 ${getCardStyle(
                idx
              )}`}
            >
              <span className="text-2xl font-bold font-mono">{val}</span>
              {isExamined && (
                <span className="text-[9px] font-bold tracking-wider uppercase mt-1">
                  {action}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
