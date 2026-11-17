import React, { useState } from 'react';
import { IP } from '../../../algorithms/cryptography/desTables';
import { format_bits_spaced, binary_to_hex } from '../../../algorithms/cryptography/desUtils';
import { DesTraceStep } from '../../../types/des';
import { Shuffle, ArrowDown, Split, Info, Eye, Layers, Sparkles } from 'lucide-react';

interface InitialPermutationViewProps {
  inputStep?: DesTraceStep;
  ipStep?: DesTraceStep;
  isBeginnerMode?: boolean;
}

export const InitialPermutationView: React.FC<InitialPermutationViewProps> = ({
  inputStep,
  ipStep,
  isBeginnerMode = true
}) => {
  const [selectedBitIndex, setSelectedBitIndex] = useState<number | null>(null);
  const [showFullTable, setShowFullTable] = useState<boolean>(!isBeginnerMode);

  const rawHex = (inputStep?.data.hex as string) || '';
  const rawBits = (inputStep?.data.bits as string) || '';
  const ipHex = (ipStep?.data.hex as string) || '';
  const ipBits = (ipStep?.data.bits as string) || '';

  const l0Bits = ipBits.slice(0, 32);
  const r0Bits = ipBits.slice(32, 64);
  const l0Hex = ipStep?.data.left_hex || binary_to_hex(l0Bits);
  const r0Hex = ipStep?.data.right_hex || binary_to_hex(r0Bits);

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="font-bold text-sm text-slate-200">
              Stage 1: Initial Permutation (IP) & Halving
            </h3>
            <p className="text-xs text-slate-400">
              Shuffling the 64-bit message block and dividing it into Left (L₀) and Right (R₀) halves.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFullTable(!showFullTable)}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span>{showFullTable ? 'Hide 64-Bit Table' : 'Show Full 64-Bit IP Grid'}</span>
        </button>
      </div>

      {/* 3-Step Visual Diagram for Beginners */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          The 3-Step Process in Plain English
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Step 1: Input */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400">1. Raw Message</span>
              <span className="text-[10px] font-mono text-slate-500">64 Bits</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Your message starts as a single 64-bit block (16 hexadecimal characters).
            </p>
            <div className="p-2 rounded bg-slate-950 font-mono text-xs text-sky-300 font-bold truncate">
              {rawHex}
            </div>
          </div>

          {/* Step 2: Shuffle */}
          <div className="p-3.5 rounded-lg bg-purple-950/30 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400">2. IP Deck Shuffle</span>
              <span className="text-[10px] font-mono text-purple-300">Rearrange</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Bits are systematically shuffled: even bits move to Left, odd bits to Right.
            </p>
            <div className="p-2 rounded bg-slate-950 font-mono text-xs text-purple-300 font-bold truncate">
              {ipHex}
            </div>
          </div>

          {/* Step 3: Split into L0 & R0 */}
          <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">3. Split into 2 Halves</span>
              <span className="text-[10px] font-mono text-emerald-300">32b + 32b</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Divided into Left half (L₀) and Right half (R₀) to enter the 16 Feistel rounds.
            </p>
            <div className="grid grid-cols-2 gap-1 font-mono text-[10px] text-center font-bold">
              <span className="p-1 rounded bg-sky-950 text-sky-300">L₀: {l0Hex}</span>
              <span className="p-1 rounded bg-emerald-950 text-emerald-300">R₀: {r0Hex}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Color-Coded Register Cards (L0 and R0) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* L0 Card */}
        <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-400" />
              Left Half Register (L₀)
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
              {l0Hex}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            Holds the first 32 permuted bits. In Round 1, it will wait patiently while the Right half is processed, then get scrambled via XOR.
          </p>
          <div className="p-2 rounded bg-slate-950 font-mono text-xs text-sky-300 break-all">
            {format_bits_spaced(l0Bits, 4)}
          </div>
        </div>

        {/* R0 Card */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Right Half Register (R₀)
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {r0Hex}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            Holds the second 32 permuted bits. In Round 1, it enters the round function $f$ with Subkey $K_1$, and then becomes the new Left half ($L_1 = R_0$).
          </p>
          <div className="p-2 rounded bg-slate-950 font-mono text-xs text-emerald-300 break-all">
            {format_bits_spaced(r0Bits, 4)}
          </div>
        </div>
      </div>

      {/* Advanced Collapsible 64-Cell Bit Table */}
      {showFullTable && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              Detailed 64-Bit Mapping Grid (Click any cell to trace source)
            </span>
            <span className="text-[11px] text-amber-400 font-mono">
              {selectedBitIndex !== null
                ? `Permuted Bit #${selectedBitIndex + 1} takes Plaintext Bit #${IP[selectedBitIndex]}`
                : 'Click any cell'}
            </span>
          </div>

          <div className="grid grid-cols-8 gap-1.5 font-mono text-xs select-none">
            {IP.map((srcBitPos, permutedIdx) => {
              const isSelected = selectedBitIndex === permutedIdx;
              const bitVal = ipBits[permutedIdx] || '0';
              const isLeftHalf = permutedIdx < 32;

              return (
                <button
                  key={permutedIdx}
                  type="button"
                  onClick={() => setSelectedBitIndex(isSelected ? null : permutedIdx)}
                  className={`p-1.5 rounded-lg border text-center transition ${
                    isSelected
                      ? 'bg-amber-500 text-[var(--text-on-highlight)] font-bold scale-105 shadow-md shadow-amber-500/30'
                      : isLeftHalf
                      ? 'bg-sky-950/40 border-sky-800/60 text-sky-200 hover:border-sky-400'
                      : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200 hover:border-emerald-400'
                  }`}
                  title={`Permuted pos: ${permutedIdx + 1} ← Plaintext pos: ${srcBitPos}`}
                >
                  <div className="text-[8px] opacity-60">#{permutedIdx + 1}</div>
                  <div className="font-bold text-xs">src {srcBitPos}</div>
                  <div className="text-[9px] opacity-80">{bitVal}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
