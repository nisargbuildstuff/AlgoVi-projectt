import React, { useState } from 'react';
import { DesTraceStep } from '../../../types/des';
import { Lock, CheckCircle2, ChevronDown, Lightbulb } from 'lucide-react';

interface FinalPermutationViewProps {
  preoutputStep?: DesTraceStep;
  finalStep?: DesTraceStep;
}

const NIST_CIPHERTEXT = '85E813540F0AB405';

export const FinalPermutationView: React.FC<FinalPermutationViewProps> = ({
  preoutputStep,
  finalStep,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const preoutputHex = (preoutputStep?.data.hex as string) || '';
  const leftHalf = (preoutputStep?.data.left_hex as string) || '';
  const rightHalf = (preoutputStep?.data.right_hex as string) || '';
  const ciphertextHex = (finalStep?.data.hex as string) || '';

  const isNistMatch =
    ciphertextHex.toUpperCase() === NIST_CIPHERTEXT.toUpperCase();

  const handleCelebrate = () => {
    // Popper effect removed per user specification
  };

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-sm text-slate-200">
            Stage 4 &amp; 5: Final Shuffle → Ciphertext
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            One last bit-rearrangement produces your encrypted message.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCelebrate}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[var(--text-on-accent)] font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 active:scale-95 transition"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Celebrate!</span>
        </button>
      </div>

      {/* Beginner Analogy */}
      <div className="flex gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
        <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Think of it as unsealing an envelope:</strong> the final permutation (IP⁻¹)
          is the mirror image of the very first step. It rearranges the bits one last time to produce
          the final ciphertext. Without the key, the output looks like random noise!
        </p>
      </div>

      {/* 3-step Before → After flow */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Step-by-step:
        </p>

        {/* Step 1: Recombine */}
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Step 1 — Recombine the two halves
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            After round 16, the swap was skipped on purpose. The halves are joined as{' '}
            <strong className="text-emerald-300">R₁₆ first, then L₁₆</strong>. This clever trick
            means decryption uses the same algorithm — just feed the subkeys in reverse order!
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs mt-1">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">R₁₆ (first 32 bits)</div>
              <div className="font-bold text-emerald-300">{leftHalf}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-sky-400 font-bold uppercase">L₁₆ (last 32 bits)</div>
              <div className="font-bold text-sky-300">{rightHalf}</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/20 font-mono text-xs space-y-0.5">
            <div className="text-[10px] text-amber-400 font-bold uppercase">Combined pre-output (hex)</div>
            <div className="font-bold text-amber-300">{preoutputHex}</div>
          </div>
        </div>

        {/* Step 2: IP^-1 */}
        <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
            Step 2 — Apply the Inverse Initial Permutation (IP⁻¹)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            This is a simple bit-shuffle — it moves each of the 64 bits to a new position defined
            by a fixed table. It is the exact reverse of the very first step (the Initial Permutation).
            No math, no S-boxes — just reordering.
          </p>
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex-1 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Before shuffle</div>
              <div className="font-bold text-amber-300 mt-0.5">{preoutputHex}</div>
            </div>
            <div className="text-purple-400 font-bold text-lg">→</div>
            <div className="flex-1 p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/40 text-center">
              <div className="text-[10px] text-purple-400 uppercase font-bold">After shuffle</div>
              <div className="font-bold text-emerald-300 mt-0.5">{ciphertextHex}</div>
            </div>
          </div>
        </div>

        {/* Step 3: Ciphertext Output */}
        <div className="p-5 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                Your Ciphertext (Step 3: Done!)
              </span>
            </div>
            <span className="text-xl font-mono font-extrabold text-emerald-300 bg-emerald-500/20 px-4 py-1.5 rounded-xl border border-emerald-500/50 tracking-wider shadow">
              {ciphertextHex}
            </span>
          </div>

          {isNistMatch && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-900/50 border border-emerald-400/40 text-xs text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              NIST Verified — matches the official DES test vector (FIPS 46-3)
            </div>
          )}

          <p className="text-xs text-slate-300 leading-relaxed">
            Your 64-bit plaintext has gone through{' '}
            <strong className="text-white">16 rounds of Feistel scrambling</strong>, bookended by two
            permutations. The result is a fully encrypted, unintelligible ciphertext — readable only
            by someone who holds the same key.
          </p>
        </div>
      </div>

      {/* Advanced details toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition font-medium"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`}
          />
          {showDetails ? 'Hide' : 'Show'} why the swap asymmetry enables decryption
        </button>

        {showDetails && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <p className="font-bold text-slate-200">Why R₁₆ before L₁₆?</p>
            <p>
              In rounds 1–15 each pass ends with a swap: Lᵢ = Rᵢ₋₁ and Rᵢ = Lᵢ₋₁ ⊕ f.
              Round 16 deliberately omits this swap, leaving the halves "un-swapped".
              By then joining them in R₁₆‖L₁₆ order, the final pre-output block has the same
              structure as if the swap <em>had</em> happened — which means you can decrypt by
              running the same Feistel network with subkeys K₁₆ → K₁ in reverse. No separate
              decryption algorithm is needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
