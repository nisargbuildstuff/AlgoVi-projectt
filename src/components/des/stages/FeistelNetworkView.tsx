import React, { useState } from 'react';
import { DesRoundGroup, DesRoundSummary } from '../../../types/des';
import { Cpu, ChevronRight, ChevronDown, Lightbulb } from 'lucide-react';

interface FeistelNetworkViewProps {
  roundGroup: DesRoundGroup;
  selectedRound: number;
  onSelectRound: (round: number) => void;
  onOpenRoundFunctionInspector: () => void;
  summary: DesRoundSummary;
}

export const FeistelNetworkView: React.FC<FeistelNetworkViewProps> = ({
  roundGroup,
  selectedRound,
  onSelectRound,
  onOpenRoundFunctionInspector,
  summary,
}) => {
  const [showDiagram, setShowDiagram] = useState(false);

  const rStart = roundGroup.steps.round_start;
  const rXor = roundGroup.steps.feistel_xor;

  const prevL = (rStart?.data.left_hex as string) || '';
  const prevR = (rStart?.data.right_hex as string) || '';
  const subkey = (rStart?.data.subkey_hex as string) || summary.subkey_hex;
  const fOutput =
    (roundGroup.steps.permutation?.data.f_output_hex as string) || summary.f_hex;
  const nextL = (rXor?.data.left_hex as string) || summary.left_hex;
  const nextR = (rXor?.data.right_hex as string) || summary.right_hex;

  return (
    <div className="algovi-card bg-slate-900 border border-slate-800 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-sm text-slate-200">
            Stage 3: Feistel Round {selectedRound} of 16
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            DES scrambles your message in 16 identical rounds, each using a different slice of your key.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenRoundFunctionInspector}
          className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Inspect Inside f(R, K)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Beginner Analogy */}
      <div className="flex gap-2.5 p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
        <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Think of it like a combination lock:</strong> each of the 16 rounds uses a different
          "slice" of your key (the subkey) to scramble the data. After all 16 rounds, only someone
          with the same key can reverse the process.
        </p>
      </div>

      {/* 16-Round Selector Ribbon */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400">
            Pick a round to inspect:
          </span>
          <span className="font-mono text-purple-400 font-bold">Round {selectedRound} / 16</span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 select-none">
          {Array.from({ length: 16 }, (_, i) => i + 1).map((r) => {
            const isSelected = selectedRound === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onSelectRound(r)}
                className={`py-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-lg shadow-purple-600/30 ring-2 ring-purple-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] font-mono">R{r}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simple 4-Card Flow */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          What happens in Round {selectedRound}?
        </p>

        {/* Row 1: Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Left half passes straight through */}
          <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-sky-400 text-[11px] font-bold uppercase tracking-wider">
              <span>Left half coming in</span>
            </div>
            <div className="font-mono text-base font-bold text-sky-300">{prevL}</div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              This passes straight through — it becomes the new <strong className="text-sky-300">Right half</strong> going out.
              (New R = Old L after the XOR)
            </p>
          </div>

          {/* Right half goes into f() */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              <span>Right half coming in</span>
            </div>
            <div className="font-mono text-base font-bold text-emerald-300">{prevR}</div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              This gets <strong className="text-purple-300">scrambled</strong> by the round function f() together with the subkey.
            </p>
          </div>
        </div>

        {/* Round Key */}
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Subkey K{selectedRound} (the secret ingredient for this round)</span>
          </div>
          <div className="font-mono text-base font-bold text-amber-300">{subkey}</div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Derived from your original 64-bit key. Each round gets a unique 48-bit subkey.
          </p>
        </div>

        {/* f() output */}
        <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 space-y-1.5">
          <div className="flex items-center gap-1.5 text-purple-400 text-[11px] font-bold uppercase tracking-wider">
            <span>f(Right, K{selectedRound}) = scrambled result</span>
          </div>
          <div className="font-mono text-base font-bold text-purple-300">{fOutput}</div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            The right half was expanded, mixed with the subkey, run through S-boxes, and permuted.
            Click <strong className="text-purple-300">Inspect Inside f(R, K)</strong> above to see step-by-step.
          </p>
        </div>

        {/* Arrow + outputs */}
        <div className="flex items-center gap-2 text-slate-500 py-1">
          <div className="flex-1 border-t border-dashed border-slate-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            After this round, the two halves become:
          </span>
          <div className="flex-1 border-t border-dashed border-slate-700" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              New Left half L{selectedRound}
            </div>
            <div className="font-mono text-base font-bold text-emerald-300">{nextL}</div>
            <p className="text-[10px] text-slate-400">= Old Right half (copied across)</p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
              New Right half R{selectedRound}
            </div>
            <div className="font-mono text-base font-bold text-rose-300">{nextR}</div>
            <p className="text-[10px] text-slate-400">= Old Left half XOR f(Old Right, Subkey)</p>
          </div>
        </div>

        {/* Round 16 special note */}
        {selectedRound === 16 && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex gap-2">
            <span className="text-lg leading-none">★</span>
            <p className="leading-relaxed">
              <strong>Round 16 is special:</strong> the halves are NOT swapped at the end. Instead,
              the final block is written as R₁₆ followed by L₁₆. This clever trick lets DES use the
              exact same hardware for both encryption and decryption!
            </p>
          </div>
        )}
      </div>

      {/* Optional SVG Diagram Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowDiagram((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition font-medium"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showDiagram ? 'rotate-180' : ''}`}
          />
          {showDiagram ? 'Hide' : 'Show'} technical Feistel diagram
        </button>

        {showDiagram && (
          <div className="mt-3 w-full flex justify-center overflow-x-auto">
            <svg viewBox="0 0 640 420" className="w-full max-w-[580px] h-auto select-none font-sans">
              <defs>
                <marker id="fa1" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748b" />
                </marker>
                <marker id="fa2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#c084fc" />
                </marker>
                <marker id="fa3" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#34d399" />
                </marker>
              </defs>

              {/* Left In */}
              <rect x="40" y="20" width="170" height="52" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text x="125" y="41" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">Left In (L{selectedRound - 1})</text>
              <text x="125" y="60" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontFamily="monospace" fontWeight="bold">{prevL}</text>

              {/* Right In */}
              <rect x="390" y="20" width="170" height="52" rx="8" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
              <text x="475" y="41" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">Right In (R{selectedRound - 1})</text>
              <text x="475" y="60" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontFamily="monospace" fontWeight="bold">{prevR}</text>

              {/* Arrows down */}
              <line x1="125" y1="72" x2="125" y2="195" stroke="#64748b" strokeWidth="2" markerEnd="url(#fa1)" />
              <line x1="475" y1="72" x2="475" y2="120" stroke="#64748b" strokeWidth="2" markerEnd="url(#fa1)" />

              {/* Subkey */}
              <rect x="490" y="150" width="130" height="40" rx="6" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="555" y="166" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">Subkey K{selectedRound}</text>
              <text x="555" y="181" textAnchor="middle" fill="#fef08a" fontSize="9" fontFamily="monospace">{subkey}</text>
              <line x1="490" y1="170" x2="455" y2="170" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#fa1)" />

              {/* f() box */}
              <g onClick={onOpenRoundFunctionInspector} className="cursor-pointer group">
                <rect x="310" y="120" width="180" height="100" rx="10" fill="#2e1065" stroke="#a855f7" strokeWidth="2.5"
                  className="group-hover:fill-purple-900/60 transition" />
                <text x="400" y="143" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontWeight="bold">Round Function f(R, K)</text>
                <text x="400" y="160" textAnchor="middle" fill="#c084fc" fontSize="8">E-Table → XOR key → S-boxes → P-box</text>
                <rect x="330" y="172" width="140" height="24" rx="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1" />
                <text x="400" y="188" textAnchor="middle" fill="#f3e8ff" fontSize="10" fontFamily="monospace" fontWeight="bold">f = {fOutput}</text>
                <text x="400" y="212" textAnchor="middle" fill="#a78bfa" fontSize="8" fontWeight="bold">Click to inspect</text>
              </g>

              {/* f output to XOR */}
              <path d="M 310 175 L 155 175 L 155 198" fill="none" stroke="#c084fc" strokeWidth="2" markerEnd="url(#fa2)" />

              {/* XOR */}
              <circle cx="125" cy="215" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="125" y="221" textAnchor="middle" fill="#38bdf8" fontSize="20" fontWeight="bold">⊕</text>

              {/* Outputs */}
              {selectedRound < 16 ? (
                <>
                  <path d="M 475 72 L 475 92 L 285 290 L 125 320" fill="none" stroke="#34d399" strokeWidth="2" markerEnd="url(#fa3)" />
                  <text x="310" y="275" fill="#34d399" fontSize="9" fontWeight="bold">New L = Old R</text>
                  <path d="M 125 233 L 125 255 L 345 300 L 475 320" fill="none" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#fa1)" />
                  <text x="175" y="272" fill="#f43f5e" fontSize="9" fontWeight="bold">New R = Old L XOR f</text>
                </>
              ) : (
                <>
                  <path d="M 125 233 L 125 320" fill="none" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#fa1)" />
                  <path d="M 475 72 L 475 320" fill="none" stroke="#34d399" strokeWidth="2" markerEnd="url(#fa3)" />
                  <rect x="230" y="265" width="175" height="28" rx="6" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="318" y="283" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="bold">Round 16: No swap!</text>
                </>
              )}

              {/* Output boxes */}
              <rect x="40" y="330" width="170" height="52" rx="8" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
              <text x="125" y="350" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">Left Out (L{selectedRound})</text>
              <text x="125" y="368" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontFamily="monospace" fontWeight="bold">{nextL}</text>

              <rect x="390" y="330" width="170" height="52" rx="8" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
              <text x="475" y="350" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="bold">Right Out (R{selectedRound})</text>
              <text x="475" y="368" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontFamily="monospace" fontWeight="bold">{nextR}</text>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
