import React from 'react';
import { BinarySearchStep } from '../../types/binarySearch';
import { mapBinarySearchStepToInsight } from '../../explanations/binarySearch';
import { Calculator, Compass, Lightbulb, CheckCircle2, AlertOctagon } from 'lucide-react';

interface FormulaInsightCardProps {
  step: BinarySearchStep;
  totalSteps: number;
}

export const FormulaInsightCard: React.FC<FormulaInsightCardProps> = ({ step, totalSteps }) => {
  const insight = mapBinarySearchStepToInsight(step, totalSteps);

  const getBadgeColor = () => {
    switch (insight.badge_color) {
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'purple':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'amber':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'rose':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getBadgeColor()}`}>
            {insight.badge}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Candidates Left: <strong className="text-white font-bold">{insight.remaining_elements}</strong>
          </span>
        </div>

        {/* Formula Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-xs">
          <Calculator className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-300 font-bold">{insight.formula}</span>
        </div>
      </div>

      {/* Interval Callout */}
      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Active Search Interval:</span>
          <strong className="text-emerald-300 font-bold">{insight.interval_text}</strong>
        </div>
      </div>

      {/* Pedagogical Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Decision Breakdown
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {insight.what_happened}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            Why Binary Search Excels
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {insight.why_it_matters}
          </p>
        </div>
      </div>
    </div>
  );
};
