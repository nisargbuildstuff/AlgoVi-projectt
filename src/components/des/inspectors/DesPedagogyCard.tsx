import React from 'react';
import { HelpCircle, Info, CheckCircle2, Shield, Sparkles, BookOpen } from 'lucide-react';

export interface DesPedagogyInfo {
  title: string;
  category: string;
  principle: 'Confusion' | 'Diffusion' | 'Avalanche Effect' | 'Feistel Invertibility' | 'Permutation';
  whatHappening: string;
  whyRequired: string;
  inputDesc: string;
  outputDesc: string;
  desContribution: string;
  simpleAnalogy?: string; // Beginner-friendly analogy
}

interface DesPedagogyCardProps {
  info: DesPedagogyInfo;
  isBeginnerMode?: boolean;
}

export const DesPedagogyCard: React.FC<DesPedagogyCardProps> = ({ info, isBeginnerMode = true }) => {
  const getPrincipleColor = () => {
    switch (info.principle) {
      case 'Confusion':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Diffusion':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Avalanche Effect':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Feistel Invertibility':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Permutation':
      default:
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    }
  };

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-4">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <h4 className="font-bold text-sm text-slate-200">{info.title}</h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono text-slate-400">{info.category}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getPrincipleColor()}`}>
            {info.principle}
          </span>
        </div>
      </div>

      {/* Beginner Analogy Banner */}
      {info.simpleAnalogy && (
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
              In Plain English (The Real-World Analogy):
            </span>
            <p className="text-xs text-purple-200 leading-relaxed font-sans">
              {info.simpleAnalogy}
            </p>
          </div>
        </div>
      )}

      {/* 2-Column Explanation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* What is happening */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            What is Happening?
          </span>
          <p className="text-slate-300 leading-relaxed font-sans">{info.whatHappening}</p>
        </div>

        {/* Why required */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Why is this Step Necessary?
          </span>
          <p className="text-slate-300 leading-relaxed font-sans">{info.whyRequired}</p>
        </div>
      </div>

      {/* Input / Output / Contribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Input</span>
          <p className="text-sky-300 font-mono text-[11px]">{info.inputDesc}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Output</span>
          <p className="text-emerald-300 font-mono text-[11px]">{info.outputDesc}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-purple-400 block">Contribution</span>
          <p className="text-slate-300 font-sans text-[11px] leading-normal">{info.desContribution}</p>
        </div>
      </div>
    </div>
  );
};
