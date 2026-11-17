import React from 'react';
import { DesFlowchartStageInfo } from '../../explanations/des';
import { Info, HelpCircle, Shield, Key, Cpu, Sparkles } from 'lucide-react';

interface DesStepInsightCardProps {
  stageInfo: DesFlowchartStageInfo;
}

export const DesStepInsightCard: React.FC<DesStepInsightCardProps> = ({ stageInfo }) => {
  const getBadgeClass = () => {
    switch (stageInfo.badge_color) {
      case 'sky':
        return 'algovi-badge bg-sky-500/20 text-sky-300 border border-sky-500/40';
      case 'purple':
        return 'algovi-badge bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case 'pink':
        return 'algovi-badge bg-pink-500/20 text-pink-300 border border-pink-500/40';
      case 'indigo':
        return 'algovi-badge bg-indigo-500/20 text-indigo-300 border border-indigo-500/40';
      case 'amber':
        return 'algovi-badge bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'emerald':
        return 'algovi-badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      default:
        return 'algovi-badge bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-4">
      {/* Header with Operation Badge & Math Formula */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className={getBadgeClass()}>{stageInfo.operation}</span>
          <span className="text-xs text-slate-400 font-mono">
            Principle: <strong className="text-slate-200">{stageInfo.cryptographic_principle}</strong>
          </span>
        </div>

        {stageInfo.mathematical_expression && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-xs">
            <span className="text-slate-400">Formula:</span>
            <span className="text-amber-300 font-bold">{stageInfo.mathematical_expression}</span>
          </div>
        )}
      </div>

      {/* Two Column Pedagogical Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What Happened */}
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Info className="w-3.5 h-3.5" />
            <span>What Just Happened</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {stageInfo.what_happened}
          </p>
        </div>

        {/* Why It Matters */}
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why It Matters (Cryptographic Pedagogy)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {stageInfo.why_it_matters}
          </p>
        </div>
      </div>

      {/* Live State Mini-Cards for Register Values */}
      {(stageInfo.left_hex || stageInfo.right_hex || stageInfo.subkey_hex || stageInfo.f_hex) && (
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          {stageInfo.left_hex && (
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-sky-400 block font-sans font-bold">Left Half (L):</span>
              <span className="text-slate-200 tracking-wider font-semibold">{stageInfo.left_hex}</span>
            </div>
          )}
          {stageInfo.right_hex && (
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-indigo-400 block font-sans font-bold">Right Half (R):</span>
              <span className="text-slate-200 tracking-wider font-semibold">{stageInfo.right_hex}</span>
            </div>
          )}
          {stageInfo.subkey_hex && (
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-amber-400 block font-sans font-bold">Round Subkey (K):</span>
              <span className="text-amber-200 tracking-wider font-semibold">{stageInfo.subkey_hex}</span>
            </div>
          )}
          {stageInfo.f_hex && (
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-purple-400 block font-sans font-bold">f(R, K) Output:</span>
              <span className="text-purple-200 tracking-wider font-semibold">{stageInfo.f_hex}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
