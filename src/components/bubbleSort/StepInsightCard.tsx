import React from 'react';
import { FlowchartStageInfo, ExecutionStep } from '../../types/steps';
import { Info, HelpCircle, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

interface StepInsightCardProps {
  stageInfo: FlowchartStageInfo;
  step: ExecutionStep;
}

export const StepInsightCard: React.FC<StepInsightCardProps> = ({ stageInfo, step }) => {
  const getBadgeClass = () => {
    switch (step.action) {
      case 'compare':
        return 'algovi-badge algovi-badge-compare';
      case 'swap':
        return 'algovi-badge algovi-badge-swap';
      case 'pass_complete':
        return 'algovi-badge algovi-badge-pass';
      case 'sorted':
        return 'algovi-badge algovi-badge-complete';
      default:
        return 'algovi-badge bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-4">
      {/* Header with Operation Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className={getBadgeClass()}>{stageInfo.operation}</span>
          <span className="text-xs text-slate-400 font-mono">
            Examined: <strong className="text-slate-200">{stageInfo.indices_examined}</strong>
          </span>
        </div>

        {stageInfo.condition && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-xs">
            <span className="text-slate-400">Condition:</span>
            <span className="text-amber-400">{stageInfo.condition}</span>
            {stageInfo.evaluation && (
              <>
                <span className="text-slate-600">→</span>
                <span
                  className={
                    stageInfo.evaluation.includes('True') || stageInfo.evaluation.includes('exchanged')
                      ? 'text-emerald-400 font-bold'
                      : 'text-sky-400 font-bold'
                  }
                >
                  {stageInfo.evaluation}
                </span>
              </>
            )}
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
            <span>Why It Matters (Pedagogy)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {stageInfo.why_it_matters}
          </p>
        </div>
      </div>
    </div>
  );
};
