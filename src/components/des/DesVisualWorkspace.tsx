import React, { useState } from 'react';
import { DesTraceStep, DesRoundGroup, DesRoundSummary } from '../../types/des';
import { DesFlowchartStageInfo } from '../../explanations/des';
import { BinaryHexInspector } from './inspectors/BinaryHexInspector';
import { SBoxGridInspector } from './inspectors/SBoxGridInspector';
import { InteractiveFeistelDiagram } from './InteractiveFeistelDiagram';
import {
  format_bits_spaced,
  hex_to_binary
} from '../../algorithms/cryptography/desUtils';
import {
  Shuffle,
  Binary,
  Layers,
  Cpu,
  ArrowRightLeft,
  CheckCircle2
} from 'lucide-react';

interface DesVisualWorkspaceProps {
  currentStep: DesTraceStep;
  stageInfo: DesFlowchartStageInfo;
  rounds: DesRoundGroup[];
  summaries: DesRoundSummary[];
  selectedRound: number;
  onSelectRound: (round: number) => void;
  plaintextHex: string;
  ciphertextHex: string;
  isAtEnd: boolean;
}

export const DesVisualWorkspace: React.FC<DesVisualWorkspaceProps> = ({
  currentStep,
  stageInfo,
  rounds,
  summaries,
  selectedRound,
  onSelectRound,
  plaintextHex,
  ciphertextHex,
  isAtEnd
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'bits'>('visual');
  const [showSBoxDetails, setShowSBoxDetails] = useState<boolean>(false);
  const [selectedSBoxIndex, setSelectedSBoxIndex] = useState<number>(1);

  const roundGroup = rounds[selectedRound - 1] || rounds[0];
  const summary = summaries[selectedRound - 1] || summaries[0];

  const prevL = (roundGroup?.steps?.round_start?.data.left_hex as string) || summary?.left_hex || '';
  const prevR = (roundGroup?.steps?.round_start?.data.right_hex as string) || summary?.right_hex || '';
  const subkey = (roundGroup?.steps?.round_start?.data.subkey_hex as string) || summary?.subkey_hex || '';
  const fOutput = (roundGroup?.steps?.permutation?.data.f_output_hex as string) || summary?.f_hex || '';

  const activeBits = stageInfo.bits_detail || (currentStep.data.bits as string) || '';
  const activeHex = stageInfo.hex_detail || (currentStep.data.hex as string) || '';

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-5">
      {/* Top Header & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-200">DES Encryption Workspace</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Step {currentStep.step_number + 1}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {stageInfo.operation}
          </p>
        </div>

        {/* View Mode Switcher: Visual Canvas vs Bitfields */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('visual')}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition ${
              viewMode === 'visual'
                ? 'bg-purple-600 text-[var(--text-on-accent)] font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Feistel Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('bits')}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition ${
              viewMode === 'bits'
                ? 'bg-purple-600 text-[var(--text-on-accent)] font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Bitfields</span>
          </button>
        </div>
      </div>

      {/* View Mode Content */}
      {viewMode === 'bits' ? (
        <BinaryHexInspector
          label={stageInfo.operation}
          bits={activeBits || (activeHex ? hex_to_binary(activeHex) : '')}
          hex={activeHex}
          description={stageInfo.what_happened}
        />
      ) : (
        <div className="space-y-4">
          {/* 1. Step 1: Initial Permutation (IP) or Input Canvas */}
          {(stageInfo.stage_id === 'input' || stageInfo.stage_id === 'step1_ip') && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Shuffle className="w-4 h-4" />
                  <span>Step 1: 64-Bit Initial Permutation (IP)</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">Input Size: 64 Bits (8 Bytes)</span>
              </div>

              {/* 64-Bit Plaintext Hex Display */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">
                  64-Bit Input Plaintext:
                </span>
                <span className="text-lg font-bold text-sky-300 tracking-widest">
                  {plaintextHex}
                </span>
              </div>

              {/* Permutation Table Information */}
              <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-800/40 text-xs text-slate-300 leading-relaxed">
                <p>
                  The <strong>Initial Permutation (IP)</strong> reorders all 64 bits without discarding or adding data.
                  Even bits are routed to the left register (L₀) and odd bits to the right register (R₀), standardizing bit placement across hardware lanes.
                </p>
              </div>

              {stageInfo.hex_detail && (
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs flex items-center justify-between">
                  <span className="text-slate-400">Permuted Output IP(Plaintext):</span>
                  <span className="text-sky-400 font-bold tracking-wider">{stageInfo.hex_detail}</span>
                </div>
              )}
            </div>
          )}

          {/* 2. Step 2: Divide into Two Halves */}
          {stageInfo.stage_id === 'step2_divide' && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Step 2: 32-Bit Halves Partitioning (L₀ & R₀)</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">32 Bits + 32 Bits = 64 Bits</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Half L0 */}
                <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400 uppercase">Left Half (L₀)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      32 Bits
                    </span>
                  </div>
                  <p className="text-xl font-bold font-mono text-slate-100 tracking-wider">
                    {stageInfo.left_hex || 'CC00CCFF'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Bits 1–32 of the IP output. Passed into Round 1 to be XORed with f(R₀, K₁).
                  </p>
                </div>

                {/* Right Half R0 */}
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 uppercase">Right Half (R₀)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      32 Bits
                    </span>
                  </div>
                  <p className="text-xl font-bold font-mono text-slate-100 tracking-wider">
                    {stageInfo.right_hex || 'F0AAF0AA'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Bits 33–64 of the IP output. Inputs into Round 1 expansion function E(R₀).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Step 3: 16 Feistel Rounds */}
          {stageInfo.stage_id === 'step3_feistel' && (
            <div className="space-y-4">
              {/* 16-Round Selector Ribbon */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-400">
                    Step 3: Select Feistel Round (1–16):
                  </span>
                  <span className="font-mono text-purple-400 font-bold">Round {selectedRound} of 16</span>
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 select-none">
                  {Array.from({ length: 16 }, (_, i) => i + 1).map((r) => {
                    const isSelected = selectedRound === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => onSelectRound(r)}
                        className={`py-1.5 rounded-lg border text-xs font-mono transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-[var(--text-on-accent)] font-bold border-purple-400 shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6 Feistel Operations Sub-Steps Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1. Expansion */}
                <div
                  className={`p-3 rounded-xl border transition ${
                    stageInfo.active_substep === 'expansion'
                      ? 'bg-purple-950/70 border-purple-400 ring-1 ring-purple-400 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">1. Expansion E</span>
                    <span className="text-[10px] font-mono text-purple-400">32b → 48b</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Right half R{selectedRound - 1} is expanded via Table E to 48 bits, duplicating 16 bits.
                  </p>
                </div>

                {/* 2. Key XOR */}
                <div
                  className={`p-3 rounded-xl border transition ${
                    stageInfo.active_substep === 'key_xor'
                      ? 'bg-amber-950/70 border-amber-400 ring-1 ring-amber-400 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">2. Key XOR (⊕)</span>
                    <span className="text-[10px] font-mono text-amber-400">48 Bits</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Expanded R is bitwise XORed with 48-bit round subkey K{selectedRound} ({subkey.slice(0, 8)}...).
                  </p>
                </div>

                {/* 3. S-Boxes */}
                <div
                  className={`p-3 rounded-xl border transition ${
                    stageInfo.active_substep === 'sbox'
                      ? 'bg-pink-950/70 border-pink-400 ring-1 ring-pink-400 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">3. 8 S-Boxes</span>
                    <span className="text-[10px] font-mono text-pink-400">48b → 32b</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    8 substitution boxes shrink 6-bit inputs into 4-bit outputs. Only non-linear step in DES.
                  </p>
                </div>

                {/* 4. P-Box */}
                <div
                  className={`p-3 rounded-xl border transition ${
                    stageInfo.active_substep === 'permutation'
                      ? 'bg-indigo-950/70 border-indigo-400 ring-1 ring-indigo-400 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">4. P-Box Permute</span>
                    <span className="text-[10px] font-mono text-indigo-400">32 Bits</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Rearranges the 32 S-box output bits via Table P to form round function output f(R, K).
                  </p>
                </div>

                {/* 5. XOR with Left */}
                <div
                  className={`p-3 rounded-xl border transition ${
                    stageInfo.active_substep === 'feistel_xor'
                      ? 'bg-purple-950/70 border-purple-400 ring-1 ring-purple-400 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">5. XOR with Left</span>
                    <span className="text-[10px] font-mono text-purple-400">L ⊕ f(R, K)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Left half L{selectedRound - 1} is masked with f(R, K) to produce the updated half.
                  </p>
                </div>

                {/* 6. Swap Halves */}
                <div
                  className={`p-3 rounded-xl border transition ${
                    stageInfo.active_substep === 'feistel_xor' || stageInfo.active_substep === 'swap_halves'
                      ? 'bg-purple-950/70 border-purple-400 ring-1 ring-purple-400 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">6. Swap Halves</span>
                    <span className="text-[10px] font-mono text-purple-400">L & R Swapped</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {selectedRound === 16
                      ? 'After Round 16, the swap is omitted so decryption uses identical structure.'
                      : `Halves are swapped: L${selectedRound} = R${selectedRound - 1}, R${selectedRound} = new half.`}
                  </p>
                </div>
              </div>

              {/* Interactive Feistel Diagram SVG */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <InteractiveFeistelDiagram
                  currentRound={selectedRound}
                  leftHex={prevL}
                  rightHex={prevR}
                  subkeyHex={subkey}
                  fHex={fOutput}
                  onSelectRound={onSelectRound}
                />
              </div>

              {/* S-Box Toggle Inspector Button */}
              {roundGroup?.steps?.s_box?.data?.sboxes && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowSBoxDetails(!showSBoxDetails)}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition flex items-center gap-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{showSBoxDetails ? 'Hide 8 S-Box Detailed Lookups' : 'Inspect 8 S-Box Lookups for Round ' + selectedRound}</span>
                  </button>

                  {showSBoxDetails && roundGroup.steps.s_box.data.sboxes && (
                    <SBoxGridInspector
                      sboxDetail={
                        roundGroup.steps.s_box.data.sboxes[selectedSBoxIndex - 1] ||
                        roundGroup.steps.s_box.data.sboxes[0]
                      }
                      activeBoxIndex={selectedSBoxIndex}
                      onSelectBox={setSelectedSBoxIndex}
                      allSboxDetails={roundGroup.steps.s_box.data.sboxes}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4. Step 4: Swap after Round 16 */}
          {stageInfo.stage_id === 'step4_swap' && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-700/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Step 4: Swap Left and Right Halves (R₁₆ ∥ L₁₆)</span>
                </span>
                <span className="text-xs text-amber-400 font-mono">Pre-output Recombination</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                In standard DES, because Round 16 does not swap halves inside the round loop, a 32-bit swap is performed at Step 4 to form the 64-bit pre-output block:
                <strong className="text-amber-300"> Pre-output = R₁₆ ∥ L₁₆</strong>.
              </p>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-indigo-400 block font-sans font-bold">R₁₆ (32 bits):</span>
                  <span className="text-slate-200 tracking-wider font-semibold">{stageInfo.right_hex || 'F0AAF0AA'}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-sky-400 block font-sans font-bold">L₁₆ (32 bits):</span>
                  <span className="text-slate-200 tracking-wider font-semibold">{stageInfo.left_hex || 'CC00CCFF'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Step 5: Final Permutation (FP) / Output */}
          {(stageInfo.stage_id === 'step5_fp' || stageInfo.stage_id === 'output' || isAtEnd) && (
            <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-600/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Step 5: Final Permutation (FP / IP⁻¹) → 64-Bit Ciphertext</span>
                </span>
                <span className="text-xs text-emerald-300 font-mono">Inverse Permutation</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                The 64-bit pre-output block passes through the <strong>Inverse Initial Permutation (IP⁻¹)</strong>, completely inverting the initial transposition from Step 1 and yielding the final encrypted ciphertext.
              </p>

              {/* Ciphertext Output Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-center space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                  Final 64-Bit Ciphertext (16 Hex Characters):
                </span>
                <p className="text-2xl font-bold font-mono text-emerald-300 tracking-widest">
                  {ciphertextHex}
                </p>
                <div className="text-[11px] font-mono text-slate-400">
                  Binary: {format_bits_spaced(hex_to_binary(ciphertextHex), 4)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
