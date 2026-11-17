import React from 'react';
import { DesRoundSummary } from '../../types/des';
import { Table, Key, Lock, Layers } from 'lucide-react';

interface RoundSummaryTableProps {
  summaries: DesRoundSummary[];
  activeRound?: number;
  onSelectRound?: (round: number) => void;
}

export const RoundSummaryTable: React.FC<RoundSummaryTableProps> = ({
  summaries,
  activeRound,
  onSelectRound
}) => {
  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-sm text-slate-200">16-Round Summary Matrix</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          NIST FIPS 46-3 Canonical Execution Trace
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Round</th>
              <th className="py-2.5 px-3">Subkey Kᵢ (48 bits / 12 hex)</th>
              <th className="py-2.5 px-3">Left Half Lᵢ (32 bits / 8 hex)</th>
              <th className="py-2.5 px-3">Right Half Rᵢ (32 bits / 8 hex)</th>
              <th className="py-2.5 px-3">Round Function f(Rᵢ₋₁, Kᵢ)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {summaries.map((row) => {
              const isSelected = activeRound === row.round;
              return (
                <tr
                  key={row.round}
                  onClick={() => onSelectRound && onSelectRound(row.round)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-purple-950/60 text-purple-200 font-bold border-l-4 border-purple-400'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-purple-400">
                    Round {row.round.toString().padStart(2, '0')}
                  </td>
                  <td className="py-2 px-3 text-amber-300 font-medium">
                    {row.subkey_hex}
                  </td>
                  <td className="py-2 px-3 text-sky-300">
                    {row.left_hex}
                  </td>
                  <td className="py-2 px-3 text-emerald-300">
                    {row.right_hex}
                  </td>
                  <td className="py-2 px-3 text-indigo-300">
                    {row.f_hex}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
