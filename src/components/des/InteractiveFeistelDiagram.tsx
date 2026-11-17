import React from 'react';
import { Cpu, Key, Shuffle } from 'lucide-react';

interface InteractiveFeistelDiagramProps {
  currentRound?: number;
  leftHex?: string;
  rightHex?: string;
  subkeyHex?: string;
  fHex?: string;
  onSelectRound?: (round: number) => void;
}

export const InteractiveFeistelDiagram: React.FC<InteractiveFeistelDiagramProps> = ({
  currentRound = 1,
  leftHex = 'CC00CCFF',
  rightHex = 'F0AAF0AA',
  subkeyHex = '1B02EFFC7072',
  fHex = '234AA9BB',
  onSelectRound
}) => {
  return (
    <div className="algovi-card bg-[#0b1120] border border-slate-800/80 p-5 space-y-4 shadow-xl">
      {/* Header & Round Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-sm text-slate-100">DES Feistel Round Architecture</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Round {currentRound} of 16: L_{currentRound - 1}, R_{currentRound - 1} → L_{currentRound}, R_{currentRound}
          </p>
        </div>

        {/* 16 Round Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
          {Array.from({ length: 16 }, (_, i) => i + 1).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onSelectRound && onSelectRound(r)}
              className={`px-2 py-1 text-[11px] font-mono rounded-lg transition ${
                currentRound === r
                  ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-400/50 shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              R{r}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Diagram Canvas (Clean, non-overlapping, spacious 760x490 viewBox) */}
      <div className="w-full flex justify-center py-2 overflow-x-auto">
        <svg
          viewBox="0 0 760 480"
          className="w-full max-w-[760px] h-auto select-none font-sans"
        >
          <defs>
            <marker
              id="feistel-arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#94a3b8" />
            </marker>
            <marker
              id="feistel-arrow-cyan"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
            </marker>
            <marker
              id="feistel-arrow-purple"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#c084fc" />
            </marker>
            <marker
              id="feistel-arrow-amber"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
            </marker>
            <marker
              id="feistel-arrow-rose"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#f43f5e" />
            </marker>
          </defs>

          {/* ================= TOP INPUTS ================= */}
          {/* L_{i-1} Block (Left Lane) */}
          <rect x="60" y="25" width="200" height="52" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          <text x="160" y="47" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">
            Left Half L_{currentRound - 1} (32 bits)
          </text>
          <text x="160" y="65" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
            {leftHex}
          </text>

          {/* R_{i-1} Block (Right Lane) */}
          <rect x="420" y="25" width="200" height="52" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
          <text x="520" y="47" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">
            Right Half R_{currentRound - 1} (32 bits)
          </text>
          <text x="520" y="65" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
            {rightHex}
          </text>

          {/* ================= CONNECTING LINES FROM TOP ================= */}
          {/* Vertical down line from L_{i-1} directly into XOR */}
          <line x1="160" y1="77" x2="160" y2="230" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#feistel-arrow-cyan)" />

          {/* Vertical down line from R_{i-1} directly into F box */}
          <line x1="520" y1="77" x2="520" y2="128" stroke="#10b981" strokeWidth="2" markerEnd="url(#feistel-arrow)" />

          {/* ================= FEISTEL FUNCTION f(R, K) BOX ================= */}
          <rect x="340" y="130" width="280" height="110" rx="12" fill="#1e1035" stroke="#a855f7" strokeWidth="2" />
          <text x="480" y="152" textAnchor="middle" fill="#f3e8ff" fontSize="12" fontWeight="bold">
            Feistel Round Function f(R_{currentRound - 1}, K_{currentRound})
          </text>

          {/* Subcomponents inside F Box: E-Box -> XOR -> 8 S-Boxes -> P-Box */}
          {/* E-Box */}
          <rect x="355" y="165" width="46" height="30" rx="5" fill="#2e1065" stroke="#c084fc" strokeWidth="1" />
          <text x="378" y="184" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontWeight="bold">E-Box</text>

          {/* XOR Key sign */}
          <text x="415" y="186" textAnchor="middle" fill="#fbbf24" fontSize="15" fontWeight="bold">⊕</text>

          {/* S-Boxes */}
          <rect x="430" y="165" width="75" height="30" rx="5" fill="#2e1065" stroke="#c084fc" strokeWidth="1" />
          <text x="467" y="184" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontWeight="bold">8 S-Boxes</text>

          {/* Arrow */}
          <line x1="510" y1="180" x2="524" y2="180" stroke="#c084fc" strokeWidth="1.5" markerEnd="url(#feistel-arrow-purple)" />

          {/* P-Box */}
          <rect x="532" y="165" width="46" height="30" rx="5" fill="#2e1065" stroke="#c084fc" strokeWidth="1" />
          <text x="555" y="184" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontWeight="bold">P-Box</text>

          {/* Output text at bottom of F */}
          <text x="480" y="225" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">
            f-out: <tspan fill="#c084fc" fontWeight="bold">{fHex}</tspan>
          </text>

          {/* ================= 48-BIT SUBKEY INPUT (EXTERNAL, NO OVERLAP) ================= */}
          <rect x="640" y="160" width="105" height="44" rx="8" fill="#1e1805" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="692" y="178" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">
            Subkey K_{currentRound} (48b)
          </text>
          <text x="692" y="194" textAnchor="middle" fill="#fde68a" fontSize="9" fontFamily="monospace">
            {subkeyHex.slice(0, 8)}...
          </text>

          {/* Line from Subkey entering the XOR in F box */}
          <line x1="640" y1="182" x2="424" y2="182" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#feistel-arrow-amber)" />

          {/* ================= F-OUTPUT FLOWS LEFT TO XOR ================= */}
          <path
            d="M 340 185 L 205 185 L 205 240 L 180 248"
            fill="none"
            stroke="#c084fc"
            strokeWidth="2.5"
            markerEnd="url(#feistel-arrow-purple)"
          />

          {/* XOR Circle on Left Lane */}
          <circle cx="160" cy="250" r="18" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
          <text x="160" y="256" textAnchor="middle" fill="#06b6d4" fontSize="20" fontWeight="bold">
            ⊕
          </text>

          {/* ================= 32-BIT HALVES SWAP CROSSOVER ================= */}
          {currentRound === 16 ? (
            /* Round 16: No Swap (Direct down per standard DES) */
            <>
              {/* L15 ^ f directly to L16 */}
              <line x1="160" y1="268" x2="160" y2="390" stroke="#f43f5e" strokeWidth="2.5" markerEnd="url(#feistel-arrow-rose)" />
              {/* R15 directly to R16 */}
              <line x1="520" y1="240" x2="520" y2="390" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#feistel-arrow)" />

              <rect x="230" y="315" width="300" height="30" rx="6" fill="#1e1805" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="380" y="334" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">
                ★ Round 16: 32-Bit Half Swap is OMITTED
              </text>
            </>
          ) : (
            /* Rounds 1 to 15: Smooth Non-Colliding Bézier Crossover */
            <>
              {/* Path 1: XOR output (L_{i-1} ^ f) crosses smoothly over to New Right Half R_i */}
              <path
                d="M 160 268 C 160 330, 480 320, 520 390"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                markerEnd="url(#feistel-arrow-rose)"
              />

              {/* Path 2: Unmodified R_{i-1} passes from top-right down across to New Left Half L_i */}
              <path
                d="M 420 70 C 320 140, 240 280, 160 390"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 2"
                markerEnd="url(#feistel-arrow)"
              />

              {/* Central Swap Indicator Badge */}
              <rect x="315" y="315" width="130" height="26" rx="13" fill="#0b1120" stroke="#a855f7" strokeWidth="1.5" />
              <text x="380" y="332" textAnchor="middle" fill="#d8b4fe" fontSize="10" fontWeight="bold">
                ⇄ 32-Bit Swap
              </text>
            </>
          )}

          {/* ================= BOTTOM OUTPUTS ================= */}
          {/* New Left Half L_i Block */}
          <rect x="60" y="400" width="200" height="52" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
          <text x="160" y="422" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">
            New Left Half L_{currentRound} (32 bits)
          </text>
          <text x="160" y="440" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
            {currentRound === 16 ? `= L₁₅ ⊕ f` : `= R_{currentRound - 1} (${rightHex.slice(0, 8)})`}
          </text>

          {/* New Right Half R_i Block */}
          <rect x="420" y="400" width="200" height="52" rx="10" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
          <text x="520" y="422" textAnchor="middle" fill="#f43f5e" fontSize="12" fontWeight="bold">
            New Right Half R_{currentRound} (32 bits)
          </text>
          <text x="520" y="440" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
            {currentRound === 16 ? `= R₁₅ (${rightHex.slice(0, 8)})` : `= L_{currentRound - 1} ⊕ f`}
          </text>
        </svg>
      </div>
    </div>
  );
};
