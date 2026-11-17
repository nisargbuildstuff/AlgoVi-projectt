import React from 'react';
import { BinarySearchStep } from '../../types/binarySearch';

interface SearchArrayVisualizerProps {
  step: BinarySearchStep;
}

export const SearchArrayVisualizer: React.FC<SearchArrayVisualizerProps> = ({ step }) => {
  const { array, low, high, mid, eliminated_indices, action, target } = step;

  return (
    <div className="w-full py-8 overflow-x-auto select-none">
      <div className="flex items-end justify-center min-w-max gap-3 px-4">
        {array.map((val, idx) => {
          const isEliminated = eliminated_indices.includes(idx);
          const isLow = idx === low;
          const isHigh = idx === high;
          const isMid = idx === mid;
          const isMatch = action === 'match' && idx === mid;

          // Pointer labels for this index
          const pointers: { label: string; color: string }[] = [];
          if (isLow) pointers.push({ label: 'LOW', color: 'bg-blue-500 text-white' });
          if (isMid) pointers.push({ label: 'MID', color: 'bg-purple-500 text-white' });
          if (isHigh) pointers.push({ label: 'HIGH', color: 'bg-rose-500 text-white' });

          return (
            <div key={idx} className="flex flex-col items-center gap-2 group">
              {/* Pointer Callout Badges above */}
              <div className="h-10 flex flex-col items-center justify-end gap-1">
                {pointers.map((p, pIdx) => (
                  <span
                    key={pIdx}
                    className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded shadow ${p.color} animate-bounce`}
                    style={{ animationDuration: '1.5s' }}
                  >
                    {p.label}
                  </span>
                ))}
              </div>

              {/* Array Value Box */}
              <div
                className={`w-14 h-16 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
                  isMatch
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-4 ring-emerald-500/50 scale-110 shadow-emerald-500/30'
                    : isMid
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 ring-2 ring-purple-500/40 scale-105'
                    : isEliminated
                    ? 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-30 grayscale'
                    : 'bg-slate-800 border-slate-700 text-slate-100 hover:border-slate-600'
                }`}
              >
                <span className="font-mono text-xl font-bold">{val}</span>
              </div>

              {/* Index Subscript */}
              <div className="flex flex-col items-center">
                <span className={`text-[11px] font-mono ${isEliminated ? 'text-slate-600' : 'text-slate-400 font-semibold'}`}>
                  [{idx}]
                </span>
                {isEliminated && (
                  <span className="text-[8px] font-bold text-slate-600 uppercase">Pruned</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
