import React, { useState } from 'react';
import { PC1, PC2, SHIFTS } from '../../../algorithms/cryptography/desTables';
import {
  hex_to_binary,
  binary_to_hex,
  format_bits_spaced,
  permute,
  leftShift
} from '../../../algorithms/cryptography/desUtils';
import { KeyRound, ShieldAlert, ArrowRight, CheckCircle2, Sparkles, Eye, Layers } from 'lucide-react';

interface KeyScheduleViewProps {
  keyHex: string;
  selectedRound: number;
  onSelectRound: (round: number) => void;
  isBeginnerMode?: boolean;
}

export const KeyScheduleView: React.FC<KeyScheduleViewProps> = ({
  keyHex,
  selectedRound,
  onSelectRound,
  isBeginnerMode = true
}) => {
  const [activeTab, setActiveTab] = useState<'simple_flow' | 'all_subkeys' | 'bit_strip'>('simple_flow');

  const keyBits = hex_to_binary(keyHex);

  // Derive all 16 rounds of C, D, and subkeys
  const pc1Bits = permute(keyBits, PC1);
  let c = pc1Bits.slice(0, 28);
  let d = pc1Bits.slice(28, 56);

  const roundData: {
    round: number;
    shift: number;
    c: string;
    d: string;
    subkeyBits: string;
    subkeyHex: string;
  }[] = [];

  for (let r = 0; r < 16; r++) {
    const shift = SHIFTS[r];
    c = leftShift(c, shift);
    d = leftShift(d, shift);
    const cd = c + d;
    const subkey = permute(cd, PC2);
    roundData.push({
      round: r + 1,
      shift,
      c,
      d,
      subkeyBits: subkey,
      subkeyHex: binary_to_hex(subkey)
    });
  }

  const currentRoundData = roundData[selectedRound - 1] || roundData[0];

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-sm text-slate-200">
              Stage 2: Key Schedule — Making 16 Round Keys (K₁ to K₁₆)
            </h3>
            <p className="text-xs text-slate-400">
              Generating 16 unique subkeys from your 1 master key so every round gets fresh entropy.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('simple_flow')}
            className={`px-3 py-1 rounded transition font-medium ${
              activeTab === 'simple_flow'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Visual Flow
          </button>
          <button
            onClick={() => setActiveTab('all_subkeys')}
            className={`px-3 py-1 rounded transition font-medium ${
              activeTab === 'all_subkeys'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All 16 Subkeys List
          </button>
          <button
            onClick={() => setActiveTab('bit_strip')}
            className={`px-3 py-1 rounded transition font-medium ${
              activeTab === 'bit_strip'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Parity Bit Details
          </button>
        </div>
      </div>

      {/* Beginner Analogy Card */}
      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block">
            Why do we need 16 subkeys?
          </span>
          <p className="text-amber-200/90 leading-relaxed font-sans">
            Imagine locking a door with 16 deadbolts. If you used the exact same key 16 times in a row, a burglar watching would only need to copy one shape. Instead, DES takes your 1 master key and rotates its bits differently each round to forge <strong>16 distinct subkeys</strong>!
          </p>
        </div>
      </div>

      {/* Round Selection Ribbon */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400">
            Click any Round to see its Subkey (K₁ to K₁₆):
          </span>
          <span className="font-mono text-amber-400 font-bold text-xs">
            Viewing Subkey K{selectedRound} (Shift: {SHIFTS[selectedRound - 1]} bit{SHIFTS[selectedRound - 1] > 1 ? 's' : ''})
          </span>
        </div>

        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 select-none">
          {Array.from({ length: 16 }, (_, i) => i + 1).map((r) => {
            const isSelected = selectedRound === r;
            const shift = SHIFTS[r - 1];
            return (
              <button
                key={r}
                type="button"
                onClick={() => onSelectRound(r)}
                className={`py-2 px-1 rounded-lg border text-center transition ${
                  isSelected
                    ? 'bg-amber-500 text-[var(--text-on-highlight)] font-bold border-amber-400 ring-2 ring-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="text-[9px] uppercase font-mono">R{r}</div>
                <div className="text-xs font-bold font-mono">K{r}</div>
                <div className="text-[9px] opacity-75">{shift}b</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Simple Visual Flow */}
      {activeTab === 'simple_flow' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Step 1: Master Key */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 block text-xs">1. Master Key (64 bits)</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Your password. 8 parity bits are dropped (leaving 56 bits) and split into two 28-bit blocks: C₀ and D₀.
              </p>
              <div className="p-2 rounded bg-slate-900 font-mono text-xs text-amber-300 font-bold truncate">
                {keyHex}
              </div>
            </div>

            {/* Step 2: Cyclic Shift */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 block text-xs">
                2. Circular Shift (Round {selectedRound})
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Registers C and D are rotated left by <strong>{currentRoundData.shift} bit{currentRoundData.shift > 1 ? 's' : ''}</strong> to form C{selectedRound} and D{selectedRound}.
              </p>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-center">
                <span className="p-1 rounded bg-sky-950 text-sky-300 truncate">C{selectedRound}: 28b</span>
                <span className="p-1 rounded bg-emerald-950 text-emerald-300 truncate">D{selectedRound}: 28b</span>
              </div>
            </div>

            {/* Step 3: Round Subkey Ki */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
              <span className="font-bold text-amber-300 block text-xs">
                3. Subkey K{selectedRound} Output (48 bits)
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                PC-2 selects 48 bits from (C{selectedRound} + D{selectedRound}) to directly scramble data in Round {selectedRound}.
              </p>
              <div className="p-2 rounded bg-slate-900 font-mono text-xs text-amber-300 font-bold truncate">
                {currentRoundData.subkeyHex}
              </div>
            </div>
          </div>

          {/* Current Subkey Highlight Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-sans text-xs font-semibold">
                Subkey K{selectedRound} Hex (12 characters = 48 bits):
              </span>
              <span className="font-bold text-base text-amber-300 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/30 tracking-wider">
                {currentRoundData.subkeyHex}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 text-amber-300 text-[11px] overflow-x-auto break-all">
              {format_bits_spaced(currentRoundData.subkeyBits, 6)}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: All 16 Subkeys List */}
      {activeTab === 'all_subkeys' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Round</th>
                <th className="py-2.5 px-3">Rotation</th>
                <th className="py-2.5 px-3">Subkey Hex (48 bits / 12 hex)</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
              {roundData.map((rd) => {
                const isSelected = selectedRound === rd.round;
                return (
                  <tr
                    key={rd.round}
                    className={`transition ${
                      isSelected
                        ? 'bg-amber-950/40 text-amber-200 font-bold border-l-4 border-amber-400'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 text-amber-400">Round {rd.round.toString().padStart(2, '0')}</td>
                    <td className="py-2 px-3 text-slate-400">{rd.shift} bit{rd.shift > 1 ? 's' : ''}</td>
                    <td className="py-2 px-3 text-amber-300 font-bold">{rd.subkeyHex}</td>
                    <td className="py-2 px-3">
                      <button
                        type="button"
                        onClick={() => onSelectRound(rd.round)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-amber-500 hover:text-[var(--text-on-highlight)] text-[10px] text-slate-300 transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Parity Bit Details */}
      {activeTab === 'bit_strip' && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
          <span className="font-bold text-amber-400 block font-sans">
            64-Bit Key Parity Strip (Discarded parity bits shown in red with strikethrough):
          </span>
          <div className="grid grid-cols-16 gap-1 text-center text-[10px]">
            {Array.from({ length: 64 }, (_, idx) => {
              const bitPos = idx + 1;
              const isParity = bitPos % 8 === 0;
              const bitVal = keyBits[idx] || '0';
              return (
                <div
                  key={bitPos}
                  className={`p-1 rounded border ${
                    isParity
                      ? 'bg-rose-950/60 border-rose-700/80 text-rose-300 line-through'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                  title={isParity ? `Bit ${bitPos}: Parity bit (discarded)` : `Bit ${bitPos}: Active key bit`}
                >
                  <div className="text-[8px] opacity-60">#{bitPos}</div>
                  <div className="font-bold">{bitVal}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
