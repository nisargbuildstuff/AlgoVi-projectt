import React from 'react';
import { SBoxLookupDetail } from '../../types/des';
import { Layers } from 'lucide-react';

interface SBoxMatrixVisualizerProps {
  sboxes: SBoxLookupDetail[];
}

export const SBoxMatrixVisualizer: React.FC<SBoxMatrixVisualizerProps> = ({ sboxes }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
        <Layers className="w-4 h-4 text-purple-400" />
        <span>8 S-Box Substitution Matrix Lookups (48-bit → 32-bit Non-linear Confusion)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sboxes.map((sb) => (
          <div
            key={sb.box_index}
            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 transition-all space-y-2 group"
          >
            {/* Box Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-xs font-bold text-purple-400">
                S-Box S{sb.box_index}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                4-bit out: <strong className="text-white">{sb.output_4bit}</strong> ({sb.output_val})
              </span>
            </div>

            {/* 6-bit Input representation */}
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>Input (6-bits):</span>
                <span className="font-mono text-slate-200">{sb.input_6bit}</span>
              </div>

              {/* Bit decomposition */}
              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-slate-500">Row (b₁b₆): </span>
                  <strong className="text-amber-400">{sb.row_bits}</strong>
                  <span className="text-slate-400"> ({sb.row})</span>
                </div>
                <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-slate-500">Col (b₂-b₅): </span>
                  <strong className="text-sky-400">{sb.col_bits}</strong>
                  <span className="text-slate-400"> ({sb.col})</span>
                </div>
              </div>
            </div>

            {/* Lookup result summary */}
            <div className="pt-1 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-400">
              <span>S{sb.box_index}[{sb.row}][{sb.col}]</span>
              <span className="font-mono text-emerald-400 font-bold">
                = {sb.output_val} (0b{sb.output_4bit})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
