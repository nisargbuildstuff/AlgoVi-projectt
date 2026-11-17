import React, { useState } from 'react';
import { DesRoundGroup } from '../../types/des';
import { SBoxMatrixVisualizer } from './SBoxMatrixVisualizer';
import { format_bits_spaced } from '../../algorithms/cryptography/desUtils';
import { ChevronRight, ArrowRight, ShieldCheck, Binary, Cpu } from 'lucide-react';

interface RoundDeepInspectorProps {
  roundGroup: DesRoundGroup;
  selectedRound: number;
  onSelectRound: (round: number) => void;
}

export const RoundDeepInspector: React.FC<RoundDeepInspectorProps> = ({
  roundGroup,
  selectedRound,
  onSelectRound
}) => {
  const [activeSubstage, setActiveSubstage] = useState<number>(0);
  const { steps } = roundGroup;

  const substages = [
    {
      id: 'round_start',
      title: '1. Round Start & Half Split',
      step: steps.round_start,
      color: 'border-blue-500 text-blue-400'
    },
    {
      id: 'expansion',
      title: '2. Expansion Permutation (E)',
      step: steps.expansion,
      color: 'border-cyan-500 text-cyan-400'
    },
    {
      id: 'key_xor',
      title: '3. Subkey XOR Mixing',
      step: steps.key_xor,
      color: 'border-amber-500 text-amber-400'
    },
    {
      id: 's_box',
      title: '4. S-Box Confusion (8 Boxes)',
      step: steps.s_box,
      color: 'border-purple-500 text-purple-400'
    },
    {
      id: 'permutation',
      title: '5. P-Box Diffusion',
      step: steps.permutation,
      color: 'border-indigo-500 text-indigo-400'
    },
    {
      id: 'feistel_xor',
      title: '6. Feistel XOR & 32-bit Swap',
      step: steps.feistel_xor,
      color: 'border-emerald-500 text-emerald-400'
    }
  ];

  const currentSubstage = substages[activeSubstage];

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-6">
      {/* Round Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-base text-slate-200">
            Round-by-Round Deep Inspector — Round {selectedRound} of 16
          </h3>
          <p className="text-xs text-slate-400">
            Examine each of the 6 Feistel sub-stages and their bit transformations in detail.
          </p>
        </div>

        {/* 16 Round Pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
          {Array.from({ length: 16 }, (_, i) => i + 1).map((r) => (
            <button
              key={r}
              onClick={() => onSelectRound(r)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition ${
                selectedRound === r
                  ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-400/50 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              R{r}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-stages Timeline Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {substages.map((sub, idx) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubstage(idx)}
            className={`p-2.5 rounded-lg text-left transition-all border ${
              activeSubstage === idx
                ? 'bg-slate-800/90 border-purple-500 text-white ring-1 ring-purple-500/50'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
              Stage {idx + 1}
            </span>
            <span className="text-xs font-semibold block truncate">
              {sub.title.split('. ')[1]}
            </span>
          </button>
        ))}
      </div>

      {/* Substage Detailed Content */}
      {currentSubstage && currentSubstage.step && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>{currentSubstage.step.name}</span>
            </h4>
            <span className="text-xs font-mono text-purple-400">
              Trace Step #{currentSubstage.step.step_number}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentSubstage.step.description}
          </p>

          {/* Data Inspector Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {currentSubstage.step.data.subkey_hex && (
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Subkey K{selectedRound} (Hex)</span>
                <p className="text-amber-300 font-bold">{currentSubstage.step.data.subkey_hex}</p>
              </div>
            )}

            {currentSubstage.step.data.left_hex && (
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Left Half L (Hex)</span>
                <p className="text-sky-300 font-bold">{currentSubstage.step.data.left_hex}</p>
              </div>
            )}

            {currentSubstage.step.data.right_hex && (
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Right Half R (Hex)</span>
                <p className="text-emerald-300 font-bold">{currentSubstage.step.data.right_hex}</p>
              </div>
            )}

            {currentSubstage.step.data.f_output_hex && (
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Round Function Output f(R, K) (Hex)</span>
                <p className="text-indigo-300 font-bold">{currentSubstage.step.data.f_output_hex}</p>
              </div>
            )}
          </div>

          {/* Special S-Box Matrix Display for substage 4 (s_box) */}
          {currentSubstage.id === 's_box' && currentSubstage.step.data.sboxes && (
            <div className="pt-2">
              <SBoxMatrixVisualizer sboxes={currentSubstage.step.data.sboxes} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
