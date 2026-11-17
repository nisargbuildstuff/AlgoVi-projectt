import React, { useState } from 'react';
import { generate_subkeys } from '../../algorithms/cryptography/des';
import { SHIFTS } from '../../algorithms/cryptography/desTables';
import { binary_to_hex, format_bits_spaced } from '../../algorithms/cryptography/desUtils';
import { Key, ChevronDown, ChevronUp } from 'lucide-react';

interface DesKeyGenerationAndFeaturesProps {
  cipherKeyHex: string;
  selectedRound: number;
  onSelectRound: (round: number) => void;
}

export const DesKeyGenerationAndFeatures: React.FC<DesKeyGenerationAndFeaturesProps> = ({
  cipherKeyHex,
  selectedRound,
  onSelectRound,
}) => {
  const [showSubkeysList, setShowSubkeysList] = useState<boolean>(false);

  // Compute 16 subkeys for the active cipher key
  let subkeys: string[] = [];
  try {
    const res = generate_subkeys(cipherKeyHex);
    subkeys = res.subkeys;
  } catch {
    subkeys = [];
  }

  return (
    <div className="space-y-4">
      {/* Key Generation Section (from Image 1: Input key 64b, Effective key 56b, 8 parity stripped, 16 48b subkeys) */}
      <div className="algovi-card bg-[#0b1120] border border-slate-800/80 p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-md">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Key Generation (Key Schedule)</h3>
              <p className="text-xs text-slate-400">PC-1 Parity Strip → Circular Left Shifts → PC-2 Subkey Compression</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSubkeysList(!showSubkeysList)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <span>{showSubkeysList ? 'Hide 16 Round Subkeys' : 'View All 16 Round Subkeys (K₁–K₁₆)'}</span>
            {showSubkeysList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 4 Key Points directly from Image 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">1. Input Key</span>
            <p className="font-mono text-base font-bold text-amber-300">64 bits</p>
            <p className="text-[11px] text-slate-400">Standard 8-byte cipher key provided by user or preset.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">2. Effective Key</span>
            <p className="font-mono text-base font-bold text-cyan-300">56 bits</p>
            <p className="text-[11px] text-slate-400">Actual security entropy determining the total key space ($2^{56}$).</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">3. Parity Stripped</span>
            <p className="font-mono text-base font-bold text-rose-400">8 parity bits</p>
            <p className="text-[11px] text-slate-400">Bits 8, 16, 24, 32, 40, 48, 56, 64 are removed by PC-1.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">4. Subkeys Generated</span>
            <p className="font-mono text-base font-bold text-purple-300">16 round keys</p>
            <p className="text-[11px] text-slate-400">Each subkey is exactly <strong>48 bits</strong>, compressed via PC-2.</p>
          </div>
        </div>

        {/* Interactive 16 Subkeys Viewer */}
        {showSubkeysList && subkeys.length === 16 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
              <span>16 Generated 48-Bit Round Subkeys (K₁ to K₁₆):</span>
              <span className="text-amber-400 font-mono text-[11px]">Shift schedule: 1 bit for R1, R2, R9, R16; 2 bits for others</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {subkeys.map((skBits, idx) => {
                const roundNum = idx + 1;
                const hexVal = binary_to_hex(skBits);
                const shift = SHIFTS[idx];
                const isSelected = selectedRound === roundNum;

                return (
                  <button
                    key={roundNum}
                    type="button"
                    onClick={() => onSelectRound(roundNum)}
                    className={`p-2.5 rounded-lg border text-left transition font-mono text-xs ${
                      isSelected
                        ? 'bg-purple-950/80 border-purple-400 ring-1 ring-purple-400 text-white shadow'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-400">K{roundNum} (Round {roundNum})</span>
                      <span className="text-[10px] text-slate-400 font-sans">Shift: {shift} bit{shift > 1 ? 's' : ''}</span>
                    </div>
                    <div className="font-bold text-slate-100 tracking-wider">
                      {hexVal}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {format_bits_spaced(skBits.slice(0, 16), 4)}...
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
