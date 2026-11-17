import React from 'react';
import { DesFlowchartStageInfo } from '../../explanations/des';
import { ArrowDown, CheckCircle2, Lock, Shuffle, Network, RefreshCw, SplitSquareVertical } from 'lucide-react';

interface DesFlowchartVisualizerProps {
  stageInfo: DesFlowchartStageInfo;
  plaintextHex: string;
  keyHex: string;
  ciphertextHex: string;
  currentRound: number;
  isAtEnd: boolean;
}

export const DesFlowchartVisualizer: React.FC<DesFlowchartVisualizerProps> = ({
  stageInfo,
  plaintextHex,
  keyHex,
  ciphertextHex,
  currentRound,
  isAtEnd,
}) => {
  const { active_nodes, active_substep } = stageInfo;

  const isNodeActive = (id: string) => active_nodes.includes(id);

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-4 flex flex-col h-full space-y-3">
      {/* Flowchart Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-sm text-slate-200">Execution Flowchart</h3>
          <p className="text-xs text-slate-400">DES 5-Step Pipeline (NIST FIPS 46-3)</p>
        </div>
        <div className="flex items-center gap-2">
          {stageInfo.round_number && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Round {stageInfo.round_number}/16
            </span>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
            {stageInfo.step_label}
          </span>
        </div>
      </div>

      {/* Synchronized Flowchart Nodes */}
      <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 font-sans text-xs">
        {/* Node 0: Input Block */}
        <div
          className={`p-3 rounded-xl border transition-all duration-300 ${
            isNodeActive('input')
              ? 'bg-sky-950/70 border-sky-400 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400'
              : 'bg-slate-950/70 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className={isNodeActive('input') ? 'text-sky-300' : 'text-slate-300'}>
                Input Block & Key
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              64 Bits Each
            </span>
          </div>

          {/* Real Input values taken in process */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-1.5 rounded bg-slate-900/90 border border-slate-800/80">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Plaintext (Real Input):</span>
              <span className="text-sky-300 font-bold tracking-wider">{plaintextHex || '—'}</span>
            </div>
            <div className="p-1.5 rounded bg-slate-900/90 border border-slate-800/80">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Cipher Key (Real Input):</span>
              <span className="text-amber-300 font-bold tracking-wider">{keyHex || '—'}</span>
            </div>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className={`w-4 h-4 transition ${isNodeActive('step1_ip') ? 'text-sky-400 scale-125' : ''}`} />
        </div>

        {/* Step 1: Initial Permutation (IP) */}
        <div
          className={`p-3 rounded-xl border transition-all duration-300 ${
            isNodeActive('step1_ip')
              ? 'bg-sky-950/70 border-sky-400 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400'
              : 'bg-slate-950/70 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Shuffle className={`w-3.5 h-3.5 ${isNodeActive('step1_ip') ? 'text-sky-400' : 'text-slate-500'}`} />
              <span className={isNodeActive('step1_ip') ? 'text-sky-300 font-bold' : 'text-slate-300'}>
                1. Initial Permutation (IP)
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Step 1</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Rearranges the 64-bit plaintext.
          </p>
          {stageInfo.stage_id === 'step1_ip' && stageInfo.hex_detail && (
            <div className="mt-1.5 font-mono text-[10px] text-sky-300 bg-sky-950/40 p-1 rounded border border-sky-800/50">
              Permuted 64-bit Hex: {stageInfo.hex_detail}
            </div>
          )}
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className={`w-4 h-4 transition ${isNodeActive('step2_divide') ? 'text-sky-400 scale-125' : ''}`} />
        </div>

        {/* Step 2: Divide into Two Halves */}
        <div
          className={`p-3 rounded-xl border transition-all duration-300 ${
            isNodeActive('step2_divide')
              ? 'bg-sky-950/70 border-sky-400 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400'
              : 'bg-slate-950/70 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <SplitSquareVertical className={`w-3.5 h-3.5 ${isNodeActive('step2_divide') ? 'text-sky-400' : 'text-slate-500'}`} />
              <span className={isNodeActive('step2_divide') ? 'text-sky-300 font-bold' : 'text-slate-300'}>
                2. Divide into Two Halves
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Step 2</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            • Left half (L0) = 32 bits &nbsp;|&nbsp; • Right half (R0) = 32 bits
          </p>

          {/* Show real L0 and R0 values if available */}
          {(stageInfo.left_hex || stageInfo.right_hex) && (
            <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-1 rounded bg-sky-950/40 border border-sky-800/60">
                <span className="text-[9px] uppercase text-sky-400 block font-bold">L₀ (Left 32b):</span>
                <span className="text-slate-200 font-semibold">{stageInfo.left_hex || 'CC00CCFF'}</span>
              </div>
              <div className="p-1 rounded bg-indigo-950/40 border border-indigo-800/60">
                <span className="text-[9px] uppercase text-indigo-400 block font-bold">R₀ (Right 32b):</span>
                <span className="text-slate-200 font-semibold">{stageInfo.right_hex || 'F0AAF0AA'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className={`w-4 h-4 transition ${isNodeActive('step3_feistel') ? 'text-purple-400 scale-125' : ''}`} />
        </div>

        {/* Step 3: 16 Feistel Rounds */}
        <div
          className={`p-3 rounded-xl border transition-all duration-300 ${
            isNodeActive('step3_feistel')
              ? 'bg-purple-950/60 border-purple-400 shadow-xl shadow-purple-500/25 ring-1 ring-purple-400'
              : 'bg-slate-950/70 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Network className={`w-3.5 h-3.5 ${isNodeActive('step3_feistel') ? 'text-purple-400' : 'text-slate-500'}`} />
              <span className={isNodeActive('step3_feistel') ? 'text-purple-300 font-bold' : 'text-slate-300'}>
                3. 16 Feistel Rounds
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              Round {currentRound} / 16
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-1.5 mb-2">
            In each round:
          </p>

          {/* Sub-steps of each round matching Image 1 */}
          <div className="space-y-1 pl-1 text-[11px]">
            <div
              className={`p-1.5 rounded transition flex items-center justify-between ${
                active_substep === 'expansion'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/60 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span>▸ Expand the 32-bit right half to 48 bits.</span>
              {active_substep === 'expansion' && (
                <span className="text-[9px] px-1 rounded bg-purple-500/30 text-purple-200">Active</span>
              )}
            </div>

            <div
              className={`p-1.5 rounded transition flex items-center justify-between ${
                active_substep === 'key_xor'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/60 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span>▸ XOR with the 48-bit round key.</span>
              {active_substep === 'key_xor' && (
                <span className="text-[9px] px-1 rounded bg-purple-500/30 text-purple-200">Active</span>
              )}
            </div>

            <div
              className={`p-1.5 rounded transition flex items-center justify-between ${
                active_substep === 'sbox'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/60 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span>▸ Pass through 8 S-boxes.</span>
              {active_substep === 'sbox' && (
                <span className="text-[9px] px-1 rounded bg-purple-500/30 text-purple-200">Active</span>
              )}
            </div>

            <div
              className={`p-1.5 rounded transition flex items-center justify-between ${
                active_substep === 'permutation'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/60 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span>▸ Apply P-box permutation.</span>
              {active_substep === 'permutation' && (
                <span className="text-[9px] px-1 rounded bg-purple-500/30 text-purple-200">Active</span>
              )}
            </div>

            <div
              className={`p-1.5 rounded transition flex items-center justify-between ${
                active_substep === 'feistel_xor'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/60 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span>▸ XOR with the left half.</span>
              {active_substep === 'feistel_xor' && (
                <span className="text-[9px] px-1 rounded bg-purple-500/30 text-purple-200">Active</span>
              )}
            </div>

            <div
              className={`p-1.5 rounded transition flex items-center justify-between ${
                active_substep === 'swap_halves' || (active_substep === 'feistel_xor' && currentRound < 16)
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/60 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span>▸ Swap the halves.</span>
              {currentRound === 16 && (
                <span className="text-[9px] text-amber-400 italic">(omitted in R16)</span>
              )}
            </div>
          </div>

          {/* Loop feedback indicator */}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-purple-400">
            <span className="flex items-center gap-1 font-mono">
              <RefreshCw className={`w-3 h-3 ${isNodeActive('step3_feistel') ? 'animate-spin' : ''}`} />
              <span>Loop 16 Rounds (1 → 16)</span>
            </span>
            <span className="text-slate-500">K₁ ... K₁₆ applied</span>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className={`w-4 h-4 transition ${isNodeActive('step4_swap') ? 'text-amber-400 scale-125' : ''}`} />
        </div>

        {/* Step 4: Swap */}
        <div
          className={`p-3 rounded-xl border transition-all duration-300 ${
            isNodeActive('step4_swap')
              ? 'bg-amber-950/70 border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400'
              : 'bg-slate-950/70 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${isNodeActive('step4_swap') ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className={isNodeActive('step4_swap') ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                4. Swap
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Step 4</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            • After Round 16, swap the left and right halves (R₁₆ ∥ L₁₆).
          </p>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className={`w-4 h-4 transition ${isNodeActive('step5_fp') ? 'text-emerald-400 scale-125' : ''}`} />
        </div>

        {/* Step 5: Final Permutation (FP) */}
        <div
          className={`p-3 rounded-xl border transition-all duration-300 ${
            isNodeActive('step5_fp')
              ? 'bg-emerald-950/70 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
              : 'bg-slate-950/70 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Shuffle className={`w-3.5 h-3.5 ${isNodeActive('step5_fp') ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className={isNodeActive('step5_fp') ? 'text-emerald-300 font-bold' : 'text-slate-300'}>
                5. Final Permutation (FP)
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Step 5</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            • Produces the 64-bit ciphertext.
          </p>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className={`w-4 h-4 transition ${isAtEnd ? 'text-emerald-400 scale-125' : ''}`} />
        </div>

        {/* Output Block: Real Ciphertext Output */}
        <div
          className={`p-3.5 rounded-xl border transition-all duration-300 ${
            isAtEnd
              ? 'bg-emerald-950/80 border-emerald-400 shadow-2xl shadow-emerald-500/30 ring-2 ring-emerald-400'
              : 'bg-slate-950/70 border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Lock className={`w-4 h-4 ${isAtEnd ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className={isAtEnd ? 'text-emerald-300 font-bold text-sm' : 'text-slate-400'}>
                Ciphertext Output (64 bits)
              </span>
            </div>
            {isAtEnd ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <CheckCircle2 className="w-3 h-3" />
                <span>Complete ✓</span>
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 italic">Awaiting completion</span>
            )}
          </div>

          {/* Real Output taken in process when reached end */}
          <div className="mt-2 font-mono">
            {isAtEnd ? (
              <div className="p-2 rounded-lg bg-slate-900 border border-emerald-500/40 text-center">
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold block mb-0.5">
                  Real Ciphertext (Hex Output):
                </span>
                <span className="text-sm font-bold text-emerald-300 tracking-wider">
                  {ciphertextHex}
                </span>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-[11px]">
                <span className="text-[9px] uppercase tracking-wider block text-slate-600 mb-0.5">Real Output:</span>
                <span>Ready when Step 5 (FP) completes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
