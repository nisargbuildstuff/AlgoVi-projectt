import React, { useLayoutEffect, useRef } from 'react';
import { ExecutionStep } from '../../types/steps';

interface ArrayBarChartProps {
  step: ExecutionStep;
  initialArray: number[];
  itemIds: number[];
}

export const ArrayBarChart: React.FC<ArrayBarChartProps> = ({ step, initialArray, itemIds }) => {
  const { state, action, indices } = step;
  const itemRefs = useRef(new Map<number, HTMLDivElement>());
  const previousPositions = useRef(new Map<number, DOMRect>());
  const animationFrame = useRef<number | null>(null);
  const maxVal = Math.max(...initialArray, ...state, 10);
  const minVal = Math.min(...initialArray, ...state, 0);
  const range = maxVal - minVal || 1;

  const MAX_BAR_HEIGHT_PX = 190; // Fixed canvas height in pixels

  useLayoutEffect(() => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
    }

    const nextPositions = new Map<number, DOMRect>();
    const movingItems: HTMLDivElement[] = [];

    itemIds.forEach((id) => {
      const element = itemRefs.current.get(id);
      if (!element) return;

      const nextPosition = element.getBoundingClientRect();
      const previousPosition = previousPositions.current.get(id);
      nextPositions.set(id, nextPosition);

      if (previousPosition) {
        const deltaX = previousPosition.left - nextPosition.left;
        const deltaY = previousPosition.top - nextPosition.top;
        if (deltaX !== 0 || deltaY !== 0) {
          element.style.transition = 'none';
          element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          movingItems.push(element);
        }
      }
    });

    previousPositions.current = nextPositions;

    if (movingItems.length > 0) {
      movingItems[0].getBoundingClientRect();
      animationFrame.current = requestAnimationFrame(() => {
        movingItems.forEach((element) => {
          element.style.transition = 'transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1)';
          element.style.transform = 'translate(0, 0)';
        });
        animationFrame.current = null;
      });
    }

    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
    };
  }, [itemIds]);

  // Determine bar color for element at index i
  const getBarColor = (index: number) => {
    // If fully sorted action
    if (action === 'sorted' || (indices.includes(index) && action === 'sorted')) {
      return 'var(--success)'; // Emerald
    }
    // If elements are being compared
    if (action === 'compare' && indices.includes(index)) {
      return 'var(--highlight)'; // Amber
    }
    // If elements are swapping
    if (action === 'swap' && indices.includes(index)) {
      return 'var(--danger)'; // Crimson
    }
    // If pass complete locked elements
    if (action === 'pass_complete' && indices.includes(index)) {
      return 'var(--success)'; // Emerald
    }
    // Default
    return 'var(--accent)'; // Primary Blue
  };

  return (
    <div className="w-full select-none pt-4 pb-2">
      {/* Chart Canvas Area */}
      <div className="w-full h-72 flex items-end justify-center gap-3 px-4 pb-2 border-b-2 border-slate-700/80">
        {state.map((val, idx) => {
          const itemId = itemIds[idx];
          // Compute exact pixel height
          const barHeightPx = Math.max(28, Math.round(((val - minVal) / range) * MAX_BAR_HEIGHT_PX));
          const color = getBarColor(idx);
          const isExamined = indices.includes(idx);

          return (
            <div
              key={itemId}
              ref={(element) => {
                if (element) {
                  itemRefs.current.set(itemId, element);
                } else {
                  itemRefs.current.delete(itemId);
                }
              }}
              className="flex-1 max-w-[60px] h-full flex flex-col justify-end items-center gap-1.5 will-change-transform"
            >
              {/* Value on top of bar */}
              <span
                className={`text-xs font-mono font-bold transition-all duration-300 select-none ${
                  isExamined
                    ? 'text-white scale-125 filter drop-shadow-[0_0_8px_var(--glow-on-accent)]'
                    : 'text-slate-300'
                }`}
              >
                {val}
              </span>

              {/* Physical Visible Bar */}
              <div
                className={`w-full rounded-t-lg transition-[height,background-color,box-shadow,filter] duration-300 ease-in-out ${
                  isExamined
                    ? 'ring-2 ring-white/90 brightness-125 scale-x-105'
                    : 'hover:brightness-110'
                }`}
                style={{
                  height: `${barHeightPx}px`,
                  minHeight: '28px',
                  backgroundColor: color,
                  boxShadow: isExamined ? `0 0 20px ${color}` : `0 4px 8px var(--shadow-color)`
                }}
              />

              {/* Subscript Tag under bar */}
              <div className="h-6 flex flex-col items-center justify-start">
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  [{idx}]
                </span>
                {isExamined && (
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider animate-pulse ${
                      action === 'swap'
                        ? 'text-rose-400'
                        : action === 'compare'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {action === 'compare' ? 'CMP' : action === 'swap' ? 'SWAP' : 'LOCK'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis Baseline Caption */}
      <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 px-4 pt-2">
        <span>Index 0</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--accent)]" /> Default
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--highlight)]" /> Compare
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--danger)]" /> Swap
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--success)]" /> Sorted
          </span>
        </div>
        <span>Index {state.length - 1}</span>
      </div>
    </div>
  );
};
