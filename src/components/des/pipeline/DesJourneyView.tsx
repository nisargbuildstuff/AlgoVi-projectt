/**
 * DesJourneyView — Visualizes the full DES encryption journey as a connected pipeline.
 * Plaintext → IP → 16 Rounds → IP⁻¹ → Ciphertext
 * Each stage is a connected block with arrows between them.
 */
import React from 'react';
import { DesPipelineStage } from '../DesPipelineNav';
import { CheckCircle2, ChevronRight, Shuffle, KeyRound, Network, Lock } from 'lucide-react';

interface JourneyStage {
  id: DesPipelineStage;
  label: string;
  shortLabel: string;
  color: string;          // Tailwind color prefix e.g. 'sky'
  borderClass: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
  activeBgClass: string;
  activeBorderClass: string;
  icon: React.ReactNode;
  value?: string;         // Live data value to show
}

interface DesJourneyViewProps {
  currentStage: DesPipelineStage;
  completedStages: DesPipelineStage[];
  onSelectStage: (stage: DesPipelineStage) => void;
  plaintextHex: string;
  ipHex: string;
  l0Hex: string;
  r0Hex: string;
  r16Hex: string;
  l16Hex: string;
  ciphertextHex: string;
  selectedRound: number;
  currentStepIndex: number;
  totalSteps: number;
}

export const DesJourneyView: React.FC<DesJourneyViewProps> = ({
  currentStage,
  completedStages,
  onSelectStage,
  plaintextHex,
  ipHex,
  l0Hex,
  r0Hex,
  r16Hex,
  l16Hex,
  ciphertextHex,
  selectedRound,
  currentStepIndex,
  totalSteps,
}) => {
  const stages: JourneyStage[] = [
    {
      id: 'initial_permutation',
      label: 'Initial Permutation',
      shortLabel: 'IP',
      color: 'sky',
      borderClass: 'border-sky-700/60',
      bgClass: 'bg-sky-950/20',
      textClass: 'text-sky-300',
      badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      activeBgClass: 'bg-sky-950/50',
      activeBorderClass: 'border-sky-400',
      icon: <Shuffle className="w-4 h-4" />,
      value: ipHex ? `${l0Hex} | ${r0Hex}` : '—',
    },
    {
      id: 'key_generation',
      label: 'Key Schedule',
      shortLabel: 'K₁–K₁₆',
      color: 'amber',
      borderClass: 'border-amber-700/60',
      bgClass: 'bg-amber-950/20',
      textClass: 'text-amber-300',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      activeBgClass: 'bg-amber-950/50',
      activeBorderClass: 'border-amber-400',
      icon: <KeyRound className="w-4 h-4" />,
      value: '16 subkeys generated',
    },
    {
      id: 'feistel_network',
      label: '16 Feistel Rounds',
      shortLabel: `Round ${selectedRound}`,
      color: 'purple',
      borderClass: 'border-purple-700/60',
      bgClass: 'bg-purple-950/20',
      textClass: 'text-purple-300',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      activeBgClass: 'bg-purple-950/50',
      activeBorderClass: 'border-purple-400',
      icon: <Network className="w-4 h-4" />,
      value: r16Hex ? `L${selectedRound}=${l0Hex}` : '—',
    },
    {
      id: 'final_permutation',
      label: 'Final Permutation',
      shortLabel: 'IP⁻¹',
      color: 'emerald',
      borderClass: 'border-emerald-700/60',
      bgClass: 'bg-emerald-950/20',
      textClass: 'text-emerald-300',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      activeBgClass: 'bg-emerald-950/50',
      activeBorderClass: 'border-emerald-400',
      icon: <Lock className="w-4 h-4" />,
      value: ciphertextHex || '—',
    },
  ];

  const progressPercent = totalSteps > 1 ? ((currentStepIndex) / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-200">DES Encryption Journey</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Plaintext → IP → 16 Feistel Rounds → IP⁻¹ → Ciphertext
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
          Step {currentStepIndex + 1} / {totalSteps}
        </div>
      </div>

      {/* Journey visual: Plaintext → stages → Ciphertext */}
      <div className="flex items-center gap-0 overflow-x-auto select-none pb-1">
        {/* Plaintext Block */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-center min-w-[80px]">
            <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">Plaintext</div>
            <div className="font-mono text-xs font-bold text-slate-200">{plaintextHex || '—'}</div>
          </div>
        </div>

        {stages.map((stage, idx) => {
          const isActive = currentStage === stage.id;
          const isDone = completedStages.includes(stage.id);

          return (
            <React.Fragment key={stage.id}>
              {/* Arrow connector */}
              <div className="flex-shrink-0 flex items-center px-1">
                <svg width="24" height="16" viewBox="0 0 24 16" className="overflow-visible">
                  <line x1="0" y1="8" x2="20" y2="8" stroke={isActive ? '#a78bfa' : isDone ? '#34d399' : '#475569'} strokeWidth="1.5" />
                  <polygon points="20,4 24,8 20,12" fill={isActive ? '#a78bfa' : isDone ? '#34d399' : '#475569'} />
                </svg>
              </div>

              {/* Stage block */}
              <button
                type="button"
                onClick={() => onSelectStage(stage.id)}
                className={`flex-shrink-0 relative flex flex-col items-center px-3 py-2.5 rounded-xl border transition-all duration-200 min-w-[90px] text-center ${
                  isActive
                    ? `${stage.activeBgClass} ${stage.activeBorderClass} ring-2 ring-offset-1 ring-offset-slate-900 ring-${stage.color}-500/50 shadow-lg`
                    : isDone
                    ? `${stage.bgClass} ${stage.borderClass} opacity-80 hover:opacity-100`
                    : 'bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-80'
                }`}
              >
                {/* Done badge */}
                {isDone && !isActive && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                )}

                <span className={`${isActive ? stage.textClass : isDone ? stage.textClass : 'text-slate-500'} mb-1`}>
                  {stage.icon}
                </span>
                <div className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? stage.textClass : isDone ? stage.textClass : 'text-slate-500'}`}>
                  {stage.shortLabel}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 hidden sm:block font-sans truncate max-w-[80px]">
                  {stage.label}
                </div>
                {/* Step index label */}
                {isActive && (
                  <div className={`mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded ${stage.badgeClass} border`}>
                    Active
                  </div>
                )}
              </button>
            </React.Fragment>
          );
        })}

        {/* Final arrow + Ciphertext */}
        <div className="flex-shrink-0 flex items-center px-1">
          <svg width="24" height="16" viewBox="0 0 24 16" className="overflow-visible">
            <line x1="0" y1="8" x2="20" y2="8" stroke={ciphertextHex ? '#34d399' : '#475569'} strokeWidth="1.5" />
            <polygon points="20,4 24,8 20,12" fill={ciphertextHex ? '#34d399' : '#475569'} />
          </svg>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className={`px-3 py-2.5 rounded-xl border text-center min-w-[90px] transition-all ${
            ciphertextHex
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
              : 'bg-slate-950 border-slate-700'
          }`}>
            <div className="text-[9px] uppercase tracking-wider text-emerald-500 mb-1">Ciphertext</div>
            <div className={`font-mono text-xs font-bold ${ciphertextHex ? 'text-emerald-300' : 'text-slate-500'}`}>
              {ciphertextHex || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-purple-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>Start</span>
          <span>{Math.round(progressPercent)}% complete</span>
          <span>Encrypted</span>
        </div>
      </div>
    </div>
  );
};
