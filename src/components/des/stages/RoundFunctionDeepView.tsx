import React, { useState } from 'react';
import { E, P } from '../../../algorithms/cryptography/desTables';
import { format_bits_spaced, binary_to_hex } from '../../../algorithms/cryptography/desUtils';
import { DesRoundGroup } from '../../../types/des';
import { SBoxGridInspector } from '../inspectors/SBoxGridInspector';
import { Maximize2, Layers, Shuffle, ChevronRight, ChevronDown, Lightbulb } from 'lucide-react';

interface RoundFunctionDeepViewProps {
  roundGroup: DesRoundGroup;
  selectedRound: number;
  onBackToFeistel: () => void;
}

export const RoundFunctionDeepView: React.FC<RoundFunctionDeepViewProps> = ({
  roundGroup,
  selectedRound,
  onBackToFeistel,
}) => {
  const [openStep, setOpenStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSbox, setSelectedSbox] = useState<number>(1);

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
  const sboxDetails = sboxStep?.data.sboxes || [];
  const pOutBits = (roundGroup.steps.permutation?.data.permuted_bits as string) || '';
  const pOutHex = (roundGroup.steps.permutation?.data.permuted_hex as string) || '';

  const currentSboxDetail = sboxDetails[selectedSbox - 1] || sboxDetails[0];

  const steps = [
    {
      id: 1 as const,
      icon: <Maximize2 className="w-4 h-4 text-cyan-400" />,
      label: 'Step 1 — Expansion (E)',
      tagline: '32 bits → 48 bits',
      color: 'cyan',
    },
    {
      id: 2 as const,
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      label: 'Step 2 — Mix with Subkey (XOR)',
      tagline: '48-bit data ⊕ 48-bit key',
      color: 'amber',
    },
    {
      id: 3 as const,
      icon: <Shuffle className="w-4 h-4 text-purple-400" />,
      label: 'Step 3 — S-Box Substitution',
      tagline: '48 bits → 32 bits (the secret sauce!)',
      color: 'purple',
    },
    {
      id: 4 as const,
      icon: <ChevronRight className="w-4 h-4 text-emerald-400" />,
      label: 'Step 4 — P-Box Permutation',
      tagline: '32-bit shuffle → final f(R,K) output',
      color: 'emerald',
    },
  ];

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-sm text-slate-200">
            Round {selectedRound} — Inside the Round Function f(R, K)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            4 operations transform the 32-bit right half using the round subkey.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToFeistel}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-1.5 transition"
        >
          ← Back to Feistel
        </button>
      </div>

      {/* Beginner Analogy */}
      <div className="flex gap-2.5 p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
        <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>The round function is DES's scrambling engine.</strong> Think of it as a 4-step recipe:
          first stretch the data, then season it with the key, then run it through 8 secret
          substitution tables, and finally shuffle the bits for maximum spread.
        </p>
      </div>

      {/* Pipeline Summary Bar */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400">
        <span className="text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">32-bit R</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">E → 48b</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">⊕ K{selectedRound}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">8 S-boxes → 32b</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">P-box → f output</span>
      </div>

      {/* Accordion Steps */}
      <div className="space-y-2">
        {steps.map((step) => {
          const isOpen = openStep === step.id;
          const borderColor =
            step.color === 'cyan' ? 'border-cyan-500/40' :
            step.color === 'amber' ? 'border-amber-500/40' :
            step.color === 'purple' ? 'border-purple-500/40' :
            'border-emerald-500/40';
          const activeBg =
            step.color === 'cyan' ? 'bg-cyan-950/20' :
            step.color === 'amber' ? 'bg-amber-950/20' :
            step.color === 'purple' ? 'bg-purple-950/20' :
            'bg-emerald-950/20';
          const labelColor =
            step.color === 'cyan' ? 'text-cyan-300' :
            step.color === 'amber' ? 'text-amber-300' :
            step.color === 'purple' ? 'text-purple-300' :
            'text-emerald-300';

          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all ${isOpen ? `${activeBg} ${borderColor}` : 'border-slate-800 bg-slate-950'}`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => setOpenStep(step.id)}
                className="w-full flex items-center justify-between gap-3 p-3.5 text-left"
              >
                <div className="flex items-center gap-2.5">
                  {step.icon}
                  <div>
                    <div className={`text-xs font-bold ${isOpen ? labelColor : 'text-slate-300'}`}>
                      {step.label}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{step.tagline}</div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Step Content */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  {/* ---- Step 1: Expansion ---- */}
                  {step.id === 1 && (
                    <>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        DES expands the 32-bit right half to 48 bits so it can be XORed with the
                        48-bit subkey. The expansion duplicates 16 of the boundary bits — this means
                        each bit influences two S-boxes, spreading changes faster (the{' '}
                        <em>avalanche effect</em>).
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                          <div className="text-[10px] font-bold uppercase text-slate-400">Input: 32-bit Right (R{selectedRound - 1})</div>
                          <div className="text-sm font-bold text-sky-300">{prevRHex}</div>
                          <div className="p-2 rounded bg-slate-950 text-slate-300 overflow-x-auto break-all text-[10px]">
                            {format_bits_spaced(prevR, 4)}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/40 space-y-1.5">
                          <div className="text-[10px] font-bold uppercase text-cyan-400">Output: 48-bit Expanded (E)</div>
                          <div className="text-sm font-bold text-cyan-300">{binary_to_hex(expandedBits)}</div>
                          <div className="p-2 rounded bg-slate-950 text-cyan-300 overflow-x-auto break-all text-[10px]">
                            {format_bits_spaced(expandedBits, 6)}
                          </div>
                        </div>
                      </div>

                      {/* Collapsible E-table */}
                      <details className="group">
                        <summary className="cursor-pointer text-[11px] text-slate-400 hover:text-slate-200 font-medium list-none flex items-center gap-1 select-none">
                          <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                          Show E-table (which bit goes where, amber = duplicated boundary bits)
                        </summary>
                        <div className="mt-2 grid grid-cols-6 gap-1 font-mono text-[10px] text-center">
                          {E.map((srcPos, idx) => {
                            const isDup = idx % 6 === 0 || idx % 6 === 5;
                            return (
                              <div
                                key={idx}
                                className={`p-1.5 rounded border ${isDup ? 'bg-amber-950/40 border-amber-600/60 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                              >
                                <div className="opacity-50">#{idx + 1}</div>
                                <div className="font-bold">{srcPos}</div>
                                <div className="text-cyan-300 mt-0.5">{expandedBits[idx] || '0'}</div>
                              </div>
                            );
                          })}
                        </div>
                      </details>
                    </>
                  )}

                  {/* ---- Step 2: XOR ---- */}
                  {step.id === 2 && (
                    <>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        XOR (exclusive-or) compares each pair of bits: same → 0, different → 1.
                        This mixes the round subkey into the data — the key is the only source of
                        "secret" in the whole cipher.
                      </p>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-[11px]">
                        <div className="space-y-1">
                          <div className="text-cyan-400 font-bold uppercase text-[10px]">Expanded data E(R{selectedRound - 1})</div>
                          <div className="p-2 rounded bg-slate-900 text-cyan-300 overflow-x-auto break-all tracking-wider">
                            {format_bits_spaced(expandedBits, 6)}
                          </div>
                        </div>
                        <div className="text-center text-amber-400 font-bold text-lg">⊕</div>
                        <div className="space-y-1">
                          <div className="text-amber-400 font-bold uppercase text-[10px]">Subkey K{selectedRound} ({subkeyHex})</div>
                          <div className="p-2 rounded bg-slate-900 text-amber-300 overflow-x-auto break-all tracking-wider">
                            {format_bits_spaced(subkeyBits, 6)}
                          </div>
                        </div>
                        <div className="text-center text-purple-400 font-bold text-base">=</div>
                        <div className="space-y-1">
                          <div className="text-purple-400 font-bold uppercase text-[10px]">XOR result → fed into 8 S-boxes</div>
                          <div className="p-2 rounded bg-purple-950/40 border border-purple-500/40 text-purple-200 overflow-x-auto break-all tracking-wider font-bold">
                            {format_bits_spaced(xorBits, 6)}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ---- Step 3: S-Boxes ---- */}
                  {step.id === 3 && currentSboxDetail && (
                    <>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        The 48-bit XOR result is split into eight 6-bit chunks. Each chunk goes into
                        one of eight S-box lookup tables — this is DES's core source of non-linearity
                        and confusion. Each S-box outputs 4 bits, giving 32 bits total.
                      </p>
                      <SBoxGridInspector
                        sboxDetail={currentSboxDetail}
                        activeBoxIndex={selectedSbox}
                        onSelectBox={setSelectedSbox}
                        allSboxDetails={sboxDetails}
                      />
                    </>
                  )}

                  {/* ---- Step 4: P-Box ---- */}
                  {step.id === 4 && (
                    <>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        The 32 bits from the S-boxes are shuffled one more time using Table P.
                        This spreads each S-box's output across different S-boxes in the next round,
                        ensuring changes cascade through the cipher — the{' '}
                        <em>diffusion</em> property.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                          <div className="text-[10px] font-bold uppercase text-purple-400">Input: S-Box Output</div>
                          <div className="text-sm font-bold text-purple-300">{sboxOutHex}</div>
                          <div className="p-2 rounded bg-slate-900 text-purple-200 overflow-x-auto break-all text-[10px]">
                            {format_bits_spaced(sboxOutBits, 4)}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/40 space-y-1.5">
                          <div className="text-[10px] font-bold uppercase text-emerald-400">Output: f(R, K) Result</div>
                          <div className="text-sm font-bold text-emerald-300">{pOutHex}</div>
                          <div className="p-2 rounded bg-slate-900 text-emerald-200 overflow-x-auto break-all text-[10px]">
                            {format_bits_spaced(pOutBits, 4)}
                          </div>
                        </div>
                      </div>

                      {/* Collapsible P-table */}
                      <details className="group">
                        <summary className="cursor-pointer text-[11px] text-slate-400 hover:text-slate-200 font-medium list-none flex items-center gap-1 select-none">
                          <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                          Show P-table (bit positions after permutation)
                        </summary>
                        <div className="mt-2 grid grid-cols-8 gap-1 font-mono text-[10px] text-center">
                          {P.map((srcPos, idx) => (
                            <div key={idx} className="p-1.5 rounded border bg-slate-900 border-slate-800 text-slate-300">
                              <div className="opacity-50">#{idx + 1}</div>
                              <div className="font-bold text-emerald-400">{srcPos}</div>
                              <div className="text-slate-400 mt-0.5">{pOutBits[idx] || '0'}</div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final result callout */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
        <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-emerald-300">Round {selectedRound} f(R, K) result:</strong>{' '}
          <span className="font-mono text-emerald-300 font-bold">{pOutHex}</span>
          {' '}— this 32-bit value is XORed with the left half to produce the new right half for
          the next round.
        </p>
      </div>
    </div>
  );
};
