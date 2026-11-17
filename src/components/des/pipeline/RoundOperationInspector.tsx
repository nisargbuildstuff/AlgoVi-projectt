/**
 * RoundOperationInspector — Visualizes the 4 operations of the DES round function
 * as a connected horizontal pipeline with before/after values and explanations.
 * Expansion → XOR → S-Box → P-Box
 */
import React, { useState } from 'react';
import { E, P } from '../../../algorithms/cryptography/desTables';
import { format_bits_spaced, binary_to_hex } from '../../../algorithms/cryptography/desUtils';
import { DesRoundGroup, SBoxLookupDetail } from '../../../types/des';
import { SBoxGridInspector } from '../inspectors/SBoxGridInspector';
import { ChevronRight, Maximize2, Layers, Shuffle, ArrowRight } from 'lucide-react';

type OpKey = 'expansion' | 'xor' | 'sbox' | 'pbox';

interface RoundOperationInspectorProps {
  roundGroup: DesRoundGroup;
  selectedRound: number;
  initialOp?: OpKey;
  onActiveOpChange?: (op: OpKey | null) => void;
  onBack: () => void;
}

const OPS: { id: OpKey; label: string; short: string; icon: React.ReactNode; tagline: string; color: string; border: string; activeBg: string; activeText: string }[] = [
  {
    id: 'expansion', label: 'Expansion (E)', short: 'E', tagline: '32b → 48b',
    icon: <Maximize2 className="w-3.5 h-3.5" />,
    color: 'sky', border: 'border-sky-500/50', activeBg: 'bg-sky-950/40', activeText: 'text-sky-300',
  },
  {
    id: 'xor', label: 'Subkey XOR (⊕)', short: '⊕', tagline: '48b ⊕ K',
    icon: <Layers className="w-3.5 h-3.5" />,
    color: 'amber', border: 'border-amber-500/50', activeBg: 'bg-amber-950/40', activeText: 'text-amber-300',
  },
  {
    id: 'sbox', label: 'S-Box Substitution', short: 'S', tagline: '48b → 32b',
    icon: <Shuffle className="w-3.5 h-3.5" />,
    color: 'purple', border: 'border-purple-500/50', activeBg: 'bg-purple-950/40', activeText: 'text-purple-300',
  },
  {
    id: 'pbox', label: 'P-Box Permutation', short: 'P', tagline: '32b → f output',
    icon: <ChevronRight className="w-3.5 h-3.5" />,
    color: 'emerald', border: 'border-emerald-500/50', activeBg: 'bg-emerald-950/40', activeText: 'text-emerald-300',
  },
];

export const RoundOperationInspector: React.FC<RoundOperationInspectorProps> = ({
  roundGroup,
  selectedRound,
  initialOp = 'expansion',
  onActiveOpChange,
  onBack,
}) => {
  const [activeOp, setActiveOp] = useState<OpKey>(initialOp);
  const [selectedSbox, setSelectedSbox] = useState<number>(1);

  const handleOpSelect = (op: OpKey) => {
    setActiveOp(op);
    onActiveOpChange?.(op);
  };

  // Extract data from round group
  const rStart = roundGroup.steps.round_start;
  const prevR = (rStart?.data.right as string) || '';
  const prevRHex = (rStart?.data.right_hex as string) || '';
  const expandedBits = (roundGroup.steps.expansion?.data.expanded_bits as string) || '';
  const subkeyBits = (rStart?.data.subkey_bits as string) || '';
  const subkeyHex = (rStart?.data.subkey_hex as string) || '';
  const xorBits = (roundGroup.steps.key_xor?.data.xor_bits as string) || '';
  const sboxStep = roundGroup.steps.s_box;
  const sboxOutBits = (sboxStep?.data.sbox_out_bits as string) || '';
  const sboxOutHex = (sboxStep?.data.sbox_out_hex as string) || '';
  const sboxDetails = (sboxStep?.data.sboxes || []) as SBoxLookupDetail[];
  const pOutBits = (roundGroup.steps.permutation?.data.permuted_bits as string) || '';
  const pOutHex = (roundGroup.steps.permutation?.data.permuted_hex as string) || '';

  const currentSboxDetail: SBoxLookupDetail | undefined = sboxDetails[selectedSbox - 1] || sboxDetails[0];
  const currentOp = OPS.find(o => o.id === activeOp)!;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-200">
            Round {selectedRound} — Round Function f(R, K)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Four sequential operations transform R{selectedRound - 1} using subkey K{selectedRound}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition"
        >
          ← Back to Feistel Network
        </button>
      </div>

      {/* Connected pipeline selector */}
      <div className="flex items-center gap-0 overflow-x-auto select-none">
        {OPS.map((op, idx) => {
          const isActive = activeOp === op.id;
          const textCol = `text-${op.color}-300`;
          const borderCol = isActive ? op.border : 'border-slate-800';
          const bgCol = isActive ? op.activeBg : 'bg-slate-950/40';

          return (
            <React.Fragment key={op.id}>
              <button
                type="button"
                onClick={() => handleOpSelect(op.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition-all duration-200 min-w-[90px] ${bgCol} ${borderCol} ${
                  isActive ? `ring-2 ring-${op.color}-500/40 shadow-lg` : 'hover:bg-slate-900'
                }`}
              >
                <span className={isActive ? op.activeText : 'text-slate-500'}>{op.icon}</span>
                <span className={`text-[10px] font-bold ${isActive ? op.activeText : 'text-slate-400'}`}>
                  {op.label}
                </span>
                <span className="text-[9px] font-mono text-slate-500">{op.tagline}</span>
              </button>

              {idx < OPS.length - 1 && (
                <div className="flex-shrink-0 px-1">
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── EXPANSION ── */}
      {activeOp === 'expansion' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/30 text-xs text-sky-200 leading-relaxed">
            <strong className="text-sky-300">Expansion (E-Table):</strong> The 32-bit right half is
            expanded to 48 bits so it can be XORed with the 48-bit subkey. Boundary bits are{' '}
            <strong>duplicated</strong> so each bit influences two adjacent S-boxes — this causes
            small changes to cascade quickly (the <em>avalanche effect</em>).
          </div>

          {/* Before → After */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold uppercase text-slate-400">Input: R{selectedRound - 1} (32 bits)</div>
              <div className="font-mono text-sm font-bold text-sky-300">{prevRHex}</div>
              <div className="p-2 rounded bg-slate-900 font-mono text-[10px] text-slate-300 overflow-x-auto break-all">
                {format_bits_spaced(prevR, 4)}
              </div>
            </div>
            <div className="text-center hidden md:block">
              <div className="text-2xl text-sky-500 font-bold">→</div>
              <div className="text-[9px] text-slate-500 mt-1">E-Table</div>
            </div>
            <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/40 space-y-2">
              <div className="text-[10px] font-bold uppercase text-cyan-400">Output: Expanded E(R) (48 bits)</div>
              <div className="font-mono text-sm font-bold text-cyan-300">{binary_to_hex(expandedBits)}</div>
              <div className="p-2 rounded bg-slate-900 font-mono text-[10px] text-cyan-300 overflow-x-auto break-all">
                {format_bits_spaced(expandedBits, 6)}
              </div>
            </div>
          </div>

          {/* E-table grid */}
          <details className="group">
            <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-200 font-medium list-none flex items-center gap-1.5 select-none">
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
              Show E-Table mapping (amber = duplicated boundary bits)
            </summary>
            <div className="mt-3 grid grid-cols-6 gap-1 font-mono text-[10px] text-center">
              {E.map((srcPos, idx) => {
                const isDup = idx % 6 === 0 || idx % 6 === 5;
                return (
                  <div key={idx} className={`p-1.5 rounded border ${isDup ? 'bg-amber-950/40 border-amber-600/60 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                    <div className="opacity-50">#{idx + 1}</div>
                    <div className="font-bold">{srcPos}</div>
                    <div className="text-cyan-300 mt-0.5">{expandedBits[idx] || '0'}</div>
                  </div>
                );
              })}
            </div>
          </details>
        </div>
      )}

      {/* ── XOR ── */}
      {activeOp === 'xor' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
            <strong className="text-amber-300">Subkey XOR:</strong> Each bit of the 48-bit expanded
            value is XORed with the matching bit of subkey K{selectedRound}. XOR rule: same bits → 0,
            different bits → 1. This is how the secret key injects entropy into the data.
          </div>

          {/* Visual XOR stack */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="space-y-1.5">
              <div className="text-[10px] text-cyan-400 font-bold uppercase">① E(R{selectedRound - 1}) — Expanded Right (48 bits)</div>
              <div className="p-2.5 rounded bg-slate-900 text-cyan-300 overflow-x-auto break-all tracking-wider">
                {format_bits_spaced(expandedBits, 6)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-dashed border-slate-700" />
              <div className="text-amber-400 font-bold text-2xl">⊕</div>
              <div className="flex-1 border-t border-dashed border-slate-700" />
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] text-amber-400 font-bold uppercase">② K{selectedRound} — Subkey ({subkeyHex}) (48 bits)</div>
              <div className="p-2.5 rounded bg-slate-900 text-amber-300 overflow-x-auto break-all tracking-wider">
                {format_bits_spaced(subkeyBits, 6)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-dashed border-slate-700" />
              <div className="text-purple-400 font-bold text-xl">=</div>
              <div className="flex-1 border-t border-dashed border-slate-700" />
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] text-purple-400 font-bold uppercase">③ XOR Result → feeds into 8 S-Boxes (48 bits)</div>
              <div className="p-2.5 rounded bg-purple-950/40 border border-purple-500/40 text-purple-200 overflow-x-auto break-all tracking-wider font-bold">
                {format_bits_spaced(xorBits, 6)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── S-BOX ── */}
      {activeOp === 'sbox' && currentSboxDetail && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
            <strong className="text-purple-300">S-Box Substitution:</strong> The 48-bit XOR result is split
            into 8 groups of 6 bits. Each group enters one S-Box — a fixed 4×16 lookup table.
            The outer bits (b₁, b₆) select the row; the middle bits (b₂–b₅) select the column.
            Each S-Box outputs 4 bits → total 32 bits out. This is DES's core non-linearity.
          </div>
          <SBoxGridInspector
            sboxDetail={currentSboxDetail}
            activeBoxIndex={selectedSbox}
            onSelectBox={setSelectedSbox}
            allSboxDetails={sboxDetails}
          />
        </div>
      )}

      {/* ── P-BOX ── */}
      {activeOp === 'pbox' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
            <strong className="text-emerald-300">P-Box Permutation:</strong> The 32-bit S-Box output
            is shuffled by Table P. This spreads each S-Box's 4 output bits across different S-Boxes
            in the next round, ensuring changes propagate throughout the entire cipher — this is{' '}
            <em>diffusion</em>.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold uppercase text-purple-400">Input: S-Box Output (32 bits)</div>
              <div className="font-mono text-sm font-bold text-purple-300">{sboxOutHex}</div>
              <div className="p-2 rounded bg-slate-900 font-mono text-[10px] text-purple-200 overflow-x-auto break-all">
                {format_bits_spaced(sboxOutBits, 4)}
              </div>
            </div>
            <div className="text-center hidden md:block">
              <div className="text-2xl text-emerald-500 font-bold">→</div>
              <div className="text-[9px] text-slate-500 mt-1">P-Table</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
              <div className="text-[10px] font-bold uppercase text-emerald-400">Output: f(R, K) (32 bits)</div>
              <div className="font-mono text-sm font-bold text-emerald-300">{pOutHex}</div>
              <div className="p-2 rounded bg-slate-900 font-mono text-[10px] text-emerald-200 overflow-x-auto break-all">
                {format_bits_spaced(pOutBits, 4)}
              </div>
            </div>
          </div>

          <details className="group">
            <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-200 font-medium list-none flex items-center gap-1.5 select-none">
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
              Show P-Table mapping
            </summary>
            <div className="mt-3 grid grid-cols-8 gap-1 font-mono text-[10px] text-center">
              {P.map((srcPos, idx) => (
                <div key={idx} className="p-1.5 rounded border bg-slate-900 border-slate-800 text-slate-300">
                  <div className="opacity-50">#{idx + 1}</div>
                  <div className="font-bold text-emerald-400">{srcPos}</div>
                  <div className="text-slate-400 mt-0.5">{pOutBits[idx] || '0'}</div>
                </div>
              ))}
            </div>
          </details>

          {/* Final result callout */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-2.5 text-xs">
            <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-emerald-300">Round {selectedRound} result:</strong>{' '}
              f(R{selectedRound - 1}, K{selectedRound}) ={' '}
              <span className="font-mono text-emerald-300 font-bold">{pOutHex}</span>
              {' '}— this 32-bit output is XORed with L{selectedRound - 1} to produce R{selectedRound}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
