import React from 'react';
import { KeyRound, Network, Shuffle, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export type DesPipelineStage =
  | 'initial_permutation'
  | 'key_generation'
  | 'feistel_network'
  | 'final_permutation'
  | 'ciphertext_output';

export interface StageConfig {
  id: DesPipelineStage;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
}

export const DES_PIPELINE_STAGES: StageConfig[] = [
  {
    id: 'initial_permutation',
    label: '1. Initial Permutation (IP)',
    shortLabel: 'Initial Permutation',
    icon: Shuffle,
    description: 'Transpose 64 plaintext bits into L₀ and R₀ (32 bits each)'
  },
  {
    id: 'key_generation',
    label: '2. Key Schedule (Subkeys)',
    shortLabel: 'Key Schedule',
    icon: KeyRound,
    description: 'PC-1 parity drop (56 bits), circular left shifts, PC-2 compression to 16 subkeys (K₁–K₁₆)'
  },
  {
    id: 'feistel_network',
    label: '3. Feistel Network (16 Rounds)',
    shortLabel: '16 Feistel Rounds',
    icon: Network,
    description: '16 rounds of Expansion, Subkey XOR, 8 S-Boxes, P-Box, Feistel XOR, and 32-bit swap'
  },
  {
    id: 'final_permutation',
    label: '4. Final Permutation (IP⁻¹)',
    shortLabel: 'Final Permutation',
    icon: Shuffle,
    description: 'Pre-output recombination (R₁₆ || L₁₆) transposed via Inverse Initial Permutation'
  },
  {
    id: 'ciphertext_output',
    label: '5. Ciphertext Output',
    shortLabel: 'Ciphertext',
    icon: Lock,
    description: 'Validated 64-bit encrypted output block'
  }
];

interface DesPipelineNavProps {
  currentStage: DesPipelineStage;
  onSelectStage: (stage: DesPipelineStage) => void;
  completedStages: DesPipelineStage[];
}

export const DesPipelineNav: React.FC<DesPipelineNavProps> = ({
  currentStage,
  onSelectStage,
  completedStages
}) => {
  const currentIndex = DES_PIPELINE_STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-3 space-y-2">
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="font-bold uppercase tracking-wider text-slate-400">
          DES Encryption Pipeline
        </span>
        <span className="text-slate-400 font-mono text-[11px]">
          Stage {currentIndex + 1} of 5
        </span>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 select-none">
        {DES_PIPELINE_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCurrent = stage.id === currentStage;
          const isCompleted = completedStages.includes(stage.id);

          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${
                isCurrent
                  ? 'bg-purple-950/70 border-purple-500 text-white ring-2 ring-purple-500/40 shadow-lg shadow-purple-950/50'
                  : isCompleted
                  ? 'bg-slate-950/80 border-slate-700/80 text-slate-300 hover:border-purple-500/50 hover:bg-slate-900'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-purple-500 text-white'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </span>

                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isCurrent
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-800/60 text-slate-400'
                  }`}
                >
                  {isCurrent ? 'Active' : isCompleted ? 'Done' : 'Stage'}
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-purple-300' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold truncate block">{stage.shortLabel}</span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1 group-hover:text-slate-300">
                  {stage.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
