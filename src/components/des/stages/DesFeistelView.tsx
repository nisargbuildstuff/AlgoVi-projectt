/**
 * DesFeistelView — The main Feistel Network stage view.
 * Shows:
 *   - 16-round horizontal selector with mini data-flow hint
 *   - Large interactive DesRoundFlowDiagram SVG
 *   - Per-round data cards (L, R, Subkey, f-output)
 *   - Button to open the round function inspector
 */
import React, { useState } from 'react';
import { DesRoundGroup, DesRoundSummary } from '../../../types/des';
import { DesRoundFlowDiagram } from '../pipeline/DesRoundFlowDiagram';
import { RoundOperationInspector } from '../pipeline/RoundOperationInspector';
import { Cpu, ChevronRight, Info } from 'lucide-react';

type OpKey = 'expansion' | 'xor' | 'sbox' | 'pbox';

interface DesFeistelViewProps {
  rounds: DesRoundGroup[];
  selectedRound: number;
  onSelectRound: (r: number) => void;
  summaries: DesRoundSummary[];
}

export const DesFeistelView: React.FC<DesFeistelViewProps> = ({
  rounds,
  selectedRound,
  onSelectRound,
  summaries,
}) => {
  const [inspectingOp, setInspectingOp] = useState<boolean>(false);
  const [activeOp, setActiveOp] = useState<OpKey | null>(null);

  const roundGroup = rounds[selectedRound - 1] || rounds[0];
  const summary = summaries[selectedRound - 1] || summaries[0];

  const rStart = roundGroup?.steps?.round_start;
  const rXor = roundGroup?.steps?.feistel_xor;

  const prevL = (rStart?.data.left_hex as string) || '';
  const prevR = (rStart?.data.right_hex as string) || '';
  const subkey = (rStart?.data.subkey_hex as string) || summary?.subkey_hex || '';
  const fOutput = (roundGroup?.steps?.permutation?.data.f_output_hex as string) || summary?.f_hex || '';
  const nextL = (rXor?.data.left_hex as string) || summary?.left_hex || '';
  const nextR = (rXor?.data.right_hex as string) || summary?.right_hex || '';

  if (inspectingOp && roundGroup) {
    return (
      <RoundOperationInspector
        roundGroup={roundGroup}
        selectedRound={selectedRound}
        initialOp={activeOp || 'expansion'}
        onActiveOpChange={(op) => setActiveOp(op)}
        onBack={() => setInspectingOp(false)}
      />
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-200">
            Stage 3: Feistel Network — Round {selectedRound} of 16
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            L{selectedRound} = R{selectedRound - 1} &nbsp;|&nbsp;
            R{selectedRound} = L{selectedRound - 1} ⊕ f(R{selectedRound - 1}, K{selectedRound})
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setActiveOp(null); setInspectingOp(true); }}
          className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-[var(--text-on-accent)] font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Inspect f(R, K) Operations</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 16-Round Ribbon */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400">Select round (1–16):</span>
          <span className="font-mono text-purple-400 font-bold">Round {selectedRound} / 16</span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 select-none">
          {Array.from({ length: 16 }, (_, i) => i + 1).map((r) => {
            const isSelected = selectedRound === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onSelectRound(r)}
                className={`py-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-[var(--text-on-accent)] font-bold border-purple-400 shadow-lg shadow-purple-600/30 ring-2 ring-purple-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] font-mono">R{r}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Data cards: L, R, K, f() */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30 space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1">
            <span>L{selectedRound - 1}</span>
            <span title="Previous left half"><Info className="w-3 h-3 text-slate-500" /></span>
          </div>
          <div className="text-sm font-bold text-sky-300 truncate">{prevL || '—'}</div>
          <div className="text-[9px] text-slate-500">Left half in (32b)</div>
        </div>
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-emerald-400">R{selectedRound - 1}</div>
          <div className="text-sm font-bold text-emerald-300 truncate">{prevR || '—'}</div>
          <div className="text-[9px] text-slate-500">Right half in (32b)</div>
        </div>
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-amber-400">K{selectedRound}</div>
          <div className="text-sm font-bold text-amber-300 truncate">{subkey || '—'}</div>
          <div className="text-[9px] text-slate-500">Subkey (48b)</div>
        </div>
        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5 cursor-pointer hover:border-purple-400 transition" onClick={() => { setActiveOp(null); setInspectingOp(true); }}>
          <div className="text-[10px] uppercase font-bold text-purple-400">f(R, K)</div>
          <div className="text-sm font-bold text-purple-300 truncate">{fOutput || '—'}</div>
          <div className="text-[9px] text-purple-500">↗ Click to inspect</div>
        </div>
      </div>

      {/* Central Feistel Diagram */}
      <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-3">
        <DesRoundFlowDiagram
          round={selectedRound}
          prevLHex={prevL}
          prevRHex={prevR}
          subkeyHex={subkey}
          fOutputHex={fOutput}
          nextLHex={nextL}
          nextRHex={nextR}
          activeOp={activeOp}
          onClickRoundFunction={() => { setActiveOp(null); setInspectingOp(true); }}
        />
      </div>

      {/* Output values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/50 space-y-1.5 font-mono text-xs">
          <div className="text-[10px] uppercase font-bold text-emerald-400">New Left L{selectedRound} (= R{selectedRound - 1})</div>
          <div className="text-sm font-bold text-emerald-300">{nextL || '—'}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/50 space-y-1.5 font-mono text-xs">
          <div className="text-[10px] uppercase font-bold text-rose-400">New Right R{selectedRound} (= L{selectedRound - 1} ⊕ f)</div>
          <div className="text-sm font-bold text-rose-300">{nextR || '—'}</div>
        </div>
      </div>

      {selectedRound === 16 && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex gap-2.5">
          <span className="text-lg leading-none shrink-0">★</span>
          <p className="leading-relaxed">
            <strong>Round 16 is special:</strong> the final swap is intentionally skipped.
            The halves are written as R₁₆ ‖ L₁₆ before the final permutation. This clever
            symmetry lets DES decrypt using the exact same hardware with subkeys in reverse order.
          </p>
        </div>
      )}
    </div>
  );
};
