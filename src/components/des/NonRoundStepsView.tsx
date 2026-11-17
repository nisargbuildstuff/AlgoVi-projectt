import React from 'react';
import { DesTraceStep } from '../../types/des';
import { format_bits_spaced } from '../../algorithms/cryptography/desUtils';
import { ShieldCheck, ArrowDown, Lock, CheckCircle2, Binary } from 'lucide-react';

interface NonRoundStepsViewProps {
  nonRound: {
    input?: DesTraceStep;
    initial_permutation?: DesTraceStep;
    preoutput_recombination?: DesTraceStep;
    final_permutation?: DesTraceStep;
  };
}

export const NonRoundStepsView: React.FC<NonRoundStepsViewProps> = ({ nonRound }) => {
  const { input, initial_permutation, preoutput_recombination, final_permutation } = nonRound;

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-6 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="font-bold text-base text-slate-200">Non-Round Boundary Transformations</h3>
        <p className="text-xs text-slate-400">
          The structural entry and exit stages of DES: Plaintext → IP → 16 Feistel Rounds → Pre-output → IP⁻¹ → Ciphertext.
        </p>
      </div>

      <div className="space-y-4">
        {/* Stage 1: Plaintext */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              1. 64-Bit Plaintext Input
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30">
              Hex: {input?.data.hex}
            </span>
          </div>
          <p className="text-xs text-slate-400">{input?.description}</p>
          <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto">
            <span className="text-slate-500 block text-[10px]">64 Binary Bits (grouped into nibbles):</span>
            <span className="text-sky-300">{format_bits_spaced((input?.data.bits as string) || '', 4)}</span>
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Stage 2: Initial Permutation IP */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              2. Initial Permutation (IP)
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
              Hex: {initial_permutation?.data.hex}
            </span>
          </div>
          <p className="text-xs text-slate-400">{initial_permutation?.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Initial Left Half L₀ (32 bits):</span>
              <strong className="text-sky-300">{initial_permutation?.data.left_hex}</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Initial Right Half R₀ (32 bits):</span>
              <strong className="text-emerald-300">{initial_permutation?.data.right_hex}</strong>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-400 font-mono">
            ↓ 16 Feistel Rounds Execution ↓
          </div>
        </div>

        {/* Stage 3: Pre-output Recombination */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              3. Pre-Output Recombination (R₁₆ || L₁₆)
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Hex: {preoutput_recombination?.data.hex}
            </span>
          </div>
          <p className="text-xs text-slate-400">{preoutput_recombination?.description}</p>
          <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto">
            <span className="text-slate-500 block text-[10px]">Recombined 64 Bits:</span>
            <span className="text-amber-300">
              {format_bits_spaced((preoutput_recombination?.data.bits as string) || '', 4)}
            </span>
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Stage 4: Final Permutation IP^-1 */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              4. Final Inverse Permutation (IP⁻¹) → Ciphertext
            </span>
            <span className="text-sm font-mono font-bold px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
              {final_permutation?.data.hex}
            </span>
          </div>
          <p className="text-xs text-slate-300">{final_permutation?.description}</p>
          <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-emerald-300 overflow-x-auto">
            <span className="text-slate-500 block text-[10px]">Final Ciphertext Bits:</span>
            <span>{format_bits_spaced((final_permutation?.data.bits as string) || '', 4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
