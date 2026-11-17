import React from 'react';
import { S_BOXES } from '../../../algorithms/cryptography/desTables';
import { SBoxLookupDetail } from '../../../types/des';
import { Layers, Crosshair, Sparkles } from 'lucide-react';

interface SBoxGridInspectorProps {
  sboxDetail: SBoxLookupDetail;
  activeBoxIndex: number;
  onSelectBox: (boxIndex: number) => void;
  allSboxDetails: SBoxLookupDetail[];
}

export const SBoxGridInspector: React.FC<SBoxGridInspectorProps> = ({
  sboxDetail,
  activeBoxIndex,
  onSelectBox,
  allSboxDetails
}) => {
  const currentMatrix = S_BOXES[activeBoxIndex - 1]; // 4 rows x 16 cols
  const { row, col, row_bits, col_bits, input_6bit, output_4bit, output_val } = sboxDetail;

  return (
    <div className="space-y-4">
      {/* 8 S-Boxes Selector Ribbon */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400">
            Select S-Box to Inspect (S₁ to S₈):
          </span>
          <span className="font-mono text-purple-400 font-bold">
            Selected: S-Box S{activeBoxIndex}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 select-none">
          {allSboxDetails.map((sb) => {
            const isSelected = sb.box_index === activeBoxIndex;
            return (
              <button
                key={sb.box_index}
                type="button"
                onClick={() => onSelectBox(sb.box_index)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-[var(--text-on-accent)] font-bold border-purple-400 shadow-md shadow-purple-600/30 ring-2 ring-purple-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] uppercase font-mono">Box</div>
                <div className="text-sm font-bold font-mono">S{sb.box_index}</div>
                <div className="text-[10px] mt-0.5 opacity-80 font-mono">→ {sb.output_val}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bit Breakdown Box */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-purple-400" />
            S-Box S{activeBoxIndex}: 6-Bit Input → 4-Bit Output Translation
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
            4-Bit Output: <strong className="text-white">{output_4bit}</strong> (Value: {output_val})
          </span>
        </div>

        {/* 6 bits breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">
              1. 6-Bit Input Block
            </span>
            <div className="flex items-center gap-1 text-sm font-bold">
              <span className="text-amber-400 border-b-2 border-amber-400" title="Bit 1 (Outer)">
                {input_6bit[0]}
              </span>
              <span className="text-sky-400 border-b-2 border-sky-400" title="Bits 2-5 (Inner)">
                {input_6bit.slice(1, 5)}
              </span>
              <span className="text-amber-400 border-b-2 border-amber-400" title="Bit 6 (Outer)">
                {input_6bit[5]}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-sans block">
              Outer bits (amber) + Inner bits (sky)
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1">
            <span className="text-amber-400 text-[10px] uppercase font-bold block">
              2. Row Selector (b₁ b₆)
            </span>
            <div className="text-sm font-bold text-amber-300">
              Bits: {row_bits} → Row {row}
            </div>
            <span className="text-[10px] text-slate-400 font-sans block">
              Outer bits determine row 0–3
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-sky-950/20 border border-sky-500/30 space-y-1">
            <span className="text-sky-400 text-[10px] uppercase font-bold block">
              3. Column Selector (b₂ b₃ b₄ b₅)
            </span>
            <div className="text-sm font-bold text-sky-300">
              Bits: {col_bits} → Col {col}
            </div>
            <span className="text-[10px] text-slate-400 font-sans block">
              Inner 4 bits determine col 0–15
            </span>
          </div>
        </div>
      </div>

      {/* 4x16 Full S-Box Matrix Grid with Cell Highlighting */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-300">
            S-Box S{activeBoxIndex} Substitution Matrix ($4 \times 16$ Grid)
          </span>
          <span className="font-mono text-emerald-400 text-xs">
            Target: S{activeBoxIndex}[Row {row}][Col {col}] = <strong>{output_val}</strong>
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-2">
          <table className="w-full text-center text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500">
                <th className="p-1.5 text-amber-400 font-bold">Row \ Col</th>
                {Array.from({ length: 16 }, (_, c) => (
                  <th
                    key={c}
                    className={`p-1.5 ${
                      c === col ? 'text-sky-400 font-bold bg-sky-500/10 rounded' : 'text-slate-400'
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentMatrix.map((rowArr, rIdx) => {
                const isTargetRow = rIdx === row;
                return (
                  <tr
                    key={rIdx}
                    className={`${isTargetRow ? 'bg-amber-500/10 font-bold' : ''}`}
                  >
                    <td className={`p-1.5 text-[11px] font-bold ${isTargetRow ? 'text-amber-400' : 'text-slate-500'}`}>
                      Row {rIdx}
                    </td>
                    {rowArr.map((cellVal, cIdx) => {
                      const isTargetCell = isTargetRow && cIdx === col;
                      return (
                        <td
                          key={cIdx}
                          className={`p-1.5 rounded transition ${
                            isTargetCell
                              ? 'bg-emerald-500 text-[var(--text-on-accent)] font-extrabold scale-110 shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-300'
                              : isTargetRow
                              ? 'text-amber-200'
                              : cIdx === col
                              ? 'text-sky-200 bg-sky-950/20'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {cellVal}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
